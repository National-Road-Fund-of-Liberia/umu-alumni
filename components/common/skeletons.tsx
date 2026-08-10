import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PageHeaderSkeleton() {
  return (
    <div className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-3 h-9 w-full max-w-md" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({
  count = 6,
  columns = "sm:grid-cols-2 lg:grid-cols-3",
  aspect = "aspect-16/9",
  className,
}: {
  count?: number;
  columns?: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-5", columns, className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-lg border border-border">
          <Skeleton className={cn("w-full rounded-none", aspect)} />
          <div className="space-y-2.5 p-5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-5 rounded-lg border border-border p-5">
          <Skeleton className="size-16 shrink-0 rounded-md" />
          <div className="flex flex-1 flex-col justify-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
