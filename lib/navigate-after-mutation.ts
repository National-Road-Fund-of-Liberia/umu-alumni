/**
 * After a successful admin mutation, navigate to the list page and force a
 * fresh RSC fetch. Calling refresh() alone only clears the *current* route's
 * Client Cache; push-then-refresh without deferring can race and leave the
 * destination showing a prefetched payload from before the write.
 */
export function navigateAfterMutation(
  router: { push: (href: string) => void; refresh: () => void },
  href: string
): void {
  router.push(href);
  queueMicrotask(() => {
    router.refresh();
  });
}
