import { randomUUID } from "node:crypto";

import { auditLogRepository } from "@/repositories/audit-log.repository";
import type { AuditAction, AuditLogEntry } from "@/types/audit-log";

export interface RecordAuditEventInput {
  actorUsername: string;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  description: string;
}

export const AuditService = {
  /** Every mutating call in every other Service should route through here. */
  async record(input: RecordAuditEventInput): Promise<AuditLogEntry> {
    return auditLogRepository.create({
      id: randomUUID(),
      actorUsername: input.actorUsername,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      description: input.description,
      createdAt: new Date().toISOString(),
    });
  },

  async list(): Promise<AuditLogEntry[]> {
    const entries = await auditLogRepository.findAll();
    return [...entries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
};
