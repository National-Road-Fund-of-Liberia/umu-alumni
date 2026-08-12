/**
 * Simple sliding-window rate limiter for Route Handlers.
 * In-memory buckets are per-instance — enough to blunt brute-force and spam
 * on a single Node/serverless isolate without adding Redis.
 */
type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  /** Max attempts allowed inside the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export type RateLimitResult =
  | { success: true; remaining: number }
  | { success: false; retryAfterSeconds: number };

export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { success: true, remaining: options.limit - 1 };
  }

  if (existing.count >= options.limit) {
    return {
      success: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { success: true, remaining: options.limit - existing.count };
}

/** Best-effort client IP for rate-limit keys (proxies set x-forwarded-for). */
export function clientIpFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
