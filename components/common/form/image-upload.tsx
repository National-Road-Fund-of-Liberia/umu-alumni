"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import { useId, useState, type ChangeEvent, type DragEvent } from "react";
import { toast } from "sonner";

import { DataUriImage } from "@/components/common/data-uri-image";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

interface ImageUploadProps {
  label: string;
  value: string | null;
  onChange: (dataUri: string | null) => void;
  error?: string;
  required?: boolean;
  aspect?: "square" | "video";
  hint?: string;
}

/**
 * Reads a client-uploaded file into a base64 data URI via FileReader — the
 * same representation used for seeded placeholder photos, so the rest of
 * the app never has to distinguish "uploaded" from "seeded" images. This is
 * the one component that would need to change if uploads later go to real
 * object storage instead of an inline data URI.
 */
export function ImageUpload({
  label,
  value,
  onChange,
  error,
  required,
  aspect = "square",
  hint = "PNG, JPG, or WebP — up to 10MB",
}: ImageUploadProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  function processFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please upload a PNG, JPG, or WebP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Image must be smaller than 10MB.");
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      toast.error("Couldn't read that file. Please try again.");
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) processFile(file);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) processFile(file);
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
          error && "border-destructive"
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
              onClick={() => onChange(null)}
              aria-label="Remove image"
            >
              <X className="size-3.5" aria-hidden="true" />
            </Button>
          </>
        ) : (
          <label htmlFor={inputId} className="flex cursor-pointer flex-col items-center gap-2 p-6 text-center">
            {isProcessing ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
            ) : (
              <ImagePlus className="size-5 text-muted-foreground" aria-hidden="true" />
            )}
            <span className="text-xs text-muted-foreground">Click to upload or drag and drop</span>
          </label>
        )}
      </div>

      <input
        id={inputId}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
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
