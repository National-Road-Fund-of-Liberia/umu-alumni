import { Landmark } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CommitteeAdminTable } from "@/features/committee/components/committee-admin-table";
import { CommitteeService } from "@/services/committee.service";

export const metadata: Metadata = {
  title: "Executive Committee",
};

export default async function AdminCommitteePage() {
  const members = await CommitteeService.listAll();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Executive Committee</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage the elected leadership roster shown on the public site.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/committee/past-presidents">
            <Landmark className="size-4" aria-hidden="true" />
            Past Presidents
          </Link>
        </Button>
      </div>
      <CommitteeAdminTable members={members} />
    </div>
  );
}
