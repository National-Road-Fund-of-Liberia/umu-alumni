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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { eventsApi } from "@/features/events/api";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import { ResourceApiError } from "@/lib/resource-client";
import { eventSchema, type EventFormValues } from "@/schemas/event";
import { EVENT_CATEGORIES, EVENT_STATUSES, type AlumniEvent } from "@/types/event";

interface EventFormProps {
  event?: AlumniEvent;
}

const EMPTY_DEFAULTS: EventFormValues = {
  title: "",
  description: "",
  location: "",
  startDate: new Date().toISOString(),
  endDate: null,
  coverImageUrl: null,
  category: EVENT_CATEGORIES[0],
  status: "upcoming",
  registrationUrl: "",
};

function toDateInputValue(iso: string | null | undefined): string {
  return iso ? iso.slice(0, 10) : "";
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: event ?? EMPTY_DEFAULTS,
  });

  const { navigate } = useUnsavedChangesGuard(isDirty);

  async function onSubmit(values: EventFormValues) {
    try {
      const payload = { ...values, registrationUrl: values.registrationUrl || null };
      if (event) {
        await eventsApi.update(event.id, payload);
        toast.success("Event updated.");
      } else {
        await eventsApi.create(payload);
        toast.success("Event created.");
      }
      router.push("/admin/events");
      router.refresh();
    } catch (error) {
      if (error instanceof ResourceApiError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          if (messages[0]) setError(field as keyof EventFormValues, { message: messages[0] });
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
          name="coverImageUrl"
          render={({ field }) => (
            <ImageUpload
              label="Cover image"
              folder="events"
              aspect="video"
              value={field.value}
              onChange={field.onChange}
              error={errors.coverImageUrl?.message}
            />
          )}
        />

        <FieldWrapper label="Title" htmlFor="title" error={errors.title} required>
          <Input id="title" aria-invalid={!!errors.title} {...register("title")} />
        </FieldWrapper>

        <FieldWrapper label="Description" htmlFor="description" error={errors.description} required>
          <Textarea id="description" rows={5} aria-invalid={!!errors.description} {...register("description")} />
        </FieldWrapper>

        <FieldWrapper label="Location" htmlFor="location" error={errors.location} required>
          <Input id="location" aria-invalid={!!errors.location} {...register("location")} />
        </FieldWrapper>

        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <FieldWrapper label="Start date" htmlFor="startDate" error={errors.startDate} required>
                <Input
                  id="startDate"
                  type="date"
                  value={toDateInputValue(field.value)}
                  onChange={(inputEvent) =>
                    field.onChange(inputEvent.target.value ? new Date(inputEvent.target.value).toISOString() : "")
                  }
                />
              </FieldWrapper>
            )}
          />
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <FieldWrapper
                label="End date"
                htmlFor="endDate"
                error={errors.endDate}
                description="Optional, for multi-day events."
              >
                <Input
                  id="endDate"
                  type="date"
                  value={toDateInputValue(field.value)}
                  onChange={(inputEvent) =>
                    field.onChange(inputEvent.target.value ? new Date(inputEvent.target.value).toISOString() : null)
                  }
                />
              </FieldWrapper>
            )}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <FieldWrapper label="Category" htmlFor="category" error={errors.category} required>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="category" aria-invalid={!!errors.category}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWrapper>
            )}
          />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <FieldWrapper label="Status" htmlFor="status" error={errors.status} required>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status" aria-invalid={!!errors.status}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_STATUSES.map((statusOption) => (
                      <SelectItem key={statusOption} value={statusOption}>
                        {statusOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWrapper>
            )}
          />
        </div>

        <FieldWrapper
          label="Registration link"
          htmlFor="registrationUrl"
          error={errors.registrationUrl}
          description="Optional. Shown as a “Register” button on the public event page."
        >
          <Input
            id="registrationUrl"
            type="url"
            placeholder="https://…"
            aria-invalid={!!errors.registrationUrl}
            {...register("registrationUrl")}
          />
        </FieldWrapper>
      </FieldGroup>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <SubmitButton isSubmitting={isSubmitting} submittingLabel="Saving…">
          {event ? "Save Changes" : "Create Event"}
        </SubmitButton>
        <Button type="button" variant="outline" onClick={() => navigate("/admin/events")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
