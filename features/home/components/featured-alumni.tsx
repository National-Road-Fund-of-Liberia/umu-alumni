import { SectionHeading } from "@/components/common/section-heading";
import { FeaturedAlumniCard } from "@/features/featured-alumni/components/featured-alumni-card";
import type { FeaturedAlumni } from "@/types/featured-alumni";

export function FeaturedAlumniSection({ alumni }: { alumni: FeaturedAlumni[] }) {
  if (alumni.length === 0) return null;

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          title="Graduates making an impact"
          description="A small sample of the thousands of UMU graduates building careers across Liberia and beyond."
          viewAllHref="/directory"
          viewAllLabel="Browse the directory"
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {alumni.map((member) => (
            <FeaturedAlumniCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
