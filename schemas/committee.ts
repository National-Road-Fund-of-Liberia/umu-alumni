import { z } from "zod";

import { imageDataUrlSchema } from "./common";

export const committeeMemberSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(100),
  title: z.string().trim().min(2, "Title is required").max(80),
  photoUrl: imageDataUrlSchema.nullable(),
  bio: z.string().trim().min(20, "Bio should be at least 20 characters").max(1000),
  termStart: z.number().int().min(1990).max(2100),
  termEnd: z.number().int().min(1990).max(2100).nullable(),
  displayOrder: z.number().int().min(0),
});

export type CommitteeMemberFormValues = z.infer<typeof committeeMemberSchema>;
