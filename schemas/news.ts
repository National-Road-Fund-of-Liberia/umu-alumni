import { z } from "zod";

import { NEWS_CATEGORIES, NEWS_STATUSES } from "@/types/news";
import { imageUrlSchema } from "./common";

export const newsSchema = z.object({
  title: z.string().trim().min(5, "Title is required").max(150),
  excerpt: z.string().trim().min(10, "Excerpt is required").max(300),
  content: z.string().trim().min(50, "Content should be at least 50 characters"),
  coverImageUrl: imageUrlSchema.nullable(),
  category: z.enum(NEWS_CATEGORIES),
  status: z.enum(NEWS_STATUSES),
  author: z.string().trim().min(2, "Author is required").max(80),
  publishedAt: z.string().nullable(),
});

export type NewsFormValues = z.infer<typeof newsSchema>;
