"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldWrapper } from "@/components/common/form/field-wrapper";
import { ImageUpload } from "@/components/common/form/image-upload";
import { RichTextEditor } from "@/components/common/form/rich-text-editor";
import { SubmitButton } from "@/components/common/form/submit-button";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { featuredAlumniApi } from "@/features/featured-alumni/api";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import { navigateAfterMutation } from "@/lib/navigate-after-mutation";
import { ResourceApiError } from "@/lib/resource-client";
import { featuredAlumniSchema, type FeaturedAlumniFormValues } from "@/schemas/featured-alumni";
import type { FeaturedAlumni } from "@/types/featured-alumni";

interface FeaturedAlumniFormProps {
  member?: FeaturedAlumni;
}

const EMPTY_DEFAULTS: FeaturedAlumniFormValues = {
  fullName: "",
  title: "",
  organization: "",
  graduationYear: new Date().getFullYear(),
  photoUrl: null,
  bio: "",
  displayOrder: 0,
};

export function FeaturedAlumniForm({ member }: FeaturedAlumniFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FeaturedAlumniFormValues>({
    resolver: zodResolver(featuredAlumniSchema),
    defaultValues: member ?? EMPTY_DEFAULTS,
  });

  const { navigate } = useUnsavedChangesGuard(isDirty);

  async function onSubmit(values: FeaturedAlumniFormValues) {
    try {
      if (member) {
        await featuredAlumniApi.update(member.id, values);
        toast.success("Featured alumni updated.");
      } else {
        await featuredAlumniApi.create(values);
        toast.success("Featured alumni added.");
      }
      navigateAfterMutation(router, "/admin/featured-alumni");
    } catch (error) {
      if (error instanceof ResourceApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          if (messages[0]) setError(field as keyof FeaturedAlumniFormValues, { message: messages[0] });
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
              folder="featured-alumni"
              value={field.value}
              onChange={field.onChange}
              error={errors.photoUrl?.message}
            />
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FieldWrapper label="Full name" htmlFor="fullName" error={errors.fullName} required>
            <Input id="fullName" aria-invalid={!!errors.fullName} {...register("fullName")} />
          </FieldWrapper>
          <FieldWrapper
            label="Title"
            htmlFor="title"
            error={errors.title}
            required
            description="Current role, e.g. Minister, Director, etc."
          >
            <Input id="title" aria-invalid={!!errors.title} {...register("title")} />
          </FieldWrapper>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FieldWrapper label="Organization" htmlFor="organization" error={errors.organization} required>
            <Input id="organization" aria-invalid={!!errors.organization} {...register("organization")} />
          </FieldWrapper>
          <FieldWrapper label="Graduation year" htmlFor="graduationYear" error={errors.graduationYear} required>
            <Input
              id="graduationYear"
              type="number"
              inputMode="numeric"
              aria-invalid={!!errors.graduationYear}
              {...register("graduationYear", { valueAsNumber: true })}
            />
          </FieldWrapper>
        </div>

        <Controller
          control={control}
          name="bio"
          render={({ field }) => (
            <FieldWrapper label="Bio" htmlFor="bio" error={errors.bio} required>
              <RichTextEditor
                id="bio"
                value={field.value}
                onChange={field.onChange}
                aria-invalid={!!errors.bio}
              />
            </FieldWrapper>
          )}
        />

        <FieldWrapper
          label="Display order"
          htmlFor="displayOrder"
          error={errors.displayOrder}
          required
          description="Lower numbers appear first on the homepage."
        >
          <Input
            id="displayOrder"
            type="number"
            inputMode="numeric"
            aria-invalid={!!errors.displayOrder}
            {...register("displayOrder", { valueAsNumber: true })}
          />
        </FieldWrapper>
      </FieldGroup>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <SubmitButton isSubmitting={isSubmitting} submittingLabel="Saving…">
          {member ? "Save Changes" : "Add Featured Alumni"}
        </SubmitButton>
        <Button type="button" variant="outline" onClick={() => navigate("/admin/featured-alumni")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
