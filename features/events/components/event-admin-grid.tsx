"use client";

import { CalendarDays, MapPin, MoreVertical, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useConfirm } from "@/components/common/confirm-dialog-provider";
import { DataUriImage } from "@/components/common/data-uri-image";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { eventsApi } from "@/features/events/api";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatDate } from "@/lib/utils";
import { EVENT_STATUSES, type AlumniEvent } from "@/types/event";

const STATUS_VARIANT: Record<AlumniEvent["status"], "default" | "secondary" | "destructive"> = {
  upcoming: "default",
  past: "secondary",
  cancelled: "destructive",
};

export function EventAdminGrid({ events }: { events: AlumniEvent[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const debouncedSearch = useDebouncedValue(search, 200);

  const filtered = useMemo(() => {
    return events
      .filter((event) => {
        if (status !== "all" && event.status !== status) return false;
        if (debouncedSearch) {
          const haystack = `${event.title} ${event.location} ${event.category}`.toLowerCase();
          if (!haystack.includes(debouncedSearch.toLowerCase())) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [events, status, debouncedSearch]);

  async function handleDelete(target: AlumniEvent) {
    const confirmed = await confirm({
      title: `Delete "${target.title}"?`,
      description: "This will permanently remove this event. This action cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!confirmed) return;

    try {
      await eventsApi.remove(target.id);
      toast.success("Event deleted.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete event.");
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
              placeholder="Search events…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-9 pl-9"
              aria-label="Search events"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-full sm:w-44" aria-label="Filter by status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {EVENT_STATUSES.map((statusOption) => (
                <SelectItem key={statusOption} value={statusOption}>
                  {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="size-4" aria-hidden="true" />
            Add Event
          </Link>
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No events found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <div key={event.id} className="relative overflow-hidden rounded-lg border border-border bg-card">
              <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-sm"
                      className="shadow-sm"
                      aria-label={`Actions for ${event.title}`}
                    >
                      <MoreVertical className="size-3.5" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/events/${event.id}`}>
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={(selectEvent) => {
                        selectEvent.preventDefault();
                        void handleDelete(event);
                      }}
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="aspect-16/9 w-full overflow-hidden bg-muted">
                <DataUriImage src={event.coverImageUrl} alt="" className="h-full w-full" />
              </div>
              <div className="flex flex-col gap-3 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{event.category}</Badge>
                  <Badge variant={STATUS_VARIANT[event.status]}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading text-base font-semibold leading-snug text-foreground">{event.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{formatDate(event.startDate)}</p>
                  <p className="mt-1 flex items-center gap-1 truncate text-sm text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                    {event.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
