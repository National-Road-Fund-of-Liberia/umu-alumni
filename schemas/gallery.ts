import { z } from "zod";

import { imageUrlSchema } from "./common";

export const galleryItemSchema = z.object({
  imageUrl: imageUrlSchema,
  caption: z.string().trim().min(3, "Caption is required").max(200),
  album: z.string().trim().min(2, "Album is required").max(100),
});

export type GalleryItemFormValues = z.infer<typeof galleryItemSchema>;
