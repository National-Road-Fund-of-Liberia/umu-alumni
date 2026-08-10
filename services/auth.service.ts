import { timingSafeEqual } from "node:crypto";

import { loginSchema } from "@/schemas/auth";
import { UnauthorizedError } from "@/lib/errors";
import { createSessionToken, sessionMaxAge } from "@/lib/auth/session";
import { AuditService } from "./audit.service";
import { UserService } from "./user.service";

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export interface LoginResult {
  token: string;
  maxAgeSeconds: number;
  displayName: string;
}

export const AuthService = {
  async login(input: unknown): Promise<LoginResult> {
    const { username, password, rememberMe = false } = loginSchema.parse(input);

    const expectedUsername = process.env.ADMIN_USERNAME;
    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedUsername || !expectedPassword) {
      throw new Error("Admin credentials are not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD.");
    }

    const isValid = safeCompare(username, expectedUsername) && safeCompare(password, expectedPassword);
    if (!isValid) {
      throw new UnauthorizedError("Incorrect username or password.");
    }

    const user = await UserService.getByUsername(username);
    const displayName = user?.displayName ?? "Administrator";

    await UserService.recordLogin(username);
    await AuditService.record({
      actorUsername: username,
      action: "login",
      entityType: "session",
      description: "Administrator signed in",
    });

    return {
      token: await createSessionToken(username, displayName, rememberMe),
      maxAgeSeconds: sessionMaxAge(rememberMe),
      displayName,
    };
  },
};
