import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/api-response";
import { contactSchema } from "@/schemas/contact";

/**
 * Mocked endpoint: the brief doesn't call for a Contact Messages admin
 * module, so this validates and "sends" the message (logged server-side)
 * rather than persisting a new domain entity that has no owner elsewhere
 * in the app.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    console.info(`[contact] New message from ${data.name} <${data.email}>: ${data.subject}`);

    return apiSuccess({ received: true });
  } catch (error) {
    return apiError(error);
  }
}
