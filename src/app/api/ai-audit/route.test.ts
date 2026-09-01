import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  classifyPurpose: vi.fn(),
  createBusinessAudit: vi.fn(),
  consume: vi.fn(),
  consumeGlobal: vi.fn(),
  moderation: vi.fn(),
  turnstile: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/ai/config", () => ({
  aiConfig: { timeoutMs: 25_000 },
  isServerPipelineConfigured: () => true,
}));
vi.mock("@/lib/ai/audit", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/ai/audit")>();
  return { ...actual, createBusinessAudit: mocks.createBusinessAudit };
});
vi.mock("@/lib/ai/moderation", () => ({ isModerationBlocked: mocks.moderation }));
vi.mock("@/lib/ai/purpose-gate", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/ai/purpose-gate")>();
  return { ...actual, classifyPurpose: mocks.classifyPurpose };
});
vi.mock("@/lib/security/rate-limit", () => ({
  createRateLimiter: () => ({ consume: mocks.consume, consumeGlobal: mocks.consumeGlobal }),
  hashVisitor: () => "visitor-hash",
}));
vi.mock("@/lib/security/turnstile", () => ({ verifyTurnstile: mocks.turnstile }));
vi.mock("@/lib/security/client-ip", () => ({ getClientIp: () => "203.0.113.1" }));

import { POST } from "./route";
import { FullAuditUnavailableError } from "@/lib/ai/audit";
import { PurposeGateUnavailableError } from "@/lib/ai/purpose-gate";

const businessProcess = "Заявки приходят в WhatsApp, менеджеры вручную переносят их в CRM и распределяют между сотрудниками отдела продаж.";

function request(process = businessProcess, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/ai-audit", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ process, locale: "ru", turnstileToken: "test-token" }),
  });
}

