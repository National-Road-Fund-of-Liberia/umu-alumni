import { randomUUID } from "node:crypto";

import { ADMIN_ROLE, type AdminUser } from "@/types/user";
import { generateInitialsAvatar } from "./placeholder-image";


export function generateAdminUsers(): AdminUser[] {
  const username = process.env.ADMIN_USERNAME || "admin";
  const createdAt = new Date(2023, 0, 1).toISOString();

  return [
    {
      id: randomUUID(),
      username,
      displayName: "Admin",
      avatarUrl: generateInitialsAvatar("UMU Admin"),
      role: ADMIN_ROLE,
      createdAt,
      lastLoginAt: null,
    },
  ];
}
