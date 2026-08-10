import { z } from "zod";

import { imageUrlSchema } from "./common";

export const adminProfileSchema = z.object({
  displayName: z.string().trim().min(2, "Display name is required").max(80),
  avatarUrl: imageUrlSchema.nullable(),
});

export type AdminProfileFormValues = z.infer<typeof adminProfileSchema>;
