import { MISSION_STATEMENT } from "@/lib/constants";

export function Mission() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-balance font-heading text-2xl leading-snug font-medium tracking-tight text-foreground sm:text-3xl">
          &ldquo;{MISSION_STATEMENT}&rdquo;
        </p>
      </div>
    </section>
  );
}
