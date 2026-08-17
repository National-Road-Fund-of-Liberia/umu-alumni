import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DataUriImage } from "@/components/common/data-uri-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { EventService } from "@/services/event.service";

// Safety net so this self-heals if an admin mutation's on-demand
// revalidation (lib/public-cache.ts) ever misses this deployment.
export const revalidate = 30;

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const event = await EventService.getBySlug(slug);
    return { title: event.title, description: event.description };
  } catch {
    return { title: "Event not found" };
  }
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;

  let event;
  try {
    event = await EventService.getBySlug(slug);
  } catch {
    notFound();
  }

  const dateRange =
    event.endDate && event.endDate !== event.startDate
      ? `${formatDate(event.startDate)} – ${formatDate(event.endDate)}`
      : formatDate(event.startDate);

  return (
    <article>
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to Events
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{event.category}</Badge>
            {event.status === "past" && <Badge variant="secondary">Past Event</Badge>}
            {event.status === "cancelled" && <Badge variant="destructive">Cancelled</Badge>}
          </div>
          <h1 className="mt-3 text-balance font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {event.title}
          </h1>
          <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-6">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4" aria-hidden="true" />
              {dateRange}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4" aria-hidden="true" />
              {event.location}
            </span>
          </div>
        </div>
      </div>

      {event.coverImageUrl && (
        <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="aspect-16/9 overflow-hidden rounded-lg bg-muted">
            <DataUriImage src={event.coverImageUrl} alt="" className="h-full w-full" />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-base leading-relaxed text-foreground">{event.description}</p>

        {event.status === "upcoming" && event.registrationUrl && (
          <div className="mt-8">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                Register for this Event
              </a>
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
