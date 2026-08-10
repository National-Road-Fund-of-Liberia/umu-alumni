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
import { Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { TablePagination } from "@/components/common/table-pagination";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { PublicAlumni } from "@/types/alumni";
import { AlumniCard } from "./alumni-card";
import { publicAlumniColumns } from "./alumni-columns";
import { AlumniFilters } from "./alumni-filters";

const PAGE_SIZE = 12;

export function AlumniDirectory({ alumni }: { alumni: PublicAlumni[] }) {
  const [search, setSearch] = useState("");
  const [program, setProgram] = useState("all");
  const [year, setYear] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: PAGE_SIZE });

  const debouncedSearch = useDebouncedValue(search, 200);

  const years = useMemo(
    () => Array.from(new Set(alumni.map((person) => person.graduationYear))).sort((a, b) => b - a),
    [alumni]
  );

  const scopedData = useMemo(() => {
    return alumni.filter((person) => {
      if (program !== "all" && person.program !== program) return false;
      if (year !== "all" && String(person.graduationYear) !== year) return false;
      return true;
    });
  }, [alumni, program, year]);

  // Any change to the active filters should land the user back on page one.
  useEffect(() => {
    setPagination((state) => ({ ...state, pageIndex: 0 }));
  }, [debouncedSearch, program, year]);

  const table = useReactTable({
    data: scopedData,
    columns: publicAlumniColumns,
    state: { sorting, globalFilter: debouncedSearch, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;
  const totalMatches = table.getFilteredRowModel().rows.length;

  return (
    <div>
      <AlumniFilters
        search={search}
        onSearchChange={setSearch}
        program={program}
        onProgramChange={setProgram}
        year={year}
        onYearChange={setYear}
        years={years}
      />

      <div className="mt-6">
        {rows.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No alumni match your search"
            description="Try adjusting your search term or filters."
          />
        ) : (
          <>
            <div className="hidden md:block">
              <DataTable
                table={table}
                footer={<TablePagination table={table} totalRows={totalMatches} itemLabel="alumni" />}
              />
            </div>
            <div className="md:hidden">
              <div className="grid gap-4 sm:grid-cols-2">
                {rows.map((row) => (
                  <AlumniCard key={row.original.id} alumni={row.original} />
                ))}
              </div>
              <div className="mt-6 rounded-lg border border-border">
                <TablePagination table={table} totalRows={totalMatches} itemLabel="alumni" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
