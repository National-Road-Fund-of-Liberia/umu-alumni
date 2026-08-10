import type { CommitteeMember } from "@/types/committee";
import { BaseRepository } from "./base-repository";

class CommitteeRepository extends BaseRepository<CommitteeMember> {
  constructor() {
    super("committee");
  }
}

export const committeeRepository = new CommitteeRepository();
