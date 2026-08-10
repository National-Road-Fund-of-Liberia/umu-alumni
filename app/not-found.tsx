import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function RootNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <Image src="/umu.png" alt="United Methodist University crest" width={64} height={64} className="size-16" />
      <h1 className="mt-6 font-heading text-2xl font-semibold tracking-tight text-foreground">Page not found</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or may have been moved.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
