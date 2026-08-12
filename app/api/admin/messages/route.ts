import { apiError, apiSuccess } from "@/lib/api-response";
import { requireSession } from "@/lib/auth/get-session";
import { ContactService } from "@/services/contact.service";

export async function GET() {
  try {
    await requireSession();
    const messages = await ContactService.listAll();
    return apiSuccess(messages);
  } catch (error) {
    return apiError(error);
  }
}
