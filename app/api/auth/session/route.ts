import { apiSuccess } from "@/lib/api-response";
import { getSession } from "@/lib/auth/get-session";

export async function GET() {
  const session = await getSession();
  return apiSuccess({
    authenticated: Boolean(session),
    username: session?.username ?? null,
    displayName: session?.displayName ?? null,
  });
}
