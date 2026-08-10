import { DataUriImage } from "@/components/common/data-uri-image";
import type { CommitteeMember } from "@/types/committee";

export function CommitteeCard({ member }: { member: CommitteeMember }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="aspect-square w-full overflow-hidden bg-muted">
        <DataUriImage src={member.photoUrl} alt={`Portrait of ${member.fullName}`} className="h-full w-full" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <h3 className="font-heading text-base font-semibold text-foreground">{member.fullName}</h3>
        <p className="text-sm font-medium text-muted-foreground">{member.title}</p>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
      </div>
    </div>
  );
}
