import { NextResponse } from "next/server";
import { createBusinessAudit } from "@/lib/ai/audit";
import { aiConfig, isServerPipelineConfigured } from "@/lib/ai/config";
import { isModerationBlocked } from "@/lib/ai/moderation";
import { classifyPurpose, detectImmediateDenial } from "@/lib/ai/purpose-gate";
import { parseAuditRequest } from "@/lib/ai/schemas";
import { createRateLimiter, hashVisitor } from "@/lib/security/rate-limit";
import { verifyTurnstile } from "@/lib/security/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ErrorCode = "INVALID_INPUT" | "NOT_ALLOWED" | "RATE_LIMITED" | "AI_UNAVAILABLE" | "INTERNAL_ERROR";

function errorResponse(status: number, code: ErrorCode, headers?: HeadersInit) {
  return NextResponse.json(
    { error: { code } },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );
}

function latencyBucket(startedAt: number) {
  const elapsed = Date.now() - startedAt;
  if (elapsed < 1_000) return "under_1s";
  if (elapsed < 5_000) return "1_5s";
  if (elapsed < 15_000) return "5_15s";
  return "over_15s";
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  const log = (outcome: string, details: Record<string, unknown> = {}) => {
    console.info(JSON.stringify({ event: "ai_audit", requestId, outcome, latency: latencyBucket(startedAt), ...details }));
  };

  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 12_000 || !request.headers.get("content-type")?.includes("application/json")) {
      log("invalid_input");
      return errorResponse(400, "INVALID_INPUT");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      log("invalid_input");
      return errorResponse(400, "INVALID_INPUT");
    }

    const input = parseAuditRequest(body);
    if (!input) {
      log("invalid_input");
      return errorResponse(400, "INVALID_INPUT");
    }
    if (!isServerPipelineConfigured()) {
      log("unavailable", { configuration: "incomplete" });
      return errorResponse(503, "AI_UNAVAILABLE");
    }

    const signal = AbortSignal.timeout(aiConfig.timeoutMs);
    if (!await verifyTurnstile(input.turnstileToken, signal)) {
      log("not_allowed", { stage: "bot_protection" });
      return errorResponse(403, "NOT_ALLOWED");
    }

    const rateLimit = await createRateLimiter().consume(hashVisitor(request));
    if (!rateLimit.allowed) {
      log("rate_limited", { rateLimit: "denied" });
      return errorResponse(429, "RATE_LIMITED", { "Retry-After": String(rateLimit.retryAfter) });
    }

    const immediateDenial = detectImmediateDenial(input.process);
    if (immediateDenial) {
      log("not_allowed", { stage: "deterministic_gate", category: immediateDenial.category });
      return errorResponse(403, "NOT_ALLOWED");
    }

    if (await isModerationBlocked(input.process, signal)) {
      log("not_allowed", { stage: "moderation" });
      return errorResponse(403, "NOT_ALLOWED");
    }

    const gate = await classifyPurpose(input.process, signal);
    if (!gate.allowed || !["business_automation", "software_system", "ai_business_usecase"].includes(gate.category)) {
      log("not_allowed", { stage: "purpose_gate", category: gate.category });
      return errorResponse(403, "NOT_ALLOWED");
    }

    const audit = await createBusinessAudit(input.process, input.locale, signal);
    log("success", { category: gate.category, tokens: audit.tokens });
    return NextResponse.json({ data: audit.result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const unavailable = error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError" || error.message === "AI_UNAVAILABLE");
    log(unavailable ? "unavailable" : "failure");
    return errorResponse(unavailable ? 503 : 500, unavailable ? "AI_UNAVAILABLE" : "INTERNAL_ERROR");
  }
}
