import { CalendarDays, GraduationCap, Landmark, Newspaper } from "lucide-react";
import type { Metadata } from "next";

import { HorizontalBarChart } from "@/components/common/charts/horizontal-bar-chart";
import { VerticalBarChart } from "@/components/common/charts/vertical-bar-chart";
import { StatCard } from "@/components/common/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportAlumniButton } from "@/features/reports/components/export-alumni-button";
import { AlumniService } from "@/services/alumni.service";
import { DashboardService } from "@/services/dashboard.service";
import { DEGREE_TYPES } from "@/types/alumni";

export const metadata: Metadata = {
  title: "Reports",
};

export default async function AdminReportsPage() {
  const [summary, alumni] = await Promise.all([DashboardService.getSummary(), AlumniService.listAll()]);

  const alumniByDegree = DEGREE_TYPES.map((degree) => ({
    label: degree,
    value: alumni.filter((record) => record.degree === degree).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Alumni network trends and exportable data for association reporting.
          </p>
        </div>
        <ExportAlumniButton alumni={alumni} />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={GraduationCap} label="Total Alumni" value={summary.totalAlumni.toLocaleString()} />
        <StatCard icon={CalendarDays} label="Upcoming Events" value={summary.upcomingEventsCount} />
        <StatCard icon={Newspaper} label="Published News" value={summary.publishedNewsCount} />
        <StatCard icon={Landmark} label="Committee Members" value={summary.committeeCount} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alumni by Program</CardTitle>
            <CardDescription>Distribution of alumni across degree programs.</CardDescription>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart data={summary.alumniByProgram} maxBars={10} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alumni by Degree</CardTitle>
            <CardDescription>Credential level across the alumni network.</CardDescription>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart data={alumniByDegree} maxBars={6} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alumni by Graduation Year</CardTitle>
          <CardDescription>How the network has grown across graduating classes.</CardDescription>
        </CardHeader>
        <CardContent>
          <VerticalBarChart data={summary.alumniByYear} />
        </CardContent>
      </Card>
    </div>
  );
}
