import { z } from "zod";

// Image fields hold a Firebase Storage HTTPS URL only — the browser uploads
// raw bytes via /api/admin/upload before the form ever submits, so data URIs
// never enter Zod or Firestore.
export const imageUrlSchema = z
  .string()
  .refine((val) => val.startsWith("https://"), "Please upload a valid image file");

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
