import { z } from "zod";

import { DEGREE_TYPES, PROGRAMS } from "@/types/alumni";
import { graduationYearSchema, imageUrlSchema } from "./common";

export const alumniSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required").max(60),
  lastName: z.string().trim().min(2, "Last name is required").max(60),
  photoUrl: imageUrlSchema.nullable(),
  degree: z.enum(DEGREE_TYPES),
  program: z.enum(PROGRAMS),
  graduationYear: graduationYearSchema,
  occupation: z.string().trim().min(2, "Occupation is required").max(120),
  organization: z.string().trim().min(2, "Organization is required").max(120),
  biography: z.string().trim().min(20, "Biography should be at least 20 characters").max(2000),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  address: z.string().trim().min(5, "Address is required").max(200),
  studentId: z.string().trim().min(3, "Student ID is required").max(30),
});

export type AlumniFormValues = z.infer<typeof alumniSchema>;
