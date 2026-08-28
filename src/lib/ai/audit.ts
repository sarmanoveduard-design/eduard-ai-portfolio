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

  let parsed: unknown;
  try {
    parsed = JSON.parse(response.output_text) as unknown;
  } catch {
    throw new Error("AI_UNAVAILABLE");
  }
  if (!isAuditResult(parsed)) throw new Error("AI_UNAVAILABLE");
  return { result: parsed, tokens: response.usage?.total_tokens };
}
