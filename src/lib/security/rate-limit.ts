import "server-only";
import { createHash } from "node:crypto";
import { Redis } from "@upstash/redis";
import { aiConfig } from "@/lib/ai/config";
import { getClientIp } from "./client-ip";

export type RateLimitResult = { allowed: boolean; retryAfter: number };
export type GlobalLimitCategory = "purpose_gate" | "full_audit";

export interface RateLimiter {
  consume(visitorHash: string): Promise<RateLimitResult>;
  consumeGlobal(category: GlobalLimitCategory): Promise<RateLimitResult>;
}

const windows = [
  { name: "10m", seconds: 10 * 60, limit: 3 },
  { name: "24h", seconds: 24 * 60 * 60, limit: 8 },
] as const;

const DAILY_SECONDS = 24 * 60 * 60;

function globalLimit(category: GlobalLimitCategory) {
  return category === "purpose_gate"
    ? aiConfig.globalPurposeGateDailyLimit
    : aiConfig.globalFullAuditDailyLimit;
}

export class DevelopmentRateLimiter implements RateLimiter {
  private readonly counters = new Map<string, { count: number; expiresAt: number }>();

  async consume(visitorHash: string): Promise<RateLimitResult> {
    const now = Date.now();
    let retryAfter = 0;
    let allowed = true;

    for (const window of windows) {
      const key = `${visitorHash}:${window.name}`;
      const current = this.counters.get(key);
      const entry = !current || current.expiresAt <= now
        ? { count: 1, expiresAt: now + window.seconds * 1000 }
        : { ...current, count: current.count + 1 };
      this.counters.set(key, entry);
      if (entry.count > window.limit) {
        allowed = false;
        retryAfter = Math.max(retryAfter, Math.ceil((entry.expiresAt - now) / 1000));
      }
    }

    return { allowed, retryAfter };
  }

  async consumeGlobal(category: GlobalLimitCategory): Promise<RateLimitResult> {
    const now = Date.now();
    const key = `global:${category}`;
    const current = this.counters.get(key);
    const entry = !current || current.expiresAt <= now
      ? { count: 1, expiresAt: now + DAILY_SECONDS * 1000 }
      : { ...current, count: current.count + 1 };
    this.counters.set(key, entry);
    return {
      allowed: entry.count <= globalLimit(category),
      retryAfter: entry.count <= globalLimit(category) ? 0 : Math.max(Math.ceil((entry.expiresAt - now) / 1000), 1),
    };
  }
}

class UpstashRateLimiter implements RateLimiter {
  constructor(private readonly redis: Redis) {}

  async consume(visitorHash: string): Promise<RateLimitResult> {
    const keys = windows.map((window) => `ai-audit:${window.name}:${visitorHash}`);
    const script = `
      local shortCount = redis.call('INCR', KEYS[1])
      if shortCount == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
      local dailyCount = redis.call('INCR', KEYS[2])
      if dailyCount == 1 then redis.call('EXPIRE', KEYS[2], ARGV[2]) end
      local shortTtl = redis.call('TTL', KEYS[1])
      local dailyTtl = redis.call('TTL', KEYS[2])
      if shortCount > tonumber(ARGV[3]) or dailyCount > tonumber(ARGV[4]) then
        return {0, shortTtl, dailyTtl}
      end
      return {1, shortTtl, dailyTtl}
    `;
    const result = await this.redis.eval(
      script,
      keys,
      [windows[0].seconds, windows[1].seconds, windows[0].limit, windows[1].limit],
    ) as [number, number, number];
    return {
      allowed: result[0] === 1,
      retryAfter: result[0] === 1 ? 0 : Math.max(result[1], result[2], 1),
    };
  }

  async consumeGlobal(category: GlobalLimitCategory): Promise<RateLimitResult> {
    const key = `ai-audit:global:${category}`;
    const script = `
      local count = redis.call('INCR', KEYS[1])
      if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
      local ttl = redis.call('TTL', KEYS[1])
      if count > tonumber(ARGV[2]) then return {0, ttl} end
      return {1, ttl}
    `;
    const result = await this.redis.eval(
      script,
      [key],
      [DAILY_SECONDS, globalLimit(category)],
    ) as [number, number];
    return {
      allowed: result[0] === 1,
      retryAfter: result[0] === 1 ? 0 : Math.max(result[1], 1),
    };
  }
}

let developmentRateLimiter: DevelopmentRateLimiter | undefined;

export function createRateLimiter(): RateLimiter {
  if (aiConfig.redisUrl && aiConfig.redisToken) {
    return new UpstashRateLimiter(new Redis({ url: aiConfig.redisUrl, token: aiConfig.redisToken }));
  }
  if (!aiConfig.isProduction) {
    developmentRateLimiter ??= new DevelopmentRateLimiter();
    return developmentRateLimiter;
  }
  throw new Error("AI_UNAVAILABLE");
}

export function hashVisitor(request: Request) {
  const forwarded = getClientIp(request) || "unknown";
  const salt = aiConfig.rateLimitSalt || "development-only-rate-limit-salt";
  return createHash("sha256").update(`${forwarded}:${salt}`).digest("hex");
}
