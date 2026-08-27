import "server-only";
import { createHash } from "node:crypto";
import { Redis } from "@upstash/redis";
import { aiConfig } from "@/lib/ai/config";

export type RateLimitResult = { allowed: boolean; retryAfter: number };

export interface RateLimiter {
  consume(visitorHash: string): Promise<RateLimitResult>;
}

const windows = [
  { name: "10m", seconds: 10 * 60, limit: 3 },
  { name: "24h", seconds: 24 * 60 * 60, limit: 10 },
] as const;

const devCounters = new Map<string, { count: number; expiresAt: number }>();

class DevelopmentRateLimiter implements RateLimiter {
  async consume(visitorHash: string): Promise<RateLimitResult> {
    const now = Date.now();
    let retryAfter = 0;
    let allowed = true;

    for (const window of windows) {
      const key = `${visitorHash}:${window.name}`;
      const current = devCounters.get(key);
      const entry = !current || current.expiresAt <= now
        ? { count: 1, expiresAt: now + window.seconds * 1000 }
        : { ...current, count: current.count + 1 };
      devCounters.set(key, entry);
      if (entry.count > window.limit) {
        allowed = false;
        retryAfter = Math.max(retryAfter, Math.ceil((entry.expiresAt - now) / 1000));
      }
    }

    return { allowed, retryAfter };
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
}

export function createRateLimiter(): RateLimiter {
  if (aiConfig.redisUrl && aiConfig.redisToken) {
    return new UpstashRateLimiter(new Redis({ url: aiConfig.redisUrl, token: aiConfig.redisToken }));
  }
  if (!aiConfig.isProduction) return new DevelopmentRateLimiter();
  throw new Error("AI_UNAVAILABLE");
}

export function hashVisitor(request: Request) {
  const forwarded = request.headers.get("cf-connecting-ip")
    || request.headers.get("x-real-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
  const salt = aiConfig.rateLimitSalt || "development-only-rate-limit-salt";
  return createHash("sha256").update(`${forwarded}:${salt}`).digest("hex");
}
