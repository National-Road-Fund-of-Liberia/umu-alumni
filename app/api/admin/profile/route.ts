import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/api-response";
import { requireSession } from "@/lib/auth/get-session";
import { UserService } from "@/services/user.service";

/** Updates the signed-in administrator's own profile — there's exactly one
 * account in v1, so this is scoped to the current session, not an :id. */
export async function PATCH(request: NextRequest) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const updated = await UserService.updateProfile(session.username, body);
    return apiSuccess(updated);
  } catch (error) {
    return apiError(error);
  }
}
