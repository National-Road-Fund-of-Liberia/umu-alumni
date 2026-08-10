import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/api-response";
import { requireSession } from "@/lib/auth/get-session";
import { PastPresidentService } from "@/services/past-president.service";

export async function GET() {
  try {
    await requireSession();
    const records = await PastPresidentService.listAll();
    return apiSuccess(records);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const record = await PastPresidentService.create(body, session.username);
    return apiSuccess(record, 201);
  } catch (error) {
    return apiError(error);
  }
}
