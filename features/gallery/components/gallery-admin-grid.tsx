"use client";

import { ImagePlus, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useConfirm } from "@/components/common/confirm-dialog-provider";
import { DataUriImage } from "@/components/common/data-uri-image";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { galleryApi } from "@/features/gallery/api";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { GalleryItem } from "@/types/gallery";

export function GalleryAdminGrid({ items }: { items: GalleryItem[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [records, setRecords] = useState(items);
  const [search, setSearch] = useState("");
  const [album, setAlbum] = useState("all");
  const debouncedSearch = useDebouncedValue(search, 200);

  useEffect(() => {
    setRecords(items);
  }, [items]);

  const albums = useMemo(() => Array.from(new Set(records.map((item) => item.album))).sort(), [records]);

  const filtered = useMemo(() => {
    return records.filter((item) => {
      if (album !== "all" && item.album !== album) return false;
      if (debouncedSearch) {
        const haystack = `${item.caption} ${item.album}`.toLowerCase();
        if (!haystack.includes(debouncedSearch.toLowerCase())) return false;
      }
      return true;
    });
  }, [records, album, debouncedSearch]);

  async function handleDelete(target: GalleryItem) {
    const confirmed = await confirm({
      title: "Delete this photo?",
      description: "This will permanently remove this photo from the gallery. This action cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!confirmed) return;

    try {
      await galleryApi.remove(target.id);
      setRecords((current) => current.filter((record) => record.id !== target.id));
      toast.success("Photo deleted.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete photo.");
    }
  }

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
              placeholder="Search photos…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-9 pl-9"
              aria-label="Search photos"
            />
          </div>
          <Select value={album} onValueChange={setAlbum}>
            <SelectTrigger className="h-9 w-full sm:w-56" aria-label="Filter by album">
              <SelectValue placeholder="All Albums" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Albums</SelectItem>
              {albums.map((albumName) => (
                <SelectItem key={albumName} value={albumName}>
                  {albumName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button asChild>
          <Link href="/admin/gallery/new">
            <Plus className="size-4" aria-hidden="true" />
            Add Photo
          </Link>
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ImagePlus} title="No photos found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="aspect-square w-full overflow-hidden bg-muted">
                <DataUriImage src={item.imageUrl} alt={item.caption} className="h-full w-full" />
              </div>
              <div className="flex items-start justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{item.caption}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.album}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${item.caption}`}>
                    <Link href={`/admin/gallery/${item.id}`}>
                      <Pencil className="size-3.5" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${item.caption}`}
                    onClick={() => handleDelete(item)}
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
