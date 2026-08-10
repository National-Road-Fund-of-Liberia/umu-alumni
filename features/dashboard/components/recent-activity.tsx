import { CirclePlus, History, LogIn, LogOut, Pencil, Trash2, type LucideIcon } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { timeAgo } from "@/lib/utils";
import type { AuditAction, AuditLogEntry } from "@/types/audit-log";

const ACTION_ICON: Record<AuditAction, LucideIcon> = {
  create: CirclePlus,
  update: Pencil,
  delete: Trash2,
  login: LogIn,
  logout: LogOut,
};

export function RecentActivity({ entries }: { entries: AuditLogEntry[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <EmptyState icon={History} title="No activity yet" />
        ) : (
          <ul className="space-y-4">
            {entries.map((entry) => {
              const Icon = ACTION_ICON[entry.action];
              return (
                <li key={entry.id} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">{entry.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {timeAgo(entry.createdAt)} · {entry.actorUsername}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
