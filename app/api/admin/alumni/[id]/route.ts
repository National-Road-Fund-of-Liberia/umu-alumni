import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/api-response";
import { requireSession } from "@/lib/auth/get-session";
import { AlumniService } from "@/services/alumni.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireSession();
    const { id } = await params;
    const record = await AlumniService.getById(id);
    return apiSuccess(record);
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const body = await request.json();
    const record = await AlumniService.update(id, body, session.username);
    return apiSuccess(record);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireSession();
    const { id } = await params;
    await AlumniService.delete(id, session.username);
    return apiSuccess({ id });
  } catch (error) {
    return apiError(error);
  }
}
