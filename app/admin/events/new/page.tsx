import type { Metadata } from "next";

import { EventForm } from "@/features/events/components/event-form";

export const metadata: Metadata = {
  title: "Add Event",
};

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Add Event</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create a new event for the association calendar.</p>
      </div>
      <EventForm />
    </div>
  );
}
