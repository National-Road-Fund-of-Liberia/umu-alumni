import type { AuditLogEntry } from "@/types/audit-log";
import { BaseRepository } from "./base-repository";

class AuditLogRepository extends BaseRepository<AuditLogEntry> {
  constructor() {
    super("audit-log");
  }
}

export const auditLogRepository = new AuditLogRepository();
