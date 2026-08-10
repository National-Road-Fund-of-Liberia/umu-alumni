"use client";

import { flexRender, type Table as TanStackTable } from "@tanstack/react-table";
import type { ReactNode } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DataTableProps<TData> {
  table: TanStackTable<TData>;
  emptyMessage?: string;
  footer?: ReactNode;
}

/**
 * Purely presentational: the caller owns the `useReactTable` instance
 * (columns, sorting, filtering, pagination) and this component only
 * renders it. Keeps row navigation accessible by design — a column that
 * needs to link somewhere renders a real <Link> in its cell rather than
 * this component attaching a row-level click handler.
 */
export function DataTable<TData>({ table, emptyMessage = "No results.", footer }: DataTableProps<TData>) {
  const rows = table.getRowModel().rows;
  const columnCount = table.getAllLeafColumns().length;

  return (
    <div className="rounded-lg border border-border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-32 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {footer}
    </div>
  );
}
