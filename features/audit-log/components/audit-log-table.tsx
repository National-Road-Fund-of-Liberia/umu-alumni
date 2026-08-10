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
import { History, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { TablePagination } from "@/components/common/table-pagination";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { AUDIT_ACTIONS, type AuditLogEntry } from "@/types/audit-log";
import { auditLogColumns } from "./audit-log-columns";

const PAGE_SIZE = 15;

export function AuditLogTable({ entries }: { entries: AuditLogEntry[] }) {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("all");
  const [entityType, setEntityType] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: PAGE_SIZE });
  const debouncedSearch = useDebouncedValue(search, 200);

  const entityTypes = useMemo(() => Array.from(new Set(entries.map((entry) => entry.entityType))).sort(), [entries]);

  const scopedData = useMemo(() => {
    return entries.filter((entry) => {
      if (action !== "all" && entry.action !== action) return false;
      if (entityType !== "all" && entry.entityType !== entityType) return false;
      return true;
    });
  }, [entries, action, entityType]);

  useEffect(() => {
    setPagination((state) => ({ ...state, pageIndex: 0 }));
  }, [debouncedSearch, action, entityType]);

  const table = useReactTable({
    data: scopedData,
    columns: auditLogColumns,
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search activity…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-9 pl-9"
            aria-label="Search audit log"
          />
        </div>
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="h-9 w-full sm:w-40" aria-label="Filter by action">
            <SelectValue placeholder="All Actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {AUDIT_ACTIONS.map((actionOption) => (
              <SelectItem key={actionOption} value={actionOption}>
                {actionOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={entityType} onValueChange={setEntityType}>
          <SelectTrigger className="h-9 w-full sm:w-44" aria-label="Filter by entity type">
            <SelectValue placeholder="All Entities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            {entityTypes.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {table.getRowModel().rows.length === 0 ? (
        <EmptyState icon={History} title="No activity found" description="Try adjusting your search or filters." />
      ) : (
        <DataTable
          table={table}
          footer={<TablePagination table={table} totalRows={totalMatches} itemLabel="events" />}
        />
      )}
    </div>
  );
}
