import { revalidatePath } from "next/cache";

/**
 * Public pages that read domain data are statically optimized by default
 * (fast, cacheable) — so an admin mutation must explicitly bust the pages
 * that show that data, or the change never appears until the next build.
 *
 * Also bust `/admin` layout so list/dashboard views don't keep a stale
 * Client Cache / RSC payload after create/update/delete.
 *
 * This is on-demand ISR: one call per mutation, not a blanket
 * `force-dynamic` that would give up caching everywhere for no reason.
 */
function revalidateAdminShell(): void {
  revalidatePath("/admin", "layout");
}

export function revalidateAlumniPublicPages(id?: string): void {
  revalidatePath("/");
  revalidatePath("/directory");
  if (id) revalidatePath(`/directory/${id}`);
  revalidatePath("/admin/alumni");
  revalidateAdminShell();
}

export function revalidateNewsPublicPages(slug?: string): void {
  revalidatePath("/");
  revalidatePath("/news");
  if (slug) revalidatePath(`/news/${slug}`);
  revalidatePath("/admin/news");
  revalidateAdminShell();
}

export function revalidateEventPublicPages(slug?: string): void {
  revalidatePath("/");
  revalidatePath("/events");
  if (slug) revalidatePath(`/events/${slug}`);
  revalidatePath("/admin/events");
  revalidateAdminShell();
}

export function revalidateCommitteePublicPages(): void {
  revalidatePath("/committee");
  revalidatePath("/admin/committee");
  revalidatePath("/admin/committee/past-presidents");
  revalidateAdminShell();
}

export function revalidateGalleryPages(): void {
  revalidatePath("/admin/gallery");
  revalidateAdminShell();
}
