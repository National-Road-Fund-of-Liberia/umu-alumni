import { revalidatePath } from "next/cache";

/**
 * Public pages that read domain data are statically optimized by default
 * (fast, cacheable) — so an admin mutation must explicitly bust the pages
 * that show that data, or the change never appears until the next build.
 * This is on-demand ISR: one call per mutation, not a blanket
 * `force-dynamic` that would give up caching everywhere for no reason.
 */
export function revalidateAlumniPublicPages(id?: string): void {
  revalidatePath("/");
  revalidatePath("/directory");
  if (id) revalidatePath(`/directory/${id}`);
}

export function revalidateNewsPublicPages(slug?: string): void {
  revalidatePath("/");
  revalidatePath("/news");
  if (slug) revalidatePath(`/news/${slug}`);
}

export function revalidateEventPublicPages(slug?: string): void {
  revalidatePath("/");
  revalidatePath("/events");
  if (slug) revalidatePath(`/events/${slug}`);
}

export function revalidateCommitteePublicPages(): void {
  revalidatePath("/committee");
}
