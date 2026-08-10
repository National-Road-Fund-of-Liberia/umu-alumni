import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { CardGridSkeleton } from "@/components/common/skeletons";
import { CtaSection } from "@/features/home/components/cta-section";
import { FeaturedAlumni } from "@/features/home/components/featured-alumni";
import { Hero } from "@/features/home/components/hero";
import { LatestNewsSection } from "@/features/home/components/latest-news-section";
import { Mission } from "@/features/home/components/mission";
import { StatsSection } from "@/features/home/components/stats-section";
import { UpcomingEventsSection } from "@/features/home/components/upcoming-events-section";
import { AlumniService } from "@/services/alumni.service";
import { DashboardService } from "@/services/dashboard.service";
import { EventService } from "@/services/event.service";
import { NewsService } from "@/services/news.service";

async function HomeDynamicSections() {
  const [stats, alumni, events, news] = await Promise.all([
    DashboardService.getPublicStats(),
    AlumniService.listPublic(),
    EventService.listUpcoming(),
    NewsService.listPublished(),
  ]);

  const featuredAlumni = [...alumni].sort((a, b) => b.graduationYear - a.graduationYear).slice(0, 4);

  return (
    <>
      <StatsSection stats={stats} />
      <FeaturedAlumni alumni={featuredAlumni} />
      <UpcomingEventsSection events={events.slice(0, 3)} />
      <LatestNewsSection articles={news.slice(0, 3)} />
      <CtaSection />
    </>
  );
}

function HomeSectionsSkeleton() {
  return (
    <div>
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <CardGridSkeleton count={4} columns="sm:grid-cols-2 lg:grid-cols-4" aspect="aspect-4/3" />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Mission />
      <Suspense fallback={<HomeSectionsSkeleton />}>
        <HomeDynamicSections />
      </Suspense>
    </>
  );
}
