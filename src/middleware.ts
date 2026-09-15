import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware: rate limiting + request ID + security headers.
 * Runs in the Edge runtime — uses Web Crypto API, not node:crypto.
 *
 * Rate limiting is in-memory (per-process). For multi-instance deploys,
 * back this with Upstash Redis (see RATE_LIMIT_* env vars).
 */

type Bucket = { count: number; resetAt: number };

/** Generate a UUID v4 using the Web Crypto API (Edge-compatible). */
function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: RFC4122 v4 using getRandomValues
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  buf[6] = (buf[6] & 0x0f) | 0x40;
  buf[8] = (buf[8] & 0x3f) | 0x80;
  const hex = Array.from(buf, (b) => b.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}

// In-memory rate limit buckets keyed by `type:id` (e.g. "ip:1.2.3.4" or "key:nxp_test_8h2")
const buckets = new Map<string, Bucket>();

// Garbage-collect stale buckets every 60s to avoid memory leak
let lastGc = Date.now();
function gc() {
  const now = Date.now();
  if (now - lastGc < 60_000) return;
  lastGc = now;
  for (const [k, v] of buckets) {
    if (v.resetAt < now) buckets.delete(k);
  }
}

function rateLimit(key: string, max: number, windowMs: number): { allowed: boolean; remaining: number; resetAt: number } {
  gc();
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: max - 1, resetAt };
  }

  bucket.count++;
  if (bucket.count > max) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }
  return { allowed: true, remaining: max - bucket.count, resetAt: bucket.resetAt };
}

// Rate limit tiers
const RATE_LIMIT_TEST = 100; // 100 req/min in test mode
const RATE_LIMIT_LIVE = 1000; // 1000 req/min in live mode
const RATE_LIMIT_ANON = 30; // 30 req/min for unauthenticated (e.g. api-keys GET)
const WINDOW_MS = 60_000;

function getApiKeyMode(req: NextRequest): "test" | "live" | null {
  const auth = req.headers.get("authorization") || "";
  const m = auth.match(/^Bearer\s+nxp_(test|live)_[a-z0-9]+$/i);
  return m ? (m[1].toLowerCase() as "test" | "live") : null;
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri;
  return "unknown";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only apply to API routes
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Health check endpoint is exempt from rate limiting — orchestrator probes
  // (k8s liveness/readiness, Docker HEALTHCHECK, load balancer checks) must
  // always get a 200, never a 429.
  if (pathname === "/api/health") {
    const res = NextResponse.next();
    res.headers.set("x-request-id", uuid());
    res.headers.set("cache-control", "no-store");
    return res;
  }

  // Generate a request ID for tracing
  const requestId = uuid();
  const res = NextResponse.next();
  res.headers.set("x-request-id", requestId);

  // Security headers on all API responses
  res.headers.set("x-content-type-options", "nosniff");
  res.headers.set("x-frame-options", "DENY");
  res.headers.set("referrer-policy", "no-referrer");
  res.headers.set("x-powered-by", "Nexa Pay");

  // Rate limit key: prefer API key, fall back to IP
  const mode = getApiKeyMode(req);
  const ip = getClientIp(req);
  const rlKey = mode ? `key:${mode}:${ip}` : `ip:${ip}`;
  const max = mode === "live" ? RATE_LIMIT_LIVE : mode === "test" ? RATE_LIMIT_TEST : RATE_LIMIT_ANON;

  const rl = rateLimit(rlKey, max, WINDOW_MS);
  res.headers.set("x-ratelimit-limit", String(max));
  res.headers.set("x-ratelimit-remaining", String(rl.remaining));
  res.headers.set("x-ratelimit-reset", String(Math.ceil(rl.resetAt / 1000)));

  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Try again later.",
        code: "rate_limited",
        request_id: requestId,
      },
      {
        status: 429,
        headers: {
          "x-request-id": requestId,
          "retry-after": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          "x-ratelimit-limit": String(max),
          "x-ratelimit-remaining": "0",
          "x-ratelimit-reset": String(Math.ceil(rl.resetAt / 1000)),
        },
      }
    );
  }

  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};
