"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { DataUriImage } from "@/components/common/data-uri-image";
import { Button } from "@/components/ui/button";
import type { CommitteeMember } from "@/types/committee";

interface CommitteeAdminColumnsOptions {
  onDelete: (member: CommitteeMember) => void;
}

export function getCommitteeAdminColumns({ onDelete }: CommitteeAdminColumnsOptions): ColumnDef<CommitteeMember>[] {
  return [
    {
      accessorKey: "displayOrder",
      header: "Order",
      cell: ({ getValue }) => <span className="text-muted-foreground tabular-nums">{getValue<number>()}</span>,
    },
    {
      accessorKey: "fullName",
      header: "Name",
      cell: ({ row }) => (
        <Link
          href={`/admin/committee/${row.original.id}`}
          className="flex items-center gap-3 font-medium text-foreground underline-offset-4 hover:underline"
        >
          <DataUriImage src={row.original.photoUrl} alt="" className="size-8 shrink-0 rounded-full" />
          {row.original.fullName}
        </Link>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue<string>()}</span>,
    },
    {
      id: "term",
      header: "Term",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.termStart}
          {row.original.termEnd ? `–${row.original.termEnd}` : "–present"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${row.original.fullName}`}>
            <Link href={`/admin/committee/${row.original.id}`}>
              <Pencil className="size-3.5" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${row.original.fullName}`}
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="size-3.5 text-destructive" aria-hidden="true" />
          </Button>
        </div>
      ),
    },
  ];
}
