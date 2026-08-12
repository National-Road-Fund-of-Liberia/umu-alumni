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
import { Mail, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useConfirm } from "@/components/common/confirm-dialog-provider";
import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { TablePagination } from "@/components/common/table-pagination";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { messagesApi } from "@/features/contact/api";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { CONTACT_MESSAGE_STATUSES, type ContactMessage } from "@/types/contact-message";
import { getContactMessageColumns } from "./contact-message-columns";

const PAGE_SIZE = 15;

export function ContactMessagesTable({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [removedIds, setRemovedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: PAGE_SIZE });
  const debouncedSearch = useDebouncedValue(search, 200);

  const records = useMemo(
    () => messages.filter((message) => !removedIds.has(message.id)),
    [messages, removedIds]
  );

  const handleDelete = useCallback(
    async (target: ContactMessage) => {
      const confirmed = await confirm({
        title: `Delete message from ${target.name}?`,
        description: "This will permanently remove this contact message. This action cannot be undone.",
        confirmLabel: "Delete",
        destructive: true,
      });
      if (!confirmed) return;

      try {
        await messagesApi.remove(target.id);
        setRemovedIds((current) => new Set([...current, target.id]));
        toast.success("Message deleted.");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete message.");
      }
    },
    [confirm, router]
  );

  const columns = useMemo(() => getContactMessageColumns({ onDelete: handleDelete }), [handleDelete]);

  const scopedData = useMemo(
    () => (status === "all" ? records : records.filter((message) => message.status === status)),
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
  const unreadCount = records.filter((message) => message.status === "unread").length;

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
              placeholder="Search messages…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-9 pl-9"
              aria-label="Search messages"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-full sm:w-40" aria-label="Filter by status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {CONTACT_MESSAGE_STATUSES.map((statusOption) => (
                <SelectItem key={statusOption} value={statusOption}>
                  {statusOption === "unread" ? "Unread" : "Read"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {unreadCount > 0 && (
          <p className="text-sm text-muted-foreground">
            {unreadCount} unread {unreadCount === 1 ? "message" : "messages"}
          </p>
        )}
      </div>

      {table.getRowModel().rows.length === 0 ? (
        <EmptyState icon={Mail} title="No messages found" description="Try adjusting your search or filters." />
      ) : (
        <DataTable
          table={table}
          footer={<TablePagination table={table} totalRows={totalMatches} itemLabel="messages" />}
        />
      )}
    </div>
  );
}
