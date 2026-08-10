import { KeyRound } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/features/settings/components/profile-form";
import { getSession } from "@/lib/auth/get-session";
import { UserService } from "@/services/user.service";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await UserService.getByUsername(session.username);
  if (!user) redirect("/login");

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile and account details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>This information is shown in the admin header and activity log.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Sign-in credentials for this account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Username</p>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
            <Badge variant="secondary">{user.role}</Badge>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            <KeyRound className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>
              Username and password are managed through server environment variables (
              <code className="rounded bg-muted px-1 py-0.5 text-xs">ADMIN_USERNAME</code> /{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">ADMIN_PASSWORD</code>), not through this
              dashboard. Contact whoever manages the deployment to rotate credentials.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
