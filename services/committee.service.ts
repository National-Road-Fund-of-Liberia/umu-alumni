import { randomUUID } from "node:crypto";

import { committeeRepository } from "@/repositories/committee.repository";
import { committeeMemberSchema } from "@/schemas/committee";
import type { CommitteeMember } from "@/types/committee";
import { NotFoundError } from "@/lib/errors";
import { deleteStoredImageByUrl, deleteStoredImagesForRecord, resolveNullableImageField } from "@/lib/firebase/storage";
import { revalidateCommitteePublicPages } from "@/lib/public-cache";
import { AuditService } from "./audit.service";

export const CommitteeService = {
  async listAll(): Promise<CommitteeMember[]> {
    const records = await committeeRepository.findAll();
    return [...records].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async getById(id: string): Promise<CommitteeMember> {
    const record = await committeeRepository.findById(id);
    if (!record) throw new NotFoundError("Committee member not found.");
    return record;
  },

  async create(input: unknown, actorUsername: string): Promise<CommitteeMember> {
    const data = committeeMemberSchema.parse(input);
    const id = randomUUID();
    const photoUrl = await resolveNullableImageField(data.photoUrl, `committee/${id}/photo`);
    const now = new Date().toISOString();
    const record: CommitteeMember = { id, ...data, photoUrl, createdAt: now, updatedAt: now };

    await committeeRepository.create(record);
    await AuditService.record({
      actorUsername,
      action: "create",
      entityType: "committee",
      entityId: record.id,
      description: `Added ${record.fullName} as ${record.title}`,
    });
    revalidateCommitteePublicPages();

    return record;
  },

  async update(id: string, input: unknown, actorUsername: string): Promise<CommitteeMember> {
    const existing = await this.getById(id);
    const data = committeeMemberSchema.partial().parse(input);
    const photoUrl =
      data.photoUrl !== undefined ? await resolveNullableImageField(data.photoUrl, `committee/${id}/photo`) : undefined;
    const updated = await committeeRepository.update(id, {
      ...data,
      ...(photoUrl !== undefined ? { photoUrl } : {}),
      updatedAt: new Date().toISOString(),
    });
    if (!updated) throw new NotFoundError("Committee member not found.");

    await AuditService.record({
      actorUsername,
      action: "update",
      entityType: "committee",
      entityId: id,
      description: `Updated committee profile for ${existing.fullName}`,
    });
    revalidateCommitteePublicPages();

    return updated;
  },

  async delete(id: string, actorUsername: string): Promise<void> {
    const existing = await this.getById(id);
    const deleted = await committeeRepository.delete(id);
    if (!deleted) throw new NotFoundError("Committee member not found.");

    await AuditService.record({
      actorUsername,
      action: "delete",
      entityType: "committee",
      entityId: id,
      description: `Removed ${existing.fullName} from the committee`,
    });
    revalidateCommitteePublicPages();

    void Promise.allSettled([
      existing.photoUrl ? deleteStoredImageByUrl(existing.photoUrl) : Promise.resolve(),
      deleteStoredImagesForRecord(`committee/${id}/`),
    ]);
  },
};
