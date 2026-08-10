import { z } from "zod";

// Accepts a fresh upload (base64 data URI, pushed to Storage server-side)
// or an already-stored URL — forms resubmit the whole record on save, so an
// untouched image field comes back as its existing URL, not a data URI.
export const imageDataUrlSchema = z
  .string()
  .refine((val) => val.startsWith("data:image/") || val.startsWith("https://"), "Please upload a valid image file")
  .refine((val) => !val.startsWith("data:image/") || val.length < 15_000_000, "Image must be smaller than 10MB");

export const CURRENT_YEAR = new Date().getFullYear();

// Plain z.number(), not z.coerce.number(): coercion makes the schema's
// input/output types diverge (string in, number out), which conflicts with
// react-hook-form's single useForm<T> generic. Number inputs instead use
// register(name, { valueAsNumber: true }) so RHF converts the DOM string
// before validation ever sees it.
export const graduationYearSchema = z
  .number()
  .int()
  .min(1990, "Enter a valid graduation year")
  .max(CURRENT_YEAR + 1, "Graduation year cannot be in the future");

export const optionalUrlSchema = z.union([z.literal(""), z.string().trim().url("Enter a valid URL")]);
