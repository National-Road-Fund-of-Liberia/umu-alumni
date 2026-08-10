export interface PastPresident {
  id: string;
  fullName: string;
  photoUrl: string | null;
  year: number;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type CreatePastPresidentInput = Omit<PastPresident, "id" | "createdAt" | "updatedAt">;
export type UpdatePastPresidentInput = Partial<CreatePastPresidentInput>;
