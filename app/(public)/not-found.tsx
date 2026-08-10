import { Compass } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function PublicNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Compass className="size-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <h1 className="mt-6 font-heading text-2xl font-semibold tracking-tight text-foreground">Page not found</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or may have been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/directory">Search the Directory</Link>
        </Button>
      </div>
    </div>
  );
}
