import { randomUUID } from "node:crypto";

import type { Role } from "@/types/role";

export function generateRoles(): Role[] {
  return [
    {
      id: randomUUID(),
      name: "Administrator",
      description:
        "Full access to the admin dashboard. v1 of the system supports a single administrator role — additional roles with scoped permissions are a planned future enhancement.",
      isSystem: true,
      permissions: [
        "View and edit the Alumni Directory",
        "Create, edit, and delete news articles",
        "Create, edit, and delete events",
        "Manage the photo gallery",
        "Manage the Executive Committee roster",
        "View reports and analytics",
        "View the audit log",
        "Manage the administrator profile and settings",
      ],
    },
  ];
}
