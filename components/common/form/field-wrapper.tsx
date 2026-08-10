import type { ReactNode } from "react";
import type { FieldError as RHFFieldError } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  error?: RHFFieldError;
  description?: string;
  children: ReactNode;
  required?: boolean;
}

/** Shared label + control + description + error layout for every RHF-driven form in the app. */
export function FieldWrapper({ label, htmlFor, error, description, children, required }: FieldWrapperProps) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </FieldLabel>
      {children}
      {description && !error && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={error ? [error] : undefined} />
    </Field>
  );
}
