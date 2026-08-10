import { CalendarDays, GraduationCap, Landmark, Newspaper } from "lucide-react";
import type { Metadata } from "next";

import { StatCard } from "@/components/common/stat-card";
import { HorizontalBarChart } from "@/components/common/charts/horizontal-bar-chart";
import { VerticalBarChart } from "@/components/common/charts/vertical-bar-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { RecentActivity } from "@/features/dashboard/components/recent-activity";
import { DashboardService } from "@/services/dashboard.service";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  const summary = await DashboardService.getSummary();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          An overview of the alumni network, activity, and upcoming programming.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={GraduationCap} label="Total Alumni" value={summary.totalAlumni.toLocaleString()} />
        <StatCard icon={CalendarDays} label="Upcoming Events" value={summary.upcomingEventsCount} />
        <StatCard icon={Newspaper} label="Published News" value={summary.publishedNewsCount} />
        <StatCard icon={Landmark} label="Committee Members" value={summary.committeeCount} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <QuickActions />
        <RecentActivity entries={summary.recentActivity} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alumni by Program</CardTitle>
            <CardDescription>Distribution of alumni across degree programs.</CardDescription>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart data={summary.alumniByProgram} />
          </CardContent>
        </Card>
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
    </div>
  );
}
