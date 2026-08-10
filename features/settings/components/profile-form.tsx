"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldWrapper } from "@/components/common/form/field-wrapper";
import { ImageUpload } from "@/components/common/form/image-upload";
import { SubmitButton } from "@/components/common/form/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ResourceApiError } from "@/lib/resource-client";
import { adminProfileSchema, type AdminProfileFormValues } from "@/schemas/user";
import type { AdminUser } from "@/types/user";

export function ProfileForm({ user }: { user: AdminUser }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AdminProfileFormValues>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues: { displayName: user.displayName, avatarUrl: user.avatarUrl },
  });

  async function onSubmit(values: AdminProfileFormValues) {
    try {
      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!result.success) {
        throw new ResourceApiError(result.error.message, result.error.fieldErrors);
      }
      toast.success("Profile updated.");
      router.refresh();
    } catch (error) {
      if (error instanceof ResourceApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          if (messages[0]) setError(field as keyof AdminProfileFormValues, { message: messages[0] });
        }
      }
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          control={control}
          name="avatarUrl"
          render={({ field }) => (
            <ImageUpload
              label="Avatar"
              folder="admin-users"
              value={field.value}
              onChange={field.onChange}
              error={errors.avatarUrl?.message}
            />
          )}
        />
        <FieldWrapper label="Display name" htmlFor="displayName" error={errors.displayName} required>
          <Input id="displayName" aria-invalid={!!errors.displayName} {...register("displayName")} />
        </FieldWrapper>
        <div>
          <SubmitButton isSubmitting={isSubmitting} submittingLabel="Saving…" disabled={!isDirty}>
            Save Changes
          </SubmitButton>
        </div>
      </FieldGroup>
    </form>
  );
}
