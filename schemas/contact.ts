import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email address"),
  subject: z.string().trim().min(3, "Subject is required").max(150),
  message: z.string().trim().min(20, "Message should be at least 20 characters").max(2000),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
