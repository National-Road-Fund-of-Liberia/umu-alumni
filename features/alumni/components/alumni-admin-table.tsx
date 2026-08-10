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
import { Plus, Search, Users } from "lucide-react";
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
import { alumniApi } from "@/features/alumni/api";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { PROGRAMS, type Alumni } from "@/types/alumni";
import { getAlumniAdminColumns } from "./alumni-admin-columns";

const PAGE_SIZE = 10;

export function AlumniAdminTable({ alumni }: { alumni: Alumni[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [records, setRecords] = useState(alumni);
  const [search, setSearch] = useState("");
  const [program, setProgram] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: PAGE_SIZE });
  const debouncedSearch = useDebouncedValue(search, 200);

  useEffect(() => {
    setRecords(alumni);
  }, [alumni]);

  const handleDelete = useCallback(
    async (target: Alumni) => {
      const confirmed = await confirm({
        title: `Delete ${target.firstName} ${target.lastName}?`,
        description:
          "This will permanently remove this alumni record, including their private contact details. This action cannot be undone.",
        confirmLabel: "Delete",
        destructive: true,
      });
      if (!confirmed) return;

      try {
        await alumniApi.remove(target.id);
        setRecords((current) => current.filter((record) => record.id !== target.id));
        toast.success(`${target.firstName} ${target.lastName} was removed.`);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete alumni record.");
      }
    },
    [confirm, router]
  );

  const columns = useMemo(() => getAlumniAdminColumns({ onDelete: handleDelete }), [handleDelete]);

  const scopedData = useMemo(
    () => (program === "all" ? records : records.filter((record) => record.program === program)),
    [records, program]
  );

  useEffect(() => {
    setPagination((state) => ({ ...state, pageIndex: 0 }));
  }, [debouncedSearch, program]);

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
              placeholder="Search alumni…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-9 pl-9"
              aria-label="Search alumni"
            />
          </div>
          <Select value={program} onValueChange={setProgram}>
            <SelectTrigger className="h-9 w-full sm:w-56" aria-label="Filter by program">
              <SelectValue placeholder="All Programs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {PROGRAMS.map((programOption) => (
                <SelectItem key={programOption} value={programOption}>
                  {programOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button asChild>
          <Link href="/admin/alumni/new">
            <Plus className="size-4" aria-hidden="true" />
            Add Alumni
          </Link>
        </Button>
      </div>

      {table.getRowModel().rows.length === 0 ? (
        <EmptyState icon={Users} title="No alumni found" description="Try adjusting your search or filters." />
      ) : (
        <DataTable
          table={table}
          footer={<TablePagination table={table} totalRows={totalMatches} itemLabel="alumni" />}
        />
      )}
    </div>
  );
}
