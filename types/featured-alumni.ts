export interface FeaturedAlumni {
  id: string;
  fullName: string;
  /** Current role, e.g. "Minister", "Director of Media Relations" */
  title: string;
  organization: string;
  graduationYear: number;
  photoUrl: string | null;
  bio: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateFeaturedAlumniInput = Omit<FeaturedAlumni, "id" | "createdAt" | "updatedAt">;
export type UpdateFeaturedAlumniInput = Partial<CreateFeaturedAlumniInput>;
