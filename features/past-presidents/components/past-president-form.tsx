"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldWrapper } from "@/components/common/form/field-wrapper";
import { ImageUpload } from "@/components/common/form/image-upload";
import { SubmitButton } from "@/components/common/form/submit-button";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { pastPresidentsApi } from "@/features/past-presidents/api";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import { navigateAfterMutation } from "@/lib/navigate-after-mutation";
import { ResourceApiError } from "@/lib/resource-client";
import { pastPresidentSchema, type PastPresidentFormValues } from "@/schemas/past-president";
import type { PastPresident } from "@/types/past-president";

interface PastPresidentFormProps {
  person?: PastPresident;
}

const EMPTY_DEFAULTS: PastPresidentFormValues = {
  fullName: "",
  photoUrl: null,
  year: new Date().getFullYear(),
  displayOrder: 0,
};

export function PastPresidentForm({ person }: PastPresidentFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PastPresidentFormValues>({
    resolver: zodResolver(pastPresidentSchema),
    defaultValues: person ?? EMPTY_DEFAULTS,
  });

  const { navigate } = useUnsavedChangesGuard(isDirty);

  async function onSubmit(values: PastPresidentFormValues) {
    try {
      if (person) {
        await pastPresidentsApi.update(person.id, values);
        toast.success("Past president updated.");
      } else {
        await pastPresidentsApi.create(values);
        toast.success("Past president added.");
      }
      navigateAfterMutation(router, "/admin/committee/past-presidents");
    } catch (error) {
      if (error instanceof ResourceApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          if (messages[0]) setError(field as keyof PastPresidentFormValues, { message: messages[0] });
        }
      }
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-3xl space-y-8">
      <FieldGroup>
        <Controller
          control={control}
          name="photoUrl"
          render={({ field }) => (
            <ImageUpload
              label="Photo"
              folder="past-presidents"
              value={field.value}
              onChange={field.onChange}
              error={errors.photoUrl?.message}
            />
          )}
        />

        <FieldWrapper label="Full name" htmlFor="fullName" error={errors.fullName} required>
          <Input id="fullName" aria-invalid={!!errors.fullName} {...register("fullName")} />
        </FieldWrapper>

        <div className="grid gap-5 sm:grid-cols-2">
          <FieldWrapper label="Year" htmlFor="year" error={errors.year} required>
            <Input
              id="year"
              type="number"
              inputMode="numeric"
              aria-invalid={!!errors.year}
              {...register("year", { valueAsNumber: true })}
            />
          </FieldWrapper>
          <FieldWrapper
            label="Display order"
            htmlFor="displayOrder"
            error={errors.displayOrder}
            required
            description="Lower numbers appear first within the same year."
          >
            <Input
              id="displayOrder"
              type="number"
              inputMode="numeric"
              aria-invalid={!!errors.displayOrder}
              {...register("displayOrder", { valueAsNumber: true })}
            />
          </FieldWrapper>
        </div>
      </FieldGroup>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <SubmitButton isSubmitting={isSubmitting} submittingLabel="Saving…">
          {person ? "Save Changes" : "Add Past President"}
        </SubmitButton>
        <Button type="button" variant="outline" onClick={() => navigate("/admin/committee/past-presidents")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
