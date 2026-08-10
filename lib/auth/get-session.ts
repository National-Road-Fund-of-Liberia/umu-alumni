import { cookies } from "next/headers";

import type { SessionPayload } from "@/types/auth";
import { UnauthorizedError } from "@/lib/errors";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./session";

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

/**
 * Defense in depth: middleware already blocks unauthenticated requests to
 * /admin/* and /api/admin/*, but every admin Route Handler calls this too
 * so a routing change elsewhere can never accidentally expose a mutation.
 */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new UnauthorizedError();
  }
  return session;
}
