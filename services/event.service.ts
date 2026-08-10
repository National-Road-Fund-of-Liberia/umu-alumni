import { randomUUID } from "node:crypto";

import { eventRepository } from "@/repositories/event.repository";
import { eventSchema, eventUpdateSchema } from "@/schemas/event";
import type { AlumniEvent } from "@/types/event";
import { NotFoundError } from "@/lib/errors";
import { deleteStoredImageByUrl, deleteStoredImagesForRecord, resolveNullableImageField } from "@/lib/firebase/storage";
import { revalidateEventPublicPages } from "@/lib/public-cache";
import { slugify } from "@/lib/utils";
import { AuditService } from "./audit.service";

async function uniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title);
  const existing = await eventRepository.findAll();
  let candidate = base;
  let suffix = 2;
  while (existing.some((item) => item.slug === candidate && item.id !== excludeId)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

function deriveStatus(startDate: string, explicit: AlumniEvent["status"]): AlumniEvent["status"] {
  if (explicit === "cancelled") return "cancelled";
  return new Date(startDate).getTime() < Date.now() ? "past" : "upcoming";
}

export const EventService = {
  async listAll(): Promise<AlumniEvent[]> {
    const records = await eventRepository.findAll();
    return [...records].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  },

  async listUpcoming(): Promise<AlumniEvent[]> {
    const records = await this.listAll();
    return records.filter((event) => event.status === "upcoming");
  },

  async getById(id: string): Promise<AlumniEvent> {
    const record = await eventRepository.findById(id);
    if (!record) throw new NotFoundError("Event not found.");
    return record;
  },

  async getBySlug(slug: string): Promise<AlumniEvent> {
    const record = await eventRepository.findBySlug(slug);
    if (!record) throw new NotFoundError("Event not found.");
    return record;
  },

  async create(input: unknown, actorUsername: string): Promise<AlumniEvent> {
    const data = eventSchema.parse(input);
    const id = randomUUID();
    const coverImageUrl = await resolveNullableImageField(data.coverImageUrl, `events/${id}/cover`);
    const now = new Date().toISOString();
    const record: AlumniEvent = {
      id,
      ...data,
      coverImageUrl,
      status: deriveStatus(data.startDate, data.status),
      slug: await uniqueSlug(data.title),
      createdAt: now,
      updatedAt: now,
    };

    await eventRepository.create(record);
    await AuditService.record({
      actorUsername,
      action: "create",
      entityType: "event",
      entityId: record.id,
      description: `Created event "${record.title}"`,
    });
    revalidateEventPublicPages(record.slug);

    return record;
  },

  async update(id: string, input: unknown, actorUsername: string): Promise<AlumniEvent> {
    const existing = await this.getById(id);
    const data = eventUpdateSchema.parse(input);
    const startDate = data.startDate ?? existing.startDate;
    const status = data.status ? deriveStatus(startDate, data.status) : deriveStatus(startDate, existing.status);
    const coverImageUrl =
      data.coverImageUrl !== undefined ? await resolveNullableImageField(data.coverImageUrl, `events/${id}/cover`) : undefined;

    const updated = await eventRepository.update(id, {
      ...data,
      ...(coverImageUrl !== undefined ? { coverImageUrl } : {}),
      status,
      updatedAt: new Date().toISOString(),
    });
    if (!updated) throw new NotFoundError("Event not found.");

    await AuditService.record({
      actorUsername,
      action: "update",
      entityType: "event",
      entityId: id,
      description: `Updated event "${existing.title}"`,
    });
    revalidateEventPublicPages(updated.slug);

    return updated;
  },

  async delete(id: string, actorUsername: string): Promise<void> {
    const existing = await this.getById(id);
    const deleted = await eventRepository.delete(id);
    if (!deleted) throw new NotFoundError("Event not found.");

    await AuditService.record({
      actorUsername,
      action: "delete",
      entityType: "event",
      entityId: id,
      description: `Deleted event "${existing.title}"`,
    });
    revalidateEventPublicPages(existing.slug);

    // Firestore delete already committed — clean Storage in the background so
    // a slow/failed bucket call can't block or fail the admin delete UX.
    void Promise.allSettled([
      existing.coverImageUrl ? deleteStoredImageByUrl(existing.coverImageUrl) : Promise.resolve(),
      deleteStoredImagesForRecord(`events/${id}/`),
    ]);
  },
};
