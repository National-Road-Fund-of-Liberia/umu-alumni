import { alumniRepository } from "@/repositories/alumni.repository";
import { committeeRepository } from "@/repositories/committee.repository";
import { eventRepository } from "@/repositories/event.repository";
import { newsRepository } from "@/repositories/news.repository";
import { PROGRAMS } from "@/types/alumni";
import type { AuditLogEntry } from "@/types/audit-log";
import { AuditService } from "./audit.service";

export interface ChartPoint {
  label: string;
  value: number;
}

export interface DashboardSummary {
  totalAlumni: number;
  upcomingEventsCount: number;
  publishedNewsCount: number;
  committeeCount: number;
  alumniByProgram: ChartPoint[];
  alumniByYear: ChartPoint[];
  recentActivity: AuditLogEntry[];
}

export interface PublicStats {
  totalAlumni: number;
  upcomingEventsCount: number;
  programCount: number;
  graduationYearSpan: { earliest: number; latest: number } | null;
}

export const DashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const [alumni, events, news, committee, recentActivity] = await Promise.all([
      alumniRepository.findAll(),
      eventRepository.findAll(),
      newsRepository.findAll(),
      committeeRepository.findAll(),
      AuditService.list(),
    ]);

    const alumniByProgram: ChartPoint[] = PROGRAMS.map((program) => ({
      label: program,
      value: alumni.filter((record) => record.program === program).length,
    }));

    const yearCounts = new Map<number, number>();
    for (const record of alumni) {
      yearCounts.set(record.graduationYear, (yearCounts.get(record.graduationYear) ?? 0) + 1);
    }
    const alumniByYear: ChartPoint[] = [...yearCounts.entries()]
      .sort(([yearA], [yearB]) => yearA - yearB)
      .map(([year, value]) => ({ label: String(year), value }));

    return {
      totalAlumni: alumni.length,
      upcomingEventsCount: events.filter((event) => event.status === "upcoming").length,
      publishedNewsCount: news.filter((article) => article.status === "published").length,
      committeeCount: committee.length,
      alumniByProgram,
      alumniByYear,
      recentActivity: recentActivity.slice(0, 8),
    };
  },

  async getPublicStats(): Promise<PublicStats> {
    const [alumni, events] = await Promise.all([alumniRepository.findAll(), eventRepository.findAll()]);

    const years = alumni.map((record) => record.graduationYear);
    const programsRepresented = new Set(alumni.map((record) => record.program));

    return {
      totalAlumni: alumni.length,
      upcomingEventsCount: events.filter((event) => event.status === "upcoming").length,
      programCount: programsRepresented.size,
      graduationYearSpan: years.length ? { earliest: Math.min(...years), latest: Math.max(...years) } : null,
    };
  },
};
