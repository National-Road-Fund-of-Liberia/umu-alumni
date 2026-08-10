export interface CommitteeMember {
  id: string;
  fullName: string;
  /** e.g. "President", "Vice President", "Secretary General" */
  title: string;
  photoUrl: string | null;
  bio: string;
  termStart: number;
  termEnd: number | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateCommitteeMemberInput = Omit<CommitteeMember, "id" | "createdAt" | "updatedAt">;
export type UpdateCommitteeMemberInput = Partial<CreateCommitteeMemberInput>;
