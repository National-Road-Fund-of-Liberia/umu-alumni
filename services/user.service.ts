import { userRepository } from "@/repositories/user.repository";
import { adminProfileSchema } from "@/schemas/user";
import type { AdminUser } from "@/types/user";
import { NotFoundError } from "@/lib/errors";
import { resolveNullableImageField } from "@/lib/firebase/storage";
import { AuditService } from "./audit.service";

export const UserService = {
  async list(): Promise<AdminUser[]> {
    return userRepository.findAll();
  },

  async getByUsername(username: string): Promise<AdminUser | null> {
    return userRepository.findByUsername(username);
  },

  async recordLogin(username: string): Promise<void> {
    const user = await userRepository.findByUsername(username);
    if (!user) return;
    await userRepository.update(user.id, { lastLoginAt: new Date().toISOString() });
  },

  async updateProfile(username: string, input: unknown): Promise<AdminUser> {
    const user = await userRepository.findByUsername(username);
    if (!user) throw new NotFoundError("Administrator profile not found.");

    const data = adminProfileSchema.parse(input);
    const avatarUrl =
      data.avatarUrl !== undefined ? await resolveNullableImageField(data.avatarUrl, `admin-users/${user.id}/avatar`) : undefined;
    const updated = await userRepository.update(user.id, {
      ...data,
      ...(avatarUrl !== undefined ? { avatarUrl } : {}),
    });
    if (!updated) throw new NotFoundError("Administrator profile not found.");

    await AuditService.record({
      actorUsername: username,
      action: "update",
      entityType: "user",
      entityId: user.id,
      description: "Updated administrator profile",
    });

    return updated;
  },
};
