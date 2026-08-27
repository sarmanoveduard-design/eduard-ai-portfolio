import "server-only";
import { isIP } from "node:net";

export function getClientIp(request: Request) {
  const cloudflareIp = request.headers.get("cf-connecting-ip")?.trim();

  if (cloudflareIp && isIP(cloudflareIp)) {
    return cloudflareIp;
  }

  if (process.env.NODE_ENV !== "production") {
    const fallbackCandidates = [
      request.headers.get("x-real-ip"),
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    ];

    for (const candidate of fallbackCandidates) {
      const value = candidate?.trim();
      if (value && isIP(value)) return value;
    }
  }

  return undefined;
}
