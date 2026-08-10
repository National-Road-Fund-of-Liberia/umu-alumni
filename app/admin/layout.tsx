import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AdminCommandPalette } from "@/components/layout/admin-command-palette";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { ConfirmDialogProvider } from "@/components/common/confirm-dialog-provider";
import { getSession } from "@/lib/auth/get-session";
import { UserService } from "@/services/user.service";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Defense in depth: proxy.ts already guards /admin/*, but every server
  // entry point re-checks so a routing change elsewhere can't expose this —
  // a redirect here, not a thrown error, since this is a page boundary.
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const user = await UserService.getByUsername(session.username);

  return (
    <ConfirmDialogProvider>
      <div className="flex min-h-svh">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader
            displayName={user?.displayName ?? session.displayName}
            username={session.username}
            avatarUrl={user?.avatarUrl ?? null}
          />
          <main id="main-content" className="flex-1 bg-muted/20 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
        <AdminCommandPalette />
      </div>
    </ConfirmDialogProvider>
  );
}
