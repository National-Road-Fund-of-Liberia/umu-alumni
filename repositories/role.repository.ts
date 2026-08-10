import type { Role } from "@/types/role";
import { BaseRepository } from "./base-repository";

class RoleRepository extends BaseRepository<Role> {
  constructor() {
    super("roles");
  }
}

export const roleRepository = new RoleRepository();
