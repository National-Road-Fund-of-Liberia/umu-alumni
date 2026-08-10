import { z } from "zod";

import { imageDataUrlSchema } from "./common";

export const adminProfileSchema = z.object({
  displayName: z.string().trim().min(2, "Display name is required").max(80),
  avatarUrl: imageDataUrlSchema.nullable(),
});

export type AdminProfileFormValues = z.infer<typeof adminProfileSchema>;
