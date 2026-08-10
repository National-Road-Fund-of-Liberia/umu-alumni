import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/api-response";
import { requireSession } from "@/lib/auth/get-session";
import { GalleryService } from "@/services/gallery.service";

export async function GET() {
  try {
    await requireSession();
    const items = await GalleryService.listAll();
    return apiSuccess(items);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const record = await GalleryService.create(body, session.username);
    return apiSuccess(record, 201);
  } catch (error) {
    return apiError(error);
  }
}
