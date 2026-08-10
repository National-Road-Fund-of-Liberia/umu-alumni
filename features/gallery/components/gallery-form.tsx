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
import { galleryApi } from "@/features/gallery/api";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import { ResourceApiError } from "@/lib/resource-client";
import { galleryItemSchema, type GalleryItemFormValues } from "@/schemas/gallery";
import type { GalleryItem } from "@/types/gallery";

interface GalleryFormProps {
  item?: GalleryItem;
}

const EMPTY_DEFAULTS: GalleryItemFormValues = {
  imageUrl: "",
  caption: "",
  album: "",
};

export function GalleryForm({ item }: GalleryFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<GalleryItemFormValues>({
    resolver: zodResolver(galleryItemSchema),
    defaultValues: item ?? EMPTY_DEFAULTS,
  });

  const { navigate } = useUnsavedChangesGuard(isDirty);

  async function onSubmit(values: GalleryItemFormValues) {
    try {
      if (item) {
        await galleryApi.update(item.id, values);
        toast.success("Photo updated.");
      } else {
        await galleryApi.create(values);
        toast.success("Photo added.");
      }
      router.push("/admin/gallery");
      router.refresh();
    } catch (error) {
      if (error instanceof ResourceApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          if (messages[0]) setError(field as keyof GalleryItemFormValues, { message: messages[0] });
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
          name="imageUrl"
          render={({ field }) => (
            <ImageUpload
              label="Photo"
              folder="gallery"
              required
              value={field.value || null}
              onChange={(value) => field.onChange(value ?? "")}
              error={errors.imageUrl?.message}
            />
          )}
        />

        <FieldWrapper label="Caption" htmlFor="caption" error={errors.caption} required>
          <Input id="caption" aria-invalid={!!errors.caption} {...register("caption")} />
        </FieldWrapper>

        <FieldWrapper
          label="Album"
          htmlFor="album"
          error={errors.album}
          required
          description="Groups related photos together, e.g. “Homecoming 2026”."
        >
          <Input id="album" aria-invalid={!!errors.album} {...register("album")} />
        </FieldWrapper>
      </FieldGroup>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <SubmitButton isSubmitting={isSubmitting} submittingLabel="Saving…">
          {item ? "Save Changes" : "Add Photo"}
        </SubmitButton>
        <Button type="button" variant="outline" onClick={() => navigate("/admin/gallery")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
