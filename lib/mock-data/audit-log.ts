import { randomUUID } from "node:crypto";

import type { AuditLogEntry } from "@/types/audit-log";

const ENTRIES: Array<Pick<AuditLogEntry, "action" | "entityType" | "description"> & { daysAgo: number }> = [
  { action: "login", entityType: "session", description: "Administrator signed in", daysAgo: 0 },
  { action: "create", entityType: "news", description: "Published \"UMU Alumni Association Launches 2026 Scholarship Fund\"", daysAgo: 6 },
  { action: "update", entityType: "event", description: "Updated location for \"Homecoming 2026\"", daysAgo: 7 },
  { action: "create", entityType: "alumni", description: "Added alumni record for a Class of 2024 graduate", daysAgo: 9 },
  { action: "login", entityType: "session", description: "Administrator signed in", daysAgo: 9 },
  { action: "update", entityType: "committee", description: "Updated bio for Miatta Roseline Karnley (Public Relations Officer)", daysAgo: 12 },
  { action: "create", entityType: "event", description: "Created \"Career Development Workshop: Resume & Interview Skills\"", daysAgo: 14 },
  { action: "delete", entityType: "gallery", description: "Removed a duplicate photo from the \"Campus Life\" album", daysAgo: 15 },
  { action: "update", entityType: "alumni", description: "Corrected graduation year for an alumni record", daysAgo: 18 },
  { action: "login", entityType: "session", description: "Administrator signed in", daysAgo: 18 },
  { action: "create", entityType: "news", description: "Published \"Class of 2010 Marks 15-Year Reunion in Monrovia\"", daysAgo: 18 },
  { action: "update", entityType: "news", description: "Edited excerpt for \"Alumna Dr. Grace Sirleaf Appointed Deputy Minister of Health\"", daysAgo: 32 },
  { action: "create", entityType: "gallery", description: "Uploaded 4 photos to the \"Class of 2010 — 15 Year Reunion\" album", daysAgo: 18 },
  { action: "update", entityType: "settings", description: "Updated association contact email", daysAgo: 40 },
  { action: "login", entityType: "session", description: "Administrator signed in", daysAgo: 45 },
  { action: "create", entityType: "committee", description: "Added Rev. Augustine Wesseh as Chaplain", daysAgo: 90 },
  { action: "create", entityType: "event", description: "Created \"Homecoming 2025\"", daysAgo: 340 },
];

export function generateAuditLog(): AuditLogEntry[] {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const username = process.env.ADMIN_USERNAME || "admin";

  return ENTRIES.map((entry) => ({
    id: randomUUID(),
    actorUsername: username,
    action: entry.action,
    entityType: entry.entityType,
    entityId: null,
    description: entry.description,
    createdAt: new Date(now - entry.daysAgo * dayMs).toISOString(),
  })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
