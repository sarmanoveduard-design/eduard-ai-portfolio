import "server-only";

const isProduction = process.env.NODE_ENV === "production";

export const aiConfig = {
  enabled: process.env.AI_AUDIT_ENABLED === "true",
  gateModel: process.env.AI_GATE_MODEL?.trim() || "gpt-5-nano",
  auditModel: process.env.AI_AUDIT_MODEL?.trim() || "gpt-5.6-luna",
  openAIKey: process.env.OPENAI_API_KEY?.trim() || "",
  redisUrl: process.env.UPSTASH_REDIS_REST_URL?.trim() || "",
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || "",
  rateLimitSalt: process.env.RATE_LIMIT_SALT?.trim() || "",
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "",
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY?.trim() || "",
  isProduction,
  timeoutMs: 25_000,
  gateMaxOutputTokens: 500,
  auditMaxOutputTokens: 1_800,
} as const;

export function getAuditAvailability() {
  const productionSecurityReady = Boolean(
    aiConfig.redisUrl
      && aiConfig.redisToken
      && aiConfig.rateLimitSalt
      && aiConfig.turnstileSiteKey
      && aiConfig.turnstileSecretKey,
  );

  return {
    enabled: aiConfig.enabled && (!isProduction || productionSecurityReady),
    turnstileSiteKey: aiConfig.turnstileSiteKey,
  };
}

export function isServerPipelineConfigured() {
  if (!aiConfig.enabled || !aiConfig.openAIKey) return false;
  if (!isProduction) return true;
  return Boolean(
    aiConfig.redisUrl
      && aiConfig.redisToken
      && aiConfig.rateLimitSalt
      && aiConfig.turnstileSiteKey
      && aiConfig.turnstileSecretKey,
  );
}
