import { roleRepository } from "@/repositories/role.repository";
import type { Role } from "@/types/role";

export const RoleService = {
  async list(): Promise<Role[]> {
    return roleRepository.findAll();
  },
};
