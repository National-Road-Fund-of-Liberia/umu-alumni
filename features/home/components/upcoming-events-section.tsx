import { CalendarDays } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { SectionHeading } from "@/components/common/section-heading";
import { EventCard } from "@/features/events/components/event-card";
import type { AlumniEvent } from "@/types/event";

export function UpcomingEventsSection({ events }: { events: AlumniEvent[] }) {
  return (
    <section className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          title="Upcoming events"
          description="Reunions, chapter meetups, and professional development for alumni everywhere."
          viewAllHref="/events"
        />
        <div className="mt-8">
          {events.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="No upcoming events yet"
              description="Check back soon — new events are announced regularly."
            />
          )}
        </div>
      </div>
    </section>
  );
}
