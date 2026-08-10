import { DataUriImage } from "@/components/common/data-uri-image";
import type { PastPresident } from "@/types/past-president";

export function PastPresidentCard({ person }: { person: PastPresident }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="size-20 overflow-hidden rounded-full border border-border bg-muted">
        <DataUriImage src={person.photoUrl} alt={`Portrait of ${person.fullName}`} className="h-full w-full" />
      </div>
      <p className="mt-3 text-sm font-semibold text-foreground">{person.fullName}</p>
      <p className="text-xs text-muted-foreground">{person.year}</p>
    </div>
  );
}
