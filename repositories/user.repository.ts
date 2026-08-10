import type { AdminUser } from "@/types/user";
import { BaseRepository } from "./base-repository";

class UserRepository extends BaseRepository<AdminUser> {
  constructor() {
    super("admin-users");
  }

  async findByUsername(username: string): Promise<AdminUser | null> {
    const records = await this.findAll();
    return records.find((record) => record.username === username) ?? null;
  }
}

export const userRepository = new UserRepository();
