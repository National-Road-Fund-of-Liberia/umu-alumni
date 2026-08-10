"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import Link from "next/link";

import { DataUriImage } from "@/components/common/data-uri-image";
import { Button } from "@/components/ui/button";
import type { PublicAlumni } from "@/types/alumni";

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

export const publicAlumniColumns: ColumnDef<PublicAlumni>[] = [
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
          href={`/directory/${alumni.id}`}
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
    accessorKey: "organization",
    header: "Organization",
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue<string>()}</span>,
  },
];
