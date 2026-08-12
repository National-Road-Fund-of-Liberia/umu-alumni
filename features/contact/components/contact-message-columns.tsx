"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, Trash2 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, timeAgo } from "@/lib/utils";
import type { ContactMessage } from "@/types/contact-message";

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

interface ContactMessageColumnsOptions {
  onDelete: (message: ContactMessage) => void;
}

export function getContactMessageColumns({ onDelete }: ContactMessageColumnsOptions): ColumnDef<ContactMessage>[] {
  return [
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <SortableHeader label="Received" sorted={column.getIsSorted()} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
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
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<ContactMessage["status"]>();
        return <Badge variant={status === "unread" ? "default" : "secondary"}>{status === "unread" ? "Unread" : "Read"}</Badge>;
      },
    },
    {
      accessorKey: "name",
      header: "From",
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="font-medium text-foreground">{row.original.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <Link
          href={`/admin/messages/${row.original.id}`}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {row.original.subject}
        </Link>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button asChild variant="ghost" size="icon-sm" aria-label={`View message from ${row.original.name}`}>
            <Link href={`/admin/messages/${row.original.id}`}>
              <Eye className="size-3.5" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete message from ${row.original.name}`}
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="size-3.5 text-destructive" aria-hidden="true" />
          </Button>
        </div>
      ),
    },
  ];
}
