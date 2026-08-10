import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/api-response";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { AuthService } from "@/services/auth.service";

export async function POST(request: NextRequest) {
  try {
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
