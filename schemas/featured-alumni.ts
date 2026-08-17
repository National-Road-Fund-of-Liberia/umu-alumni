import { z } from "zod";

import { graduationYearSchema, imageUrlSchema } from "./common";

export const featuredAlumniSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(100),
  title: z.string().trim().min(2, "Title is required").max(80),
  organization: z.string().trim().min(2, "Organization is required").max(120),
  graduationYear: graduationYearSchema,
  photoUrl: imageUrlSchema.nullable(),
  bio: z.string().trim().min(20, "Bio should be at least 20 characters").max(4000),
  displayOrder: z.number().int().min(0),
});

export type FeaturedAlumniFormValues = z.infer<typeof featuredAlumniSchema>;
