import type { Alumni } from "@/types/alumni";
import { BaseRepository } from "./base-repository";

class AlumniRepository extends BaseRepository<Alumni> {
  constructor() {
    super("alumni");
  }
}

export const alumniRepository = new AlumniRepository();
