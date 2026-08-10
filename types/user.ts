export const ADMIN_ROLE = "Administrator" as const;

export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: typeof ADMIN_ROLE;
  createdAt: string;
  lastLoginAt: string | null;
}

export type UpdateAdminUserInput = Partial<Pick<AdminUser, "displayName" | "avatarUrl">>;
