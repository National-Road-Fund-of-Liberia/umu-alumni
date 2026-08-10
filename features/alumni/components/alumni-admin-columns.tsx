"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { DataUriImage } from "@/components/common/data-uri-image";
import { Button } from "@/components/ui/button";
import type { Alumni } from "@/types/alumni";

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

interface AlumniAdminColumnsOptions {
  onDelete: (alumni: Alumni) => void;
}

export function getAlumniAdminColumns({ onDelete }: AlumniAdminColumnsOptions): ColumnDef<Alumni>[] {
  return [
    {
      id: "name",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      header: ({ column }) => (
        <SortableHeader label="Name" sorted={column.getIsSorted()} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
      ),
      cell: ({ row }) => {
        const alumni = row.original;
        const fullName = `${alumni.firstName} ${alumni.lastName}`;
        return (
          <Link
            href={`/admin/alumni/${alumni.id}`}
            className="flex items-center gap-3 font-medium text-foreground underline-offset-4 hover:underline"
          >
            <DataUriImage src={alumni.photoUrl} alt="" className="size-8 shrink-0 rounded-full" />
            {fullName}
          </Link>
        );
      },
    },
    {
      accessorKey: "program",
      header: ({ column }) => (
        <SortableHeader label="Program" sorted={column.getIsSorted()} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
      ),
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue<string>()}</span>,
    },
    {
      accessorKey: "graduationYear",
      header: ({ column }) => (
        <SortableHeader label="Class Year" sorted={column.getIsSorted()} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
      ),
    },
    {
      accessorKey: "occupation",
      header: "Occupation",
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue<string>()}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${row.original.firstName} ${row.original.lastName}`}>
            <Link href={`/admin/alumni/${row.original.id}`}>
              <Pencil className="size-3.5" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${row.original.firstName} ${row.original.lastName}`}
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="size-3.5 text-destructive" aria-hidden="true" />
          </Button>
        </div>
      ),
    },
  ];
}