describe("AI audit route gates", () => {
  beforeEach(() => {
    mocks.turnstile.mockResolvedValue(true);
    mocks.consume.mockResolvedValue({ allowed: true, retryAfter: 0 });
    mocks.consumeGlobal.mockResolvedValue({ allowed: true, retryAfter: 0 });
    mocks.moderation.mockResolvedValue(false);
    mocks.classifyPurpose.mockResolvedValue({
      result: { allowed: true, category: "business_automation", reason: "workflow" },
      usage: {},
      attempts: 1,
    });
    mocks.createBusinessAudit.mockResolvedValue({
      result: {
        plainLanguage: { currentProcess: "Current process", whatCanBeAutomated: ["Capture"], aiRole: ["Classify"], humanRole: ["Review"] },
        summary: "Summary",
        automationOpportunities: [], architecture: [], requirements: [], questions: [], risks: [], nextStep: "Next",
      },
      usage: {},
      attempts: 1,
    });
  });

  it("does not call either OpenAI model for invalid obvious off-topic input", async () => {
    const response = await POST(request("привет"));
    expect(response.status).toBe(400);
    expect(mocks.classifyPurpose).not.toHaveBeenCalled();
    expect(mocks.createBusinessAudit).not.toHaveBeenCalled();
  });

  it("does not call the purpose model after deterministic denial", async () => {
    const response = await POST(request("Напиши React сайт и сгенерируй весь код приложения с красивой главной страницей и формой обратной связи."));
    expect(response.status).toBe(403);
    expect(mocks.classifyPurpose).not.toHaveBeenCalled();
    expect(mocks.createBusinessAudit).not.toHaveBeenCalled();
  });

  it("does not call the main audit model after purpose-gate denial", async () => {
    mocks.classifyPurpose.mockResolvedValue({
      result: { allowed: false, category: "off_topic", reason: "not a workflow" },
      usage: { inputTokens: 80, outputTokens: 10, totalTokens: 90 },
      attempts: 1,
    });
    const response = await POST(request());
    expect(response.status).toBe(403);
    expect(mocks.classifyPurpose).toHaveBeenCalledOnce();
    expect(mocks.createBusinessAudit).not.toHaveBeenCalled();
  });

  it("returns AI_UNAVAILABLE and safely logs an incomplete purpose gate", async () => {
    const consoleInfo = vi.spyOn(console, "info").mockImplementation(() => undefined);
    mocks.classifyPurpose.mockRejectedValue(new PurposeGateUnavailableError("incomplete"));

    const response = await POST(request());
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ error: { code: "AI_UNAVAILABLE" } });
    expect(mocks.createBusinessAudit).not.toHaveBeenCalled();

    const logEntries = consoleInfo.mock.calls.map(([entry]) => JSON.parse(String(entry)) as Record<string, unknown>);
    expect(logEntries).toContainEqual(expect.objectContaining({
      outcome: "unavailable",
      stage: "purpose_gate",
      reason: "incomplete",
      attempts: 1,
    }));
    expect(JSON.stringify(logEntries)).not.toContain(businessProcess);
    expect(JSON.stringify(logEntries)).not.toContain("test-token");
    consoleInfo.mockRestore();
  });

  it("does not call either model when the global purpose-gate budget is exhausted", async () => {
    mocks.consumeGlobal.mockResolvedValueOnce({ allowed: false, retryAfter: 3600 });
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(mocks.classifyPurpose).not.toHaveBeenCalled();
    expect(mocks.createBusinessAudit).not.toHaveBeenCalled();
  });

  it("does not call the main model when the global full-audit budget is exhausted", async () => {
    mocks.consumeGlobal
      .mockResolvedValueOnce({ allowed: true, retryAfter: 0 })
      .mockResolvedValueOnce({ allowed: false, retryAfter: 3600 });
    const response = await POST(request());
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ error: { code: "AI_UNAVAILABLE" } });
    expect(mocks.classifyPurpose).toHaveBeenCalledOnce();
    expect(mocks.createBusinessAudit).not.toHaveBeenCalled();
  });

  it("stops before all content gates when the visitor limit is exhausted", async () => {
    mocks.consume.mockResolvedValue({ allowed: false, retryAfter: 600 });
    const response = await POST(request());
    expect(response.status).toBe(429);
    expect(mocks.moderation).not.toHaveBeenCalled();
    expect(mocks.classifyPurpose).not.toHaveBeenCalled();
    expect(mocks.createBusinessAudit).not.toHaveBeenCalled();
  });

  it("logs a typed full-audit failure with its attempt count", async () => {
    const consoleInfo = vi.spyOn(console, "info").mockImplementation(() => undefined);
    mocks.createBusinessAudit.mockRejectedValue(new FullAuditUnavailableError("malformed_output", 2));

    const response = await POST(request());
    expect(response.status).toBe(503);
    const logEntries = consoleInfo.mock.calls.map(([entry]) => JSON.parse(String(entry)) as Record<string, unknown>);
    expect(logEntries).toContainEqual(expect.objectContaining({
      outcome: "unavailable",
      stage: "full_audit",
      reason: "malformed_output",
      attempts: 2,
    }));
    consoleInfo.mockRestore();
  });

  it("consumes visitor and global budgets only once when the audit reports an internal retry", async () => {
    mocks.createBusinessAudit.mockResolvedValue({
      result: {
        plainLanguage: { currentProcess: "Current process", whatCanBeAutomated: ["Capture"], aiRole: ["Classify"], humanRole: ["Review"] },
        summary: "Summary", automationOpportunities: [], architecture: [], requirements: [], questions: [], risks: [], nextStep: "Next",
      },
      usage: {},
      attempts: 2,
    });

    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(mocks.consume).toHaveBeenCalledOnce();
    expect(mocks.consumeGlobal).toHaveBeenCalledTimes(2);
    expect(mocks.consumeGlobal).toHaveBeenNthCalledWith(1, "purpose_gate");
    expect(mocks.consumeGlobal).toHaveBeenNthCalledWith(2, "full_audit");
    expect(mocks.classifyPurpose).toHaveBeenCalledOnce();
    expect(mocks.createBusinessAudit).toHaveBeenCalledOnce();
  });

  it.each(["KZ", "KR"])("adds a valid Cloudflare country code %s to safe log metadata", async (country) => {
    const consoleInfo = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const response = await POST(request(businessProcess, { "cf-ipcountry": country }));
    expect(response.status).toBe(200);
    const logEntries = consoleInfo.mock.calls.map(([entry]) => JSON.parse(String(entry)) as Record<string, unknown>);
    expect(logEntries).toContainEqual(expect.objectContaining({ outcome: "success", country }));
    consoleInfo.mockRestore();
  });

  it("ignores malformed country metadata and never logs request secrets or identifiers", async () => {
    const consoleInfo = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const rawIp = "198.51.100.23";
    const response = await POST(request(businessProcess, { "cf-ipcountry": "KZ-injected", "x-forwarded-for": rawIp }));
    expect(response.status).toBe(200);
    const serializedLogs = JSON.stringify(consoleInfo.mock.calls.map(([entry]) => JSON.parse(String(entry))));
    expect(serializedLogs).not.toContain("country");
    expect(serializedLogs).not.toContain(businessProcess);
    expect(serializedLogs).not.toContain(rawIp);
    expect(serializedLogs).not.toContain("test-token");
    consoleInfo.mockRestore();
  });

  it("logs flat aggregated stage usage and the request token total", async () => {
    const consoleInfo = vi.spyOn(console, "info").mockImplementation(() => undefined);
    mocks.classifyPurpose.mockResolvedValue({
      result: { allowed: true, category: "business_automation", reason: "workflow" },
      usage: { inputTokens: 210, outputTokens: 35, totalTokens: 245, cachedInputTokens: 90 },
      attempts: 2,
    });
    mocks.createBusinessAudit.mockResolvedValue({
      result: {
        plainLanguage: { currentProcess: "Current process", whatCanBeAutomated: ["Capture"], aiRole: ["Classify"], humanRole: ["Review"] },
        summary: "Summary", automationOpportunities: [], architecture: [], requirements: [], questions: [], risks: [], nextStep: "Next",
      },
      tokens: 900,
      usage: { inputTokens: 620, outputTokens: 280, totalTokens: 900, cachedInputTokens: 260 },
      attempts: 2,
    });

    const response = await POST(request());
    expect(response.status).toBe(200);
    const logEntries = consoleInfo.mock.calls.map(([entry]) => JSON.parse(String(entry)) as Record<string, unknown>);
    expect(logEntries).toContainEqual(expect.objectContaining({
      outcome: "success",
      gateInputTokens: 210,
      gateOutputTokens: 35,
      gateTotalTokens: 245,
      gateCachedInputTokens: 90,
      attemptsGate: 2,
      auditInputTokens: 620,
      auditOutputTokens: 280,
      auditTotalTokens: 900,
      auditCachedInputTokens: 260,
      attemptsAudit: 2,
      requestTotalTokens: 1145,
    }));
    consoleInfo.mockRestore();
  });

  it("logs accumulated usage on unavailable without exposing input, IP, or secrets", async () => {
    const consoleInfo = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const rawIp = "198.51.100.23";
    const apiSecret = "Bearer secret-api-token";
    mocks.classifyPurpose.mockRejectedValue(new PurposeGateUnavailableError(
      "incomplete",
      2,
      { inputTokens: 200, outputTokens: 40, totalTokens: 240, cachedInputTokens: 50 },
    ));

    const response = await POST(request(businessProcess, { "x-forwarded-for": rawIp, authorization: apiSecret }));
    expect(response.status).toBe(503);
    const serializedLogs = JSON.stringify(consoleInfo.mock.calls.map(([entry]) => JSON.parse(String(entry))));
    expect(serializedLogs).toContain('"gateTotalTokens":240');
    expect(serializedLogs).not.toContain(businessProcess);
    expect(serializedLogs).not.toContain(rawIp);
    expect(serializedLogs).not.toContain("test-token");
    expect(serializedLogs).not.toContain(apiSecret);
    consoleInfo.mockRestore();
  });

  it("omits token fields when response usage is unavailable", async () => {
    const consoleInfo = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const response = await POST(request());
    expect(response.status).toBe(200);
    const successLog = consoleInfo.mock.calls
      .map(([entry]) => JSON.parse(String(entry)) as Record<string, unknown>)
      .find((entry) => entry.outcome === "success");
    expect(successLog).not.toHaveProperty("gateTotalTokens");
    expect(successLog).not.toHaveProperty("auditTotalTokens");
    expect(successLog).not.toHaveProperty("requestTotalTokens");
    expect(successLog).not.toHaveProperty("tokens");
    consoleInfo.mockRestore();
  });
});
