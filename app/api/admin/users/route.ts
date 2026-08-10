import { apiError, apiSuccess } from "@/lib/api-response";
import { requireSession } from "@/lib/auth/get-session";
import { UserService } from "@/services/user.service";

export async function GET() {
  try {
    await requireSession();
    const users = await UserService.list();
    return apiSuccess(users);
  } catch (error) {
    return apiError(error);
  }
}
