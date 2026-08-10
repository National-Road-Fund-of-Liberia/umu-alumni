"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { DataUriImage } from "@/components/common/data-uri-image";
import { Button } from "@/components/ui/button";
import type { PastPresident } from "@/types/past-president";

interface PastPresidentAdminColumnsOptions {
  onDelete: (person: PastPresident) => void;
}

export function getPastPresidentAdminColumns({ onDelete }: PastPresidentAdminColumnsOptions): ColumnDef<PastPresident>[] {
  return [
    {
      accessorKey: "fullName",
      header: "Name",
      cell: ({ row }) => (
        <Link
          href={`/admin/committee/past-presidents/${row.original.id}`}
          className="flex items-center gap-3 font-medium text-foreground underline-offset-4 hover:underline"
        >
          <DataUriImage src={row.original.photoUrl} alt="" className="size-8 shrink-0 rounded-full" />
          {row.original.fullName}
        </Link>
      ),
    },
    {
      accessorKey: "year",
      header: "Year",
      cell: ({ getValue }) => <span className="text-muted-foreground tabular-nums">{getValue<number>()}</span>,
    },
    {
      accessorKey: "displayOrder",
      header: "Order",
      cell: ({ getValue }) => <span className="text-muted-foreground tabular-nums">{getValue<number>()}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${row.original.fullName}`}>
            <Link href={`/admin/committee/past-presidents/${row.original.id}`}>
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
