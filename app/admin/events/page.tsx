import type { Metadata } from "next";

import { EventAdminTable } from "@/features/events/components/event-admin-table";
import { EventService } from "@/services/event.service";

export const metadata: Metadata = {
  title: "Events",
};

export default async function AdminEventsPage() {
  const events = await EventService.listAll();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Events</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage reunions, chapter meetups, and other association events.</p>
      </div>
      <EventAdminTable events={events} />
    </div>
  );
}
