export const DEGREE_TYPES = [
  "Certificate",
  "Diploma",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
] as const;
export type DegreeType = (typeof DEGREE_TYPES)[number];

export const PROGRAMS = [
  "Business Administration",
  "Computer Science",
  "Nursing",
  "Theology",
  "Education",
  "Agriculture",
  "Social Work",
  "Accounting",
  "Mass Communication",
  "Public Health",
] as const;
export type Program = (typeof PROGRAMS)[number];

export interface Alumni {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  degree: DegreeType;
  program: Program;
  graduationYear: number;
  occupation: string;
  organization: string;
  biography: string;
  /** Private — never returned from a public API route. */
  email: string;
  /** Private — never returned from a public API route. */
  phone: string;
  /** Private — never returned from a public API route. */
  address: string;
  /** Private — never returned from a public API route. */
  studentId: string;
  createdAt: string;
  updatedAt: string;
}

export const PRIVATE_ALUMNI_FIELDS = ["email", "phone", "address", "studentId"] as const;

export type PublicAlumni = Omit<Alumni, (typeof PRIVATE_ALUMNI_FIELDS)[number]>;

export type CreateAlumniInput = Omit<Alumni, "id" | "createdAt" | "updatedAt">;
export type UpdateAlumniInput = Partial<CreateAlumniInput>;
