import { randomUUID } from "node:crypto";

import { alumniRepository } from "@/repositories/alumni.repository";
import { alumniSchema } from "@/schemas/alumni";
import type { Alumni, PublicAlumni } from "@/types/alumni";
import { NotFoundError } from "@/lib/errors";
import { deleteStoredImagesForRecord, resolveNullableImageField } from "@/lib/firebase/storage";
import { revalidateAlumniPublicPages } from "@/lib/public-cache";
import { AuditService } from "./audit.service";

/** Explicit allow-list (not a `delete`) so PublicAlumni's excess-property
 * check fails at compile time if a private field is ever added here. */
export function toPublicAlumni(alumni: Alumni): PublicAlumni {
  return {
    id: alumni.id,
    firstName: alumni.firstName,
    lastName: alumni.lastName,
    photoUrl: alumni.photoUrl,
    degree: alumni.degree,
    program: alumni.program,
    graduationYear: alumni.graduationYear,
    occupation: alumni.occupation,
    organization: alumni.organization,
    biography: alumni.biography,
    createdAt: alumni.createdAt,
    updatedAt: alumni.updatedAt,
  };
}

export const AlumniService = {
  /** Admin-only: every field, including private ones. */
  async listAll(): Promise<Alumni[]> {
    return alumniRepository.findAll();
  },

  /** Safe for public routes: private fields are stripped before this ever leaves the service. */
  async listPublic(): Promise<PublicAlumni[]> {
    const records = await alumniRepository.findAll();
    return records.map(toPublicAlumni);
  },

  async getById(id: string): Promise<Alumni> {
    const record = await alumniRepository.findById(id);
    if (!record) throw new NotFoundError("Alumni record not found.");
    return record;
  },

  async getPublicById(id: string): Promise<PublicAlumni> {
    return toPublicAlumni(await this.getById(id));
  },

  async create(input: unknown, actorUsername: string): Promise<Alumni> {
    const data = alumniSchema.parse(input);
    const id = randomUUID();
    const photoUrl = await resolveNullableImageField(data.photoUrl, `alumni/${id}/photo`);
    const now = new Date().toISOString();
    const record: Alumni = { id, ...data, photoUrl, createdAt: now, updatedAt: now };

    await alumniRepository.create(record);
    await AuditService.record({
      actorUsername,
      action: "create",
      entityType: "alumni",
      entityId: record.id,
      description: `Added alumni record for ${record.firstName} ${record.lastName}`,
    });
    revalidateAlumniPublicPages(record.id);

    return record;
  },

  async update(id: string, input: unknown, actorUsername: string): Promise<Alumni> {
    const existing = await this.getById(id);
    const data = alumniSchema.partial().parse(input);
    const photoUrl =
      data.photoUrl !== undefined ? await resolveNullableImageField(data.photoUrl, `alumni/${id}/photo`) : undefined;
    const updated = await alumniRepository.update(id, {
      ...data,
      ...(photoUrl !== undefined ? { photoUrl } : {}),
      updatedAt: new Date().toISOString(),
    });
    if (!updated) throw new NotFoundError("Alumni record not found.");

    await AuditService.record({
      actorUsername,
      action: "update",
      entityType: "alumni",
      entityId: id,
      description: `Updated alumni record for ${existing.firstName} ${existing.lastName}`,
    });
    revalidateAlumniPublicPages(id);

    return updated;
  },

  async delete(id: string, actorUsername: string): Promise<void> {
    const existing = await this.getById(id);
    const deleted = await alumniRepository.delete(id);
    if (!deleted) throw new NotFoundError("Alumni record not found.");
    await deleteStoredImagesForRecord(`alumni/${id}/`);

    await AuditService.record({
      actorUsername,
      action: "delete",
      entityType: "alumni",
      entityId: id,
      description: `Removed alumni record for ${existing.firstName} ${existing.lastName}`,
    });
    revalidateAlumniPublicPages(id);
  },
};
