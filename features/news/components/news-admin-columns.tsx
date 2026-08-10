"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { NewsArticle } from "@/types/news";

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

interface NewsAdminColumnsOptions {
  onDelete: (article: NewsArticle) => void;
}

export function getNewsAdminColumns({ onDelete }: NewsAdminColumnsOptions): ColumnDef<NewsArticle>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <SortableHeader label="Title" sorted={column.getIsSorted()} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
      ),
      cell: ({ row }) => (
        <Link
          href={`/admin/news/${row.original.id}`}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ getValue }) => <Badge variant="outline">{getValue<string>()}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<string>();
        return <Badge variant={status === "published" ? "default" : "secondary"}>{status}</Badge>;
      },
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue<string>()}</span>,
    },
    {
      id: "publishedAt",
      accessorFn: (row) => row.publishedAt ?? "",
      header: ({ column }) => (
        <SortableHeader label="Published" sorted={column.getIsSorted()} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.publishedAt ? formatDate(row.original.publishedAt) : "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${row.original.title}`}>
            <Link href={`/admin/news/${row.original.id}`}>
              <Pencil className="size-3.5" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${row.original.title}`}
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="size-3.5 text-destructive" aria-hidden="true" />
          </Button>
        </div>
      ),
    },
  ];
}
