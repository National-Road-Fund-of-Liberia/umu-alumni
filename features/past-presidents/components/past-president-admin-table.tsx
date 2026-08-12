"use client";

import { getCoreRowModel, getSortedRowModel, useReactTable, type SortingState } from "@tanstack/react-table";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { useConfirm } from "@/components/common/confirm-dialog-provider";
import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { pastPresidentsApi } from "@/features/past-presidents/api";
import type { PastPresident } from "@/types/past-president";
import { getPastPresidentAdminColumns } from "./past-president-admin-columns";

export function PastPresidentAdminTable({ people }: { people: PastPresident[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [removedIds, setRemovedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [sorting, setSorting] = useState<SortingState>([{ id: "year", desc: true }]);

  const records = useMemo(
    () => people.filter((record) => !removedIds.has(record.id)),
    [people, removedIds]
  );

  const handleDelete = useCallback(
    async (target: PastPresident) => {
      const confirmed = await confirm({
        title: `Remove ${target.fullName}?`,
        description: "This will remove this record from the Past Presidents list. This action cannot be undone.",
        confirmLabel: "Remove",
        destructive: true,
      });
      if (!confirmed) return;

      try {
        await pastPresidentsApi.remove(target.id);
        setRemovedIds((current) => new Set([...current, target.id]));
        toast.success(`${target.fullName} was removed.`);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to remove this record.");
      }
    },
    [confirm, router]
  );

  const columns = useMemo(() => getPastPresidentAdminColumns({ onDelete: handleDelete }), [handleDelete]);

  const table = useReactTable({
    data: records,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button asChild>
          <Link href="/admin/committee/past-presidents/new">
            <Plus className="size-4" aria-hidden="true" />
            Add Past President
          </Link>
        </Button>
      </div>

      {people.length === 0 ? (
        <EmptyState icon={Users} title="No past presidents recorded" description="Add the association's former presidents here." />
      ) : (
        <DataTable table={table} />
      )}
    </div>
  );
}
