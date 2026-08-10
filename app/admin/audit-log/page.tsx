import type { Metadata } from "next";

import { AuditLogTable } from "@/features/audit-log/components/audit-log-table";
import { AuditService } from "@/services/audit.service";

export const metadata: Metadata = {
  title: "Audit Log",
};

export default async function AdminAuditLogPage() {
  const entries = await AuditService.list();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Audit Log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A record of every create, update, delete, and sign-in action taken across the dashboard.
        </p>
      </div>
      <AuditLogTable entries={entries} />
    </div>
  );
}
