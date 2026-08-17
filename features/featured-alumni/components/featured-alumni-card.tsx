import Link from "next/link";

import { DataUriImage } from "@/components/common/data-uri-image";
import type { FeaturedAlumni } from "@/types/featured-alumni";

export function FeaturedAlumniCard({ member }: { member: FeaturedAlumni }) {
  return (
    <Link
      href={`/featured-alumni/${member.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="aspect-4/3 w-full overflow-hidden bg-muted">
        <DataUriImage
          src={member.photoUrl}
          alt={`Portrait of ${member.fullName}`}
          className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-heading text-base font-semibold text-foreground">{member.fullName}</h3>
        <p className="text-sm text-muted-foreground">Class of {member.graduationYear}</p>
        <p className="mt-1 line-clamp-1 text-sm text-foreground">{member.title}</p>
        <p className="line-clamp-1 text-xs text-muted-foreground">{member.organization}</p>
      </div>
    </Link>
  );
}
