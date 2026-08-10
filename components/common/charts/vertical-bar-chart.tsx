import type { ChartPoint } from "@/services/dashboard.service";

export function VerticalBarChart({ data }: { data: ChartPoint[] }) {
  const max = Math.max(...data.map((point) => point.value), 1);
  const labelEvery = Math.ceil(data.length / 8) || 1;

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">No data yet.</p>;
  }

  return (
    <div>
      <div className="flex h-32 items-end gap-1">
        {data.map((point) => (
          <div key={point.label} className="group flex h-full flex-1 items-end">
            <div
              className="w-full rounded-t-sm bg-foreground/70 transition-colors group-hover:bg-gold"
              style={{ height: `${Math.max((point.value / max) * 100, 4)}%` }}
              title={`${point.label}: ${point.value}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1">
        {data.map((point, index) => (
          <div key={point.label} className="flex-1 text-center text-[10px] text-muted-foreground">
            {index % labelEvery === 0 ? point.label : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
