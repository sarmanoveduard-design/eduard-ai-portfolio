import "server-only";
import type { Locale } from "@/i18n/config";
import { aiConfig } from "./config";
import { getOpenAIClient } from "./openai";
import { auditInstructions, wrapUserContent } from "./prompts";
import { auditJsonSchema, isAuditResult, type AuditResult } from "./schemas";

export async function createBusinessAudit(input: string, locale: Locale, signal: AbortSignal): Promise<{ result: AuditResult; tokens?: number }> {
  const response = await getOpenAIClient().responses.create({
    model: aiConfig.auditModel,
    reasoning: { effort: "low" },
    instructions: auditInstructions(locale),
    input: wrapUserContent(input),
    max_output_tokens: aiConfig.auditMaxOutputTokens,
    store: false,
    tools: [],
    tool_choice: "none",
    text: { format: { type: "json_schema", name: "business_automation_audit", strict: true, schema: auditJsonSchema } },
  }, { signal });

  const parsed: unknown = JSON.parse(response.output_text);
  if (!isAuditResult(parsed)) throw new Error("INVALID_AUDIT_OUTPUT");
  return { result: parsed, tokens: response.usage?.total_tokens };
}
