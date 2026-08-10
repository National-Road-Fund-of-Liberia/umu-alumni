"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, timeAgo } from "@/lib/utils";
import type { AuditAction, AuditLogEntry } from "@/types/audit-log";

function SortableHeader({ label, sorted, onClick }: { label: string; sorted: false | "asc" | "desc"; onClick: () => void }) {
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="-ml-2.5 gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase hover:text-foreground"
    >
      {label}
      <Icon className="size-3.5" aria-hidden="true" />
    </Button>
  );
}

const ACTION_VARIANT: Record<AuditAction, "default" | "secondary" | "destructive" | "outline"> = {
  create: "default",
  update: "secondary",
  delete: "destructive",
  login: "outline",
  logout: "outline",
};

export const auditLogColumns: ColumnDef<AuditLogEntry>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader label="When" sorted={column.getIsSorted()} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <span className="text-muted-foreground" title={formatDate(value)}>
          {timeAgo(value)}
        </span>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ getValue }) => {
      const action = getValue<AuditAction>();
      return <Badge variant={ACTION_VARIANT[action]}>{action}</Badge>;
    },
  },
  {
    accessorKey: "entityType",
    header: "Entity",
    cell: ({ getValue }) => <span className="text-muted-foreground capitalize">{getValue<string>()}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
  },
  {
    accessorKey: "actorUsername",
    header: "Actor",
    cell: ({ getValue }) => <span className="text-muted-foreground">@{getValue<string>()}</span>,
  },
];
