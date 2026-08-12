import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { clientIpFromRequest, rateLimit } from "@/lib/rate-limit";
import { ContactService } from "@/services/contact.service";

const CONTACT_RATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 };

export async function POST(request: NextRequest) {
  try {
    const ip = clientIpFromRequest(request);
    const limited = rateLimit(`contact:${ip}`, CONTACT_RATE_LIMIT);
    if (!limited.success) {
      throw new RateLimitError(
        "Too many messages sent from this network. Please try again later.",
        limited.retryAfterSeconds
      );
    }

    const body = await request.json();
    const record = await ContactService.create(body);
    return apiSuccess({ received: true, id: record.id }, 201);
  } catch (error) {
    return apiError(error);
  }
}
