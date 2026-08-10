import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Haven&rsquo;t updated your information?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-background/70 sm:text-base">
          Help the association keep the directory accurate and let fellow graduates find you.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
            <Link href="/contact">Contact the Association</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-background/30 text-background hover:bg-background/10 hover:text-background"
          >
            <Link href="/directory">Browse the Directory</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
