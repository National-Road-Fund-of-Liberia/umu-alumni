"use client";

import { Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useConfirm } from "@/components/common/confirm-dialog-provider";
import { DataUriImage } from "@/components/common/data-uri-image";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { featuredAlumniApi } from "@/features/featured-alumni/api";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { FeaturedAlumni } from "@/types/featured-alumni";

export function FeaturedAlumniAdminGrid({ members }: { members: FeaturedAlumni[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [removedIds, setRemovedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 200);

  const records = useMemo(
    () => members.filter((member) => !removedIds.has(member.id)),
    [members, removedIds]
  );

  const filtered = useMemo(() => {
    if (!debouncedSearch) return records;
    const needle = debouncedSearch.toLowerCase();
    return records.filter((member) =>
      `${member.fullName} ${member.title} ${member.organization}`.toLowerCase().includes(needle)
    );
  }, [records, debouncedSearch]);

  async function handleDelete(target: FeaturedAlumni) {
    const confirmed = await confirm({
      title: `Remove ${target.fullName}?`,
      description: "This will remove this person from the Featured Alumni spotlight. This action cannot be undone.",
      confirmLabel: "Remove",
      destructive: true,
    });
    if (!confirmed) return;

    try {
      await featuredAlumniApi.remove(target.id);
      setRemovedIds((current) => new Set([...current, target.id]));
      toast.success(`${target.fullName} was removed.`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove featured alumni.");
    }
  }

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
            placeholder="Search featured alumni…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-9 pl-9"
            aria-label="Search featured alumni"
          />
        </div>
        <Button asChild>
          <Link href="/admin/featured-alumni/new">
            <Plus className="size-4" aria-hidden="true" />
            Add Featured Alumni
          </Link>
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Star} title="No featured alumni found" description="Try a different search." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((member) => (
            <div key={member.id} className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="aspect-4/3 w-full overflow-hidden bg-muted">
                <DataUriImage
                  src={member.photoUrl}
                  alt={`Portrait of ${member.fullName}`}
                  className="h-full w-full"
                />
              </div>
              <div className="flex items-start justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{member.fullName}</p>
                  <p className="truncate text-xs text-muted-foreground">{member.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{member.organization}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Class of {member.graduationYear}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${member.fullName}`}>
                    <Link href={`/admin/featured-alumni/${member.id}`}>
                      <Pencil className="size-3.5" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${member.fullName}`}
                    onClick={() => handleDelete(member)}
                  >
                    <Trash2 className="size-3.5 text-destructive" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
