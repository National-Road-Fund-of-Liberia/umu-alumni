export const AUDIT_ACTIONS = ["create", "update", "delete", "login", "logout"] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export interface AuditLogEntry {
  id: string;
  actorUsername: string;
  action: AuditAction;
  entityType: string;
  entityId: string | null;
  description: string;
  createdAt: string;
}

export type CreateAuditLogInput = Omit<AuditLogEntry, "id" | "createdAt">;
