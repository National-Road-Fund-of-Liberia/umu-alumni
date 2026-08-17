import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { FilterPill } from "@/components/common/filter-pill";
import { PageHeader } from "@/components/common/page-header";
import { ListRowSkeleton } from "@/components/common/skeletons";
import { EventCard } from "@/features/events/components/event-card";
import { EventService } from "@/services/event.service";
import { EVENT_CATEGORIES } from "@/types/event";

// Safety net so this self-heals if an admin mutation's on-demand
// revalidation (lib/public-cache.ts) ever misses this deployment.
export const revalidate = 30;

export const metadata: Metadata = {
  title: "Events",
  description: "Reunions, chapter meetups, and professional development events for UMU alumni.",
};

interface EventsPageProps {
  searchParams: Promise<{ category?: string; when?: string }>;
}

async function EventsList({ category, when }: { category?: string; when?: string }) {
  const events = await EventService.listAll();

  const filtered = events.filter((event) => {
    if (category && event.category !== category) return false;
    if (when === "past" && event.status !== "past") return false;
    if (when !== "past" && event.status === "past") return false;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No events found"
        description="Try a different filter, or check back soon for newly announced events."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {filtered.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { category, when } = await searchParams;

  return (
    <>
      <PageHeader
        title="Events"
        description="From regional mixers to homecoming weekend, find every upcoming gathering — and browse past events."
      />
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <FilterPill href="/events" label="Upcoming" active={when !== "past"} />
              <FilterPill href="/events?when=past" label="Past" active={when === "past"} />
            </div>
            <div className="flex flex-wrap gap-2">
              {EVENT_CATEGORIES.map((cat) => {
                const params = new URLSearchParams();
                if (when === "past") params.set("when", "past");
                params.set("category", cat);
                return (
                  <FilterPill key={cat} href={`/events?${params.toString()}`} label={cat} active={category === cat} />
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <Suspense fallback={<ListRowSkeleton count={6} />}>
              <EventsList category={category} when={when} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
