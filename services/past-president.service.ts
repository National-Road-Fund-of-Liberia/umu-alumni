import { randomUUID } from "node:crypto";

import { pastPresidentRepository } from "@/repositories/past-president.repository";
import { pastPresidentSchema } from "@/schemas/past-president";
import type { PastPresident } from "@/types/past-president";
import { NotFoundError } from "@/lib/errors";
import { deleteStoredImagesForRecord, resolveNullableImageField } from "@/lib/firebase/storage";
import { revalidateCommitteePublicPages } from "@/lib/public-cache";
import { AuditService } from "./audit.service";

export const PastPresidentService = {
  async listAll(): Promise<PastPresident[]> {
    const records = await pastPresidentRepository.findAll();
    return [...records].sort((a, b) => b.year - a.year || a.displayOrder - b.displayOrder);
  },

  async getById(id: string): Promise<PastPresident> {
    const record = await pastPresidentRepository.findById(id);
    if (!record) throw new NotFoundError("Past president not found.");
    return record;
  },

  async create(input: unknown, actorUsername: string): Promise<PastPresident> {
    const data = pastPresidentSchema.parse(input);
    const id = randomUUID();
    const photoUrl = await resolveNullableImageField(data.photoUrl, `past-presidents/${id}/photo`);
    const now = new Date().toISOString();
    const record: PastPresident = { id, ...data, photoUrl, createdAt: now, updatedAt: now };

    await pastPresidentRepository.create(record);
    await AuditService.record({
      actorUsername,
      action: "create",
      entityType: "past-president",
      entityId: record.id,
      description: `Added ${record.fullName} as a Past President (${record.year})`,
    });
    revalidateCommitteePublicPages();

    return record;
  },

  async update(id: string, input: unknown, actorUsername: string): Promise<PastPresident> {
    const existing = await this.getById(id);
    const data = pastPresidentSchema.partial().parse(input);
    const photoUrl =
      data.photoUrl !== undefined
        ? await resolveNullableImageField(data.photoUrl, `past-presidents/${id}/photo`)
        : undefined;
    const updated = await pastPresidentRepository.update(id, {
      ...data,
      ...(photoUrl !== undefined ? { photoUrl } : {}),
      updatedAt: new Date().toISOString(),
    });
    if (!updated) throw new NotFoundError("Past president not found.");

    await AuditService.record({
      actorUsername,
      action: "update",
      entityType: "past-president",
      entityId: id,
      description: `Updated past president record for ${existing.fullName}`,
    });
    revalidateCommitteePublicPages();

    return updated;
  },

  async delete(id: string, actorUsername: string): Promise<void> {
    const existing = await this.getById(id);
    const deleted = await pastPresidentRepository.delete(id);
    if (!deleted) throw new NotFoundError("Past president not found.");
    await deleteStoredImagesForRecord(`past-presidents/${id}/`);

    await AuditService.record({
      actorUsername,
      action: "delete",
      entityType: "past-president",
      entityId: id,
      description: `Removed past president record for ${existing.fullName}`,
    });
    revalidateCommitteePublicPages();
  },
};
