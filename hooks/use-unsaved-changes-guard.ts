"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useConfirm } from "@/components/common/confirm-dialog-provider";

/**
 * Covers both exit paths a dirty form can take: tab close/refresh (the
 * browser's native beforeunload prompt — App Router has no hook for
 * blocking that) and in-app navigation, where callers use the returned
 * `navigate` instead of `router.push` so a dirty form confirms first.
 */
export function useUnsavedChangesGuard(isDirty: boolean) {
  const router = useRouter();
  const confirm = useConfirm();

  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  async function navigate(href: string) {
    if (isDirty) {
      const confirmed = await confirm({
        title: "Discard unsaved changes?",
        description: "You have unsaved changes on this page. This action cannot be undone.",
        confirmLabel: "Discard changes",
        destructive: true,
      });
      if (!confirmed) return;
    }
    router.push(href);
  }

  return { navigate };
}
