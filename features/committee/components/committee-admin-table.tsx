"use client";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { Landmark, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { useConfirm } from "@/components/common/confirm-dialog-provider";
import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { committeeApi } from "@/features/committee/api";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { CommitteeMember } from "@/types/committee";
import { getCommitteeAdminColumns } from "./committee-admin-columns";

export function CommitteeAdminTable({ members }: { members: CommitteeMember[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [removedIds, setRemovedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "displayOrder", desc: false }]);
  const debouncedSearch = useDebouncedValue(search, 200);

  const records = useMemo(
    () => members.filter((record) => !removedIds.has(record.id)),
    [members, removedIds]
  );

  const handleDelete = useCallback(
    async (target: CommitteeMember) => {
      const confirmed = await confirm({
        title: `Remove ${target.fullName}?`,
        description: "This will remove this member from the Executive Committee roster. This action cannot be undone.",
        confirmLabel: "Remove",
        destructive: true,
      });
      if (!confirmed) return;

      try {
        await committeeApi.remove(target.id);
        setRemovedIds((current) => new Set([...current, target.id]));
        toast.success(`${target.fullName} was removed.`);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to remove committee member.");
      }
    },
    [confirm, router]
  );

  const columns = useMemo(() => getCommitteeAdminColumns({ onDelete: handleDelete }), [handleDelete]);

  const table = useReactTable({
    data: records,
    columns,
    state: { sorting, globalFilter: debouncedSearch },
    onSortingChange: setSorting,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search committee members…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-9 pl-9"
            aria-label="Search committee members"
          />
        </div>
        <Button asChild>
          <Link href="/admin/committee/new">
            <Plus className="size-4" aria-hidden="true" />
            Add Member
          </Link>
        </Button>
      </div>

      {table.getRowModel().rows.length === 0 ? (
        <EmptyState icon={Landmark} title="No committee members found" description="Try a different search." />
      ) : (
        <DataTable table={table} />
      )}
    </div>
  );
}
