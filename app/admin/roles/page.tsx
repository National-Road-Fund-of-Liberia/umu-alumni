import { Check, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { RoleService } from "@/services/role.service";

export const metadata: Metadata = {
  title: "Roles",
};

export default async function AdminRolesPage() {
  const roles = await RoleService.list();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Roles</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Version 1 supports a single system role. Custom, scoped roles are a planned future enhancement.
        </p>
      </div>

      <div className="space-y-4">
        {roles.map((role) => (
          <div key={role.id} className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                  <ShieldCheck className="size-4 text-muted-foreground" aria-hidden="true" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-base font-semibold text-foreground">{role.name}</h2>
                    {role.isSystem && <Badge variant="secondary">System</Badge>}
                  </div>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">{role.description}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-border pt-5">
              <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Permissions</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {role.permissions.map((permission) => (
                  <li key={permission} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
