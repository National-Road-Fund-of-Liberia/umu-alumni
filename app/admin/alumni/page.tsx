import type { Metadata } from "next";

import { AlumniAdminTable } from "@/features/alumni/components/alumni-admin-table";
import { AlumniService } from "@/services/alumni.service";

export const metadata: Metadata = {
  title: "Alumni",
};

export default async function AdminAlumniPage() {
  const alumni = await AlumniService.listAll();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Alumni</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage alumni records, including private contact details not shown on the public site.
        </p>
      </div>
      <AlumniAdminTable alumni={alumni} />
    </div>
  );
}
