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
vi.mock("@/lib/ai/audit", () => ({ createBusinessAudit: mocks.createBusinessAudit }));
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

const businessProcess = "Заявки приходят в WhatsApp, менеджеры вручную переносят их в CRM и распределяют между сотрудниками отдела продаж.";

function request(process = businessProcess) {
  return new Request("http://localhost/api/ai-audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ process, locale: "ru", turnstileToken: "test-token" }),
  });
}

describe("AI audit route gates", () => {
  beforeEach(() => {
    mocks.turnstile.mockResolvedValue(true);
    mocks.consume.mockResolvedValue({ allowed: true, retryAfter: 0 });
    mocks.consumeGlobal.mockResolvedValue({ allowed: true, retryAfter: 0 });
    mocks.moderation.mockResolvedValue(false);
    mocks.classifyPurpose.mockResolvedValue({ allowed: true, category: "business_automation", reason: "workflow" });
    mocks.createBusinessAudit.mockResolvedValue({
      result: {
        plainLanguage: { currentProcess: "Current process", whatCanBeAutomated: ["Capture"], aiRole: ["Classify"], humanRole: ["Review"] },
        summary: "Summary",
        automationOpportunities: [], architecture: [], requirements: [], questions: [], risks: [], nextStep: "Next",
      },
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
    mocks.classifyPurpose.mockResolvedValue({ allowed: false, category: "off_topic", reason: "not a workflow" });
    const response = await POST(request());
    expect(response.status).toBe(403);
    expect(mocks.classifyPurpose).toHaveBeenCalledOnce();
    expect(mocks.createBusinessAudit).not.toHaveBeenCalled();
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
});
