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
import { Textarea } from "@/components/ui/textarea";
import { committeeApi } from "@/features/committee/api";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import { ResourceApiError } from "@/lib/resource-client";
import { committeeMemberSchema, type CommitteeMemberFormValues } from "@/schemas/committee";
import type { CommitteeMember } from "@/types/committee";

interface CommitteeFormProps {
  member?: CommitteeMember;
}

const EMPTY_DEFAULTS: CommitteeMemberFormValues = {
  fullName: "",
  title: "",
  photoUrl: null,
  bio: "",
  termStart: new Date().getFullYear(),
  termEnd: null,
  displayOrder: 0,
};

export function CommitteeForm({ member }: CommitteeFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CommitteeMemberFormValues>({
    resolver: zodResolver(committeeMemberSchema),
    defaultValues: member ?? EMPTY_DEFAULTS,
  });

  const { navigate } = useUnsavedChangesGuard(isDirty);

  async function onSubmit(values: CommitteeMemberFormValues) {
    try {
      if (member) {
        await committeeApi.update(member.id, values);
        toast.success("Committee member updated.");
      } else {
        await committeeApi.create(values);
        toast.success("Committee member added.");
      }
      router.push("/admin/committee");
      router.refresh();
    } catch (error) {
      if (error instanceof ResourceApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          if (messages[0]) setError(field as keyof CommitteeMemberFormValues, { message: messages[0] });
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
            <ImageUpload label="Photo" value={field.value} onChange={field.onChange} error={errors.photoUrl?.message} />
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
            description="E.g. President, Vice President, Secretary General."
          >
            <Input id="title" aria-invalid={!!errors.title} {...register("title")} />
          </FieldWrapper>
        </div>

        <FieldWrapper label="Bio" htmlFor="bio" error={errors.bio} required>
          <Textarea id="bio" rows={4} aria-invalid={!!errors.bio} {...register("bio")} />
        </FieldWrapper>

        <div className="grid gap-5 sm:grid-cols-3">
          <FieldWrapper label="Term start" htmlFor="termStart" error={errors.termStart} required>
            <Input
              id="termStart"
              type="number"
              inputMode="numeric"
              aria-invalid={!!errors.termStart}
              {...register("termStart", { valueAsNumber: true })}
            />
          </FieldWrapper>
          <Controller
            control={control}
            name="termEnd"
            render={({ field }) => (
              <FieldWrapper
                label="Term end"
                htmlFor="termEnd"
                error={errors.termEnd}
                description="Leave blank if still serving."
              >
                <Input
                  id="termEnd"
                  type="number"
                  inputMode="numeric"
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value ? Number(event.target.value) : null)}
                />
              </FieldWrapper>
            )}
          />
          <FieldWrapper
            label="Display order"
            htmlFor="displayOrder"
            error={errors.displayOrder}
            required
            description="Lower numbers appear first."
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
          {member ? "Save Changes" : "Add Member"}
        </SubmitButton>
        <Button type="button" variant="outline" onClick={() => navigate("/admin/committee")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
