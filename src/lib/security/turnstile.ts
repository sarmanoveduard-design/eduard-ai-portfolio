import "server-only";
import { aiConfig } from "@/lib/ai/config";
import { MAX_TURNSTILE_TOKEN_LENGTH, TURNSTILE_ACTION } from "@/lib/ai/schemas";
import { isExpectedTurnstileResult, type TurnstileSiteverifyResult } from "./turnstile-validation";

export async function verifyTurnstile(token: string, remoteIp: string | undefined, signal: AbortSignal) {
  if (!aiConfig.turnstileSecretKey || !aiConfig.turnstileSiteKey) {
    return !aiConfig.isProduction;
  }
  if (!token || token.length > MAX_TURNSTILE_TOKEN_LENGTH || !aiConfig.turnstileExpectedHostname) return false;

  const body = new URLSearchParams({ secret: aiConfig.turnstileSecretKey, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
    signal,
    cache: "no-store",
  });
  if (!response.ok) return false;
  const result = await response.json() as TurnstileSiteverifyResult;
  return isExpectedTurnstileResult(result, aiConfig.turnstileExpectedHostname, TURNSTILE_ACTION);
}
