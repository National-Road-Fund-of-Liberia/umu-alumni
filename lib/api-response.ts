import { NextResponse } from "next/server";
import { ZodError } from "zod";

import type { ApiResponse } from "@/types/api";
import { NotFoundError, RateLimitError, UnauthorizedError, ValidationError } from "./errors";

export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

function fieldErrorsFromZod(error: ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".") || "_root";
    result[path] = [...(result[path] ?? []), issue.message];
  }
  return result;
}

/** Maps a thrown error to a consistent ApiResponse envelope + HTTP status. */
export function apiError(error: unknown): NextResponse<ApiResponse<never>> {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Please fix the highlighted fields and try again.",
          code: "VALIDATION_ERROR",
          fieldErrors: fieldErrorsFromZod(error),
        },
      },
      { status: 400 }
    );
  }

  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        success: false,
        error: { message: error.message, code: "VALIDATION_ERROR", fieldErrors: error.fieldErrors },
      },
      { status: 400 }
    );
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json(
      { success: false, error: { message: error.message, code: "NOT_FOUND" } },
      { status: 404 }
    );
  }

  if (error instanceof UnauthorizedError) {
    return NextResponse.json(
      { success: false, error: { message: error.message, code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  if (error instanceof RateLimitError) {
    return NextResponse.json(
      { success: false, error: { message: error.message, code: "RATE_LIMITED" } },
      {
        status: 429,
        headers: { "Retry-After": String(error.retryAfterSeconds) },
      }
    );
  }

  console.error(error);
  return NextResponse.json(
    { success: false, error: { message: "Something went wrong. Please try again.", code: "INTERNAL_ERROR" } },
    { status: 500 }
  );
}
