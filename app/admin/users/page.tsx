import { Settings } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DataUriImage } from "@/components/common/data-uri-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, timeAgo } from "@/lib/utils";
import { UserService } from "@/services/user.service";

export const metadata: Metadata = {
  title: "Users",
};

export default async function AdminUsersPage() {
  const users = await UserService.list();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administrator accounts with access to this dashboard. Version 1 supports a single Administrator role —
          additional accounts and role-based permissions are a planned future enhancement.
        </p>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Sign-in</TableHead>
              <TableHead>Member Since</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <DataUriImage src={user.avatarUrl} alt="" className="size-8 shrink-0 rounded-full" />
                    <div>
                      <p className="font-medium text-foreground">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge>{user.role}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.lastLoginAt ? timeAgo(user.lastLoginAt) : "Never"}
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/admin/settings">
                      <Settings className="size-3.5" aria-hidden="true" />
                      Manage
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
