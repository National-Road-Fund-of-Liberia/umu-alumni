import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/api-response";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { RateLimitError } from "@/lib/errors";
import { clientIpFromRequest, rateLimit } from "@/lib/rate-limit";
import { AuthService } from "@/services/auth.service";

const LOGIN_RATE_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 };

export async function POST(request: NextRequest) {
  try {
    const ip = clientIpFromRequest(request);
    const limited = rateLimit(`login:${ip}`, LOGIN_RATE_LIMIT);
    if (!limited.success) {
      throw new RateLimitError(
        "Too many sign-in attempts. Please wait a few minutes and try again.",
        limited.retryAfterSeconds
      );
    }

    const body = await request.json();
    const { token, maxAgeSeconds, displayName } = await AuthService.login(body);

    const response = apiSuccess({ displayName });
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: maxAgeSeconds,
    });
    return response;
  } catch (error) {
    return apiError(error);
  }
}
