import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PastPresidentAdminTable } from "@/features/past-presidents/components/past-president-admin-table";
import { PastPresidentService } from "@/services/past-president.service";

export const metadata: Metadata = {
  title: "Past Presidents",
};

export default async function AdminPastPresidentsPage() {
  const people = await PastPresidentService.listAll();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/committee"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to Executive Committee
        </Link>
        <h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-foreground">Past Presidents</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Former presidents of the Alumni Association, shown on the public Executive Committee page.
        </p>
      </div>
      <PastPresidentAdminTable people={people} />
    </div>
  );
}
