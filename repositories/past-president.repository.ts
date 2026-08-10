import type { PastPresident } from "@/types/past-president";
import { BaseRepository } from "./base-repository";

class PastPresidentRepository extends BaseRepository<PastPresident> {
  constructor() {
    super("past-presidents");
  }
}

export const pastPresidentRepository = new PastPresidentRepository();
