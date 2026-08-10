import type { ChartPoint } from "@/services/dashboard.service";

export function HorizontalBarChart({ data, maxBars = 8 }: { data: ChartPoint[]; maxBars?: number }) {
  const bars = [...data].sort((a, b) => b.value - a.value).slice(0, maxBars);
  const max = Math.max(...bars.map((point) => point.value), 1);

  if (bars.length === 0) {
    return <p className="text-sm text-muted-foreground">No data yet.</p>;
  }

  return (
    <div className="space-y-3">
      {bars.map((point) => (
        <div key={point.label} className="grid grid-cols-[minmax(0,8rem)_1fr_2.5rem] items-center gap-3 text-sm">
          <span className="truncate text-muted-foreground" title={point.label}>
            {point.label}
          </span>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground/80"
              style={{ width: `${Math.max((point.value / max) * 100, 2)}%` }}
            />
          </div>
          <span className="text-right font-medium text-foreground tabular-nums">{point.value}</span>
        </div>
      ))}
    </div>
  );
}
