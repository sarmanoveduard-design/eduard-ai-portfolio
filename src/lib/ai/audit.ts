import "server-only";
import type { Locale } from "@/i18n/config";
import { aiConfig } from "./config";
import { getOpenAIClient } from "./openai";
import { auditInstructions, wrapUserContent } from "./prompts";
import { auditJsonSchema, isAuditResult, type AuditResult } from "./schemas";
import { addResponseUsage, type AiTokenUsage } from "./token-usage";

export type FullAuditFailureReason =
  | "incomplete"
  | "empty_output"
  | "malformed_output"
  | "invalid_output"
  | "invalid_schema"
  | "unexpected_status"
  | "timeout"
  | "request_failed";

export class FullAuditUnavailableError extends Error {
  readonly stage = "full_audit";

  constructor(
    readonly reason: FullAuditFailureReason,
    readonly attempts = 1,
    readonly usage: AiTokenUsage = {},
  ) {
    super("AI_UNAVAILABLE");
    this.name = "FullAuditUnavailableError";
  }
}

function failureReason(error: unknown, signal: AbortSignal): FullAuditFailureReason {
  if (signal.aborted || (error instanceof Error && ["AbortError", "TimeoutError", "APIConnectionTimeoutError", "APIUserAbortError"].includes(error.name))) {
    return "timeout";
  }
  return error instanceof FullAuditUnavailableError ? error.reason : "request_failed";
}

function isRetryable(error: unknown) {
  if (error instanceof FullAuditUnavailableError) {
    return !["timeout", "request_failed"].includes(error.reason);
  }
  if (!(error instanceof Error) || ["AbortError", "TimeoutError", "APIConnectionTimeoutError", "APIUserAbortError", "RateLimitError"].includes(error.name)) {
    return false;
  }
  const status = "status" in error && typeof error.status === "number" ? error.status : undefined;
  return error.name === "APIConnectionError" || status === 408 || status === 409 || (status !== undefined && status >= 500);
}

export async function createBusinessAudit(input: string, locale: Locale, signal: AbortSignal): Promise<{ result: AuditResult; tokens?: number; usage: AiTokenUsage; attempts: number }> {
  let attempts = 0;
  let usage: AiTokenUsage = {};

  while (attempts < 2) {
    if (signal.aborted) throw new FullAuditUnavailableError("timeout", attempts, usage);
    attempts += 1;

    try {
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
      }, { signal, maxRetries: 0 });
      usage = addResponseUsage(usage, response.usage);

      if (response.status === "incomplete" || response.incomplete_details) {
        throw new FullAuditUnavailableError("incomplete", attempts);
      }
      if (response.status !== "completed") {
        throw new FullAuditUnavailableError("unexpected_status", attempts);
      }
      if (typeof response.output_text !== "string") {
        throw new FullAuditUnavailableError("invalid_output", attempts);
      }

      const outputText = response.output_text.trim();
      if (!outputText) throw new FullAuditUnavailableError("empty_output", attempts);

      let parsed: unknown;
      try {
        parsed = JSON.parse(outputText) as unknown;
      } catch {
        throw new FullAuditUnavailableError("malformed_output", attempts);
      }
      if (!isAuditResult(parsed)) throw new FullAuditUnavailableError("invalid_schema", attempts);
      return { result: parsed, tokens: usage.totalTokens, usage, attempts };
    } catch (error) {
      if (attempts < 2 && !signal.aborted && isRetryable(error)) continue;
      throw new FullAuditUnavailableError(failureReason(error, signal), attempts, usage);
    }
  }

  throw new FullAuditUnavailableError("request_failed", attempts, usage);
}
