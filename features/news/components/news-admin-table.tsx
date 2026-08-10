"use client";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { Newspaper, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useConfirm } from "@/components/common/confirm-dialog-provider";
import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { TablePagination } from "@/components/common/table-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { newsApi } from "@/features/news/api";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { NEWS_STATUSES, type NewsArticle } from "@/types/news";
import { getNewsAdminColumns } from "./news-admin-columns";

const PAGE_SIZE = 10;

export function NewsAdminTable({ articles }: { articles: NewsArticle[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [records, setRecords] = useState(articles);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "title", desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: PAGE_SIZE });
  const debouncedSearch = useDebouncedValue(search, 200);

  useEffect(() => {
    setRecords(articles);
  }, [articles]);

  const handleDelete = useCallback(
    async (target: NewsArticle) => {
      const confirmed = await confirm({
        title: `Delete "${target.title}"?`,
        description: "This will permanently remove this article. This action cannot be undone.",
        confirmLabel: "Delete",
        destructive: true,
      });
      if (!confirmed) return;

      try {
        await newsApi.remove(target.id);
        setRecords((current) => current.filter((record) => record.id !== target.id));
        toast.success("Article deleted.");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete article.");
      }
    },
    [confirm, router]
  );

  const columns = useMemo(() => getNewsAdminColumns({ onDelete: handleDelete }), [handleDelete]);

  const scopedData = useMemo(
    () => (status === "all" ? records : records.filter((article) => article.status === status)),
    [records, status]
  );

  useEffect(() => {
    setPagination((state) => ({ ...state, pageIndex: 0 }));
  }, [debouncedSearch, status]);

  const table = useReactTable({
    data: scopedData,
    columns,
    state: { sorting, globalFilter: debouncedSearch, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totalMatches = table.getFilteredRowModel().rows.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search articles…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-9 pl-9"
              aria-label="Search articles"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-full sm:w-44" aria-label="Filter by status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {NEWS_STATUSES.map((statusOption) => (
                <SelectItem key={statusOption} value={statusOption}>
                  {statusOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button asChild>
          <Link href="/admin/news/new">
            <Plus className="size-4" aria-hidden="true" />
            Add Article
          </Link>
        </Button>
      </div>

      {table.getRowModel().rows.length === 0 ? (
        <EmptyState icon={Newspaper} title="No articles found" description="Try adjusting your search or filters." />
      ) : (
        <DataTable
          table={table}
          footer={<TablePagination table={table} totalRows={totalMatches} itemLabel="articles" />}
        />
      )}
    </div>
  );
}
