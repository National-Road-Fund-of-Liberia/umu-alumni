import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
        <div>
          <h1 className="text-balance font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            A lifelong community for UMU graduates.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            The Alumni Association connects graduates across every class and program — find classmates, follow
            association news, and stay part of the university&rsquo;s story.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link href="/directory">Search the Directory</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/events">Upcoming Events</Link>
            </Button>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="absolute inset-0 rounded-full border border-gold/30" aria-hidden="true" />
          <div className="absolute inset-6 flex items-center justify-center rounded-full border border-border bg-card">
            <Image
              src="/umu.png"
              alt="United Methodist University crest"
              width={200}
              height={200}
              className="h-auto w-2/3"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
