import { z } from "zod";

import { EVENT_CATEGORIES, EVENT_STATUSES } from "@/types/event";
import { imageUrlSchema, optionalUrlSchema } from "./common";

// Plain object (no .refine()) so it stays usable with .partial() for update
// payloads, where only some fields — possibly neither date — are present.
export const eventObjectSchema = z.object({
  title: z.string().trim().min(5, "Title is required").max(150),
  description: z.string().trim().min(20, "Description should be at least 20 characters").max(2000),
  location: z.string().trim().min(3, "Location is required").max(150),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().nullable(),
  coverImageUrl: imageUrlSchema.nullable(),
  category: z.enum(EVENT_CATEGORIES),
  status: z.enum(EVENT_STATUSES),
  registrationUrl: optionalUrlSchema.nullable(),
});

export const eventSchema = eventObjectSchema.refine(
  (data) => !data.endDate || data.endDate >= data.startDate,
  { message: "End date must be on or after the start date", path: ["endDate"] }
);

export const eventUpdateSchema = eventObjectSchema.partial().refine(
  (data) => !data.startDate || !data.endDate || data.endDate >= data.startDate,
  { message: "End date must be on or after the start date", path: ["endDate"] }
);

export type EventFormValues = z.infer<typeof eventSchema>;
