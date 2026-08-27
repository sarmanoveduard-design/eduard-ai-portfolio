import "server-only";
import { aiConfig } from "@/lib/ai/config";

type TurnstileResponse = { success?: boolean };

export async function verifyTurnstile(token: string, signal: AbortSignal) {
  if (!aiConfig.turnstileSecretKey || !aiConfig.turnstileSiteKey) {
    return !aiConfig.isProduction;
  }
  if (!token) return false;

  const body = new URLSearchParams({ secret: aiConfig.turnstileSecretKey, response: token });
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
    signal,
    cache: "no-store",
  });
  if (!response.ok) return false;
  const result = await response.json() as TurnstileResponse;
  return result.success === true;
}
