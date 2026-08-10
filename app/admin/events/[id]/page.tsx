import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EventForm } from "@/features/events/components/event-form";
import { EventService } from "@/services/event.service";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Event",
};

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;

  let event;
  try {
    event = await EventService.getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">{event.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update this event.</p>
      </div>
      <EventForm event={event} />
    </div>
  );
}
