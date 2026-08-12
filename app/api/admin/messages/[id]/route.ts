import type { NextRequest } from "next/server";
import { z } from "zod";

import { apiError, apiSuccess } from "@/lib/api-response";
import { requireSession } from "@/lib/auth/get-session";
import { ContactService } from "@/services/contact.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const markReadSchema = z.object({
  status: z.literal("read"),
});

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireSession();
    const { id } = await params;
    const record = await ContactService.getById(id);
    return apiSuccess(record);
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireSession();
    const { id } = await params;
    markReadSchema.parse(await request.json());
    const record = await ContactService.markRead(id, session.username);
    return apiSuccess(record);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireSession();
    const { id } = await params;
    await ContactService.delete(id, session.username);
    return apiSuccess({ id });
  } catch (error) {
    return apiError(error);
  }
}
