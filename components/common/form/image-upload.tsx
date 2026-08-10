"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import { useId, useState, type ChangeEvent, type DragEvent } from "react";
import { toast } from "sonner";

import { DataUriImage } from "@/components/common/data-uri-image";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { uploadImage } from "@/lib/upload-client";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

interface ImageUploadProps {
  label: string;
  /** Storage folder prefix — e.g. "committee", "gallery", "admin-users". */
  folder: string;
  value: string | null;
  onChange: (url: string | null) => void;
  error?: string;
  required?: boolean;
  aspect?: "square" | "video";
  hint?: string;
}

/**
 * Eagerly uploads a selected file straight to Firebase Storage via
 * /api/admin/upload, then stores only the resulting HTTPS URL in the form
 * field. Nothing is base64-encoded in the browser or submitted with the
 * record payload.
 */
export function ImageUpload({
  label,
  folder,
  value,
  onChange,
  error,
  required,
  aspect = "square",
  hint = "PNG, JPG, or WebP — up to 10MB",
}: ImageUploadProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function processFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please upload a PNG, JPG, or WebP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Image must be smaller than 10MB.");
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadImage(file, folder, value);
      onChange(url);
    } catch (uploadError) {
      toast.error(uploadError instanceof Error ? uploadError.message : "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void processFile(file);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void processFile(file);
  }

  const aspectClass = aspect === "square" ? "aspect-square" : "aspect-16/9";

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={inputId}>
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </FieldLabel>

      <div
        className={cn(
          "relative flex w-full max-w-xs items-center justify-center overflow-hidden rounded-lg border border-dashed border-input bg-muted/30 transition-colors",
          aspectClass,
          isDragging && "border-ring bg-muted",
          error && "border-destructive",
          isUploading && "pointer-events-none opacity-70"
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {value ? (
          <>
            <DataUriImage src={value} alt="" className="absolute inset-0 h-full w-full" />
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className="absolute top-2 right-2 z-10"
              disabled={isUploading}
              onClick={() => onChange(null)}
              aria-label="Remove image"
            >
              <X className="size-3.5" aria-hidden="true" />
            </Button>
            {isUploading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60">
                <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
              </div>
            )}
          </>
        ) : (
          <label htmlFor={inputId} className="flex cursor-pointer flex-col items-center gap-2 p-6 text-center">
            {isUploading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
            ) : (
              <ImagePlus className="size-5 text-muted-foreground" aria-hidden="true" />
            )}
            <span className="text-xs text-muted-foreground">
              {isUploading ? "Uploading…" : "Click to upload or drag and drop"}
            </span>
          </label>
        )}
      </div>

      <input
        id={inputId}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        disabled={isUploading}
        onChange={handleInputChange}
      />

      {value && (
        <label htmlFor={inputId} className="w-fit cursor-pointer text-xs font-medium text-foreground underline underline-offset-4">
          Replace image
        </label>
      )}

      {hint && !error && <FieldDescription>{hint}</FieldDescription>}
      <FieldError errors={error ? [{ message: error }] : undefined} />
    </Field>
  );
}
