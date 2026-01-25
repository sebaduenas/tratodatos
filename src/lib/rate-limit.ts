// Rate limiting utility
// Uses Upstash Redis if configured, otherwise falls back to in-memory rate limiting

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// Types
interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory rate limiter for development/fallback
class InMemoryRateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, value] of this.requests.entries()) {
      if (value.resetTime < now) {
        this.requests.delete(key);
      }
    }
  }

  async limit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || record.resetTime < now) {
      // New window
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return {
        success: true,
        limit: this.maxRequests,
        remaining: this.maxRequests - 1,
        reset: now + this.windowMs,
      };
    }

    if (record.count >= this.maxRequests) {
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset: record.resetTime,
      };
    }

    record.count++;
    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - record.count,
      reset: record.resetTime,
    };
  }
}

// Create rate limiters
let upstashRatelimit: Ratelimit | null = null;

// Initialize Upstash if credentials are available
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  upstashRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "60 s"), // Default: 10 requests per minute
    analytics: true,
    prefix: "tratodatos",
  });
}

// In-memory fallback
const inMemoryLimiters = {
  // Auth endpoints: 5 requests per minute
  auth: new InMemoryRateLimiter(60 * 1000, 5),
  // API endpoints: 30 requests per minute
  api: new InMemoryRateLimiter(60 * 1000, 30),
  // Document generation: 10 requests per minute
  generate: new InMemoryRateLimiter(60 * 1000, 10),
};

// Get client IP
function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "127.0.0.1";
}

// Rate limit types
export type RateLimitType = "auth" | "api" | "generate";

// Main rate limit function
export async function rateLimit(
  request: NextRequest,
  type: RateLimitType = "api"
): Promise<{
  success: boolean;
  response?: NextResponse;
}> {
  const identifier = getClientIp(request);

  let result: RateLimitResult;

  if (upstashRatelimit) {
    // Use Upstash Redis
    const upstashResult = await upstashRatelimit.limit(`${type}:${identifier}`);
    result = {
      success: upstashResult.success,
      limit: upstashResult.limit,
      remaining: upstashResult.remaining,
      reset: upstashResult.reset,
    };
  } else {
    // Use in-memory fallback
    result = await inMemoryLimiters[type].limit(identifier);
  }

  if (!result.success) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Demasiadas solicitudes. Por favor intenta más tarde.",
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": result.limit.toString(),
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": result.reset.toString(),
            "Retry-After": Math.ceil((result.reset - Date.now()) / 1000).toString(),
          },
        }
      ),
    };
  }

  return { success: true };
}

// Higher-order function to wrap API routes with rate limiting
export function withRateLimit(
  handler: (request: NextRequest, context: any) => Promise<NextResponse>,
  type: RateLimitType = "api"
) {
  return async (request: NextRequest, context: any): Promise<NextResponse> => {
    const rateLimitResult = await rateLimit(request, type);

    if (!rateLimitResult.success && rateLimitResult.response) {
      return rateLimitResult.response;
    }

    return handler(request, context);
  };
}
