"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldWrapper } from "@/components/common/form/field-wrapper";
import { ImageUpload } from "@/components/common/form/image-upload";
import { SubmitButton } from "@/components/common/form/submit-button";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { alumniApi } from "@/features/alumni/api";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import { ResourceApiError } from "@/lib/resource-client";
import { alumniSchema, type AlumniFormValues } from "@/schemas/alumni";
import { DEGREE_TYPES, PROGRAMS, type Alumni } from "@/types/alumni";

interface AlumniFormProps {
  alumni?: Alumni;
}

const EMPTY_DEFAULTS: AlumniFormValues = {
  firstName: "",
  lastName: "",
  photoUrl: null,
  degree: DEGREE_TYPES[0],
  program: PROGRAMS[0],
  graduationYear: new Date().getFullYear(),
  occupation: "",
  organization: "",
  biography: "",
  email: "",
  phone: "",
  address: "",
  studentId: "",
};

export function AlumniForm({ alumni }: AlumniFormProps) {
  const router = useRouter();
  const isEditing = Boolean(alumni);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AlumniFormValues>({
    resolver: zodResolver(alumniSchema),
    defaultValues: alumni ?? EMPTY_DEFAULTS,
  });

  const { navigate } = useUnsavedChangesGuard(isDirty);

  async function onSubmit(values: AlumniFormValues) {
    try {
      if (alumni) {
        await alumniApi.update(alumni.id, values);
        toast.success("Alumni record updated.");
      } else {
        await alumniApi.create(values);
        toast.success("Alumni record created.");
      }
      router.push("/admin/alumni");
      router.refresh();
    } catch (error) {
      if (error instanceof ResourceApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          if (messages[0]) {
            setError(field as keyof AlumniFormValues, { message: messages[0] });
          }
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
          <FieldWrapper label="First name" htmlFor="firstName" error={errors.firstName} required>
            <Input id="firstName" aria-invalid={!!errors.firstName} {...register("firstName")} />
          </FieldWrapper>
          <FieldWrapper label="Last name" htmlFor="lastName" error={errors.lastName} required>
            <Input id="lastName" aria-invalid={!!errors.lastName} {...register("lastName")} />
          </FieldWrapper>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Controller
            control={control}
            name="degree"
            render={({ field }) => (
              <FieldWrapper label="Degree" htmlFor="degree" error={errors.degree} required>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="degree" aria-invalid={!!errors.degree}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEGREE_TYPES.map((degree) => (
                      <SelectItem key={degree} value={degree}>
                        {degree}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWrapper>
            )}
          />
          <Controller
            control={control}
            name="program"
            render={({ field }) => (
              <FieldWrapper label="Program" htmlFor="program" error={errors.program} required>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="program" aria-invalid={!!errors.program}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROGRAMS.map((program) => (
                      <SelectItem key={program} value={program}>
                        {program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWrapper>
            )}
          />
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

        <div className="grid gap-5 sm:grid-cols-2">
          <FieldWrapper label="Occupation" htmlFor="occupation" error={errors.occupation} required>
            <Input id="occupation" aria-invalid={!!errors.occupation} {...register("occupation")} />
          </FieldWrapper>
          <FieldWrapper label="Organization" htmlFor="organization" error={errors.organization} required>
            <Input id="organization" aria-invalid={!!errors.organization} {...register("organization")} />
          </FieldWrapper>
        </div>

        <FieldWrapper
          label="Biography"
          htmlFor="biography"
          error={errors.biography}
          required
          description="Shown on the alumnus's public profile page."
        >
          <Textarea id="biography" rows={5} aria-invalid={!!errors.biography} {...register("biography")} />
        </FieldWrapper>

        <FieldSeparator>Private Contact Information</FieldSeparator>
        <p className="-mt-4 text-sm text-muted-foreground">
          These fields are visible to administrators only and are never shown on the public website.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <FieldWrapper label="Email" htmlFor="email" error={errors.email} required>
            <Input id="email" type="email" aria-invalid={!!errors.email} {...register("email")} />
          </FieldWrapper>
          <FieldWrapper label="Phone" htmlFor="phone" error={errors.phone} required>
            <Input id="phone" type="tel" aria-invalid={!!errors.phone} {...register("phone")} />
          </FieldWrapper>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FieldWrapper label="Address" htmlFor="address" error={errors.address} required>
            <Input id="address" aria-invalid={!!errors.address} {...register("address")} />
          </FieldWrapper>
          <FieldWrapper label="Student ID" htmlFor="studentId" error={errors.studentId} required>
            <Input id="studentId" aria-invalid={!!errors.studentId} {...register("studentId")} />
          </FieldWrapper>
        </div>
      </FieldGroup>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <SubmitButton isSubmitting={isSubmitting} submittingLabel="Saving…">
          {isEditing ? "Save Changes" : "Add Alumni"}
        </SubmitButton>
        <Button type="button" variant="outline" onClick={() => navigate("/admin/alumni")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
