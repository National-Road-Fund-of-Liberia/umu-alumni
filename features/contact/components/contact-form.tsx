"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldWrapper } from "@/components/common/form/field-wrapper";
import { SubmitButton } from "@/components/common/form/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactFormValues } from "@/schemas/contact";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(values: ContactFormValues) {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json();

    if (!result.success) {
      toast.error(result.error?.message ?? "Something went wrong. Please try again.");
      return;
    }

    toast.success("Message sent — the association will respond within a few business days.");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <FieldWrapper label="Full name" htmlFor="contact-name" error={errors.name} required>
            <Input id="contact-name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
          </FieldWrapper>
          <FieldWrapper label="Email address" htmlFor="contact-email" error={errors.email} required>
            <Input
              id="contact-email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </FieldWrapper>
        </div>
        <FieldWrapper label="Subject" htmlFor="contact-subject" error={errors.subject} required>
          <Input id="contact-subject" aria-invalid={!!errors.subject} {...register("subject")} />
        </FieldWrapper>
        <FieldWrapper label="Message" htmlFor="contact-message" error={errors.message} required>
          <Textarea
            id="contact-message"
            rows={6}
            aria-invalid={!!errors.message}
            {...register("message")}
          />
        </FieldWrapper>
        <div>
          <SubmitButton isSubmitting={isSubmitting} submittingLabel="Sending…" size="lg">
            Send Message
          </SubmitButton>
        </div>
      </FieldGroup>
    </form>
  );
}
