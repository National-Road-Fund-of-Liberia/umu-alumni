import { BookOpen, CalendarDays, GraduationCap, Landmark } from "lucide-react";

import { StatCard } from "@/components/common/stat-card";
import type { PublicStats } from "@/services/dashboard.service";

export function StatsSection({ stats }: { stats: PublicStats }) {
  return (
    <section className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={GraduationCap} label="Alumni Network" value={stats.totalAlumni.toLocaleString()} />
          <StatCard icon={BookOpen} label="Programs Represented" value={stats.programCount} />
          <StatCard icon={CalendarDays} label="Upcoming Events" value={stats.upcomingEventsCount} />
          <StatCard
            icon={Landmark}
            label="Graduating Classes"
            value={
              stats.graduationYearSpan
                ? `${stats.graduationYearSpan.earliest}–${stats.graduationYearSpan.latest}`
                : "—"
            }
          />
        </div>
      </div>
    </section>
  );
}
