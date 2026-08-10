import { z } from "zod";

import { imageUrlSchema } from "./common";

export const pastPresidentSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(100),
  photoUrl: imageUrlSchema.nullable(),
  year: z.number().int().min(1960).max(2100),
  displayOrder: z.number().int().min(0),
});

export type PastPresidentFormValues = z.infer<typeof pastPresidentSchema>;
