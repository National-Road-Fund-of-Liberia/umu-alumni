import { cn } from "@/lib/utils";

/**
 * Renders an image field that may be a data URI (seed placeholders) or a
 * Firebase Storage URL (uploaded photos). Plain <img>, not next/image:
 * there's nothing for next/image to optimize for a data URI, and Storage
 * URLs aren't from a configured remote-image host.
 */
export function DataUriImage({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return <div className={cn("bg-muted", className)} aria-hidden="true" />;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={cn("object-cover", className)} />;
}
