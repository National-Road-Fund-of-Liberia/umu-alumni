import { MapPin } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { AlumniEvent } from "@/types/event";

export function EventCard({ event }: { event: AlumniEvent }) {
  const date = new Date(event.startDate);
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex gap-5 rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-md border border-border bg-muted/50">
        <span className="text-lg leading-none font-semibold text-foreground">{day}</span>
        <span className="mt-1 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">{month}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{event.category}</Badge>
          {event.status === "past" && <Badge variant="secondary">Past</Badge>}
          {event.status === "cancelled" && <Badge variant="destructive">Cancelled</Badge>}
          {event.status === "upcoming" && event.registrationUrl && (
            <Badge className="bg-gold text-gold-foreground">Registration Open</Badge>
          )}
        </div>
        <h3 className="font-heading text-base font-semibold text-foreground">{event.title}</h3>
        <p className="line-clamp-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          {event.location}
        </p>
      </div>
    </Link>
  );
}
