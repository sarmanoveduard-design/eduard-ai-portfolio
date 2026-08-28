import { describe, expect, it } from "vitest";
import { isAuditResult, parseAuditRequest, type AuditResult } from "./schemas";

const validResult: AuditResult = {
  plainLanguage: {
    currentProcess: "Managers manually copy incoming requests into the CRM and choose who should handle each one.",
    whatCanBeAutomated: ["Capture each request and create the CRM record automatically."],
    aiRole: ["Read the request and suggest its topic and priority in simple terms."],
    humanRole: ["Review unusual cases and make decisions that require business judgment."],
  },
  summary: "A preliminary automation plan for handling incoming requests.",
  automationOpportunities: [
    { title: "Request capture", description: "Create records without manual copying." },
    { title: "Lead routing", description: "Suggest an owner using agreed business rules." },
  ],
  architecture: [
    { label: "WhatsApp", type: "source" },
    { label: "Request processing", type: "process" },
    { label: "Manager review", type: "human" },
  ],
  requirements: ["Access to the existing CRM integration."],
  questions: ["How are leads assigned today?"],
  risks: ["Unusual requests may still require manual review."],
  nextStep: "Document the current assignment rules and a few representative examples.",
};

describe("audit schemas", () => {
  it("accepts a structured result with plainLanguage", () => {
    expect(isAuditResult(validResult)).toBe(true);
  });

  it("rejects missing or oversized plainLanguage content", () => {
    expect(isAuditResult({ ...validResult, plainLanguage: undefined })).toBe(false);
    expect(isAuditResult({
      ...validResult,
      plainLanguage: { ...validResult.plainLanguage, currentProcess: "x".repeat(301) },
    })).toBe(false);
  });

  it("rejects URL-only and short requests while preserving the 1500 character ceiling", () => {
    expect(parseAuditRequest({ process: "https://example.com/this/is/only/a/url/with/no/business/workflow/details/at/all", locale: "en", turnstileToken: "token" })).toBeNull();
    expect(parseAuditRequest({ process: "short business text", locale: "en", turnstileToken: "token" })).toBeNull();
    expect(parseAuditRequest({ process: "a ".repeat(751), locale: "en", turnstileToken: "token" })).toBeNull();
  });
});
