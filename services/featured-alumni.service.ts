import { randomUUID } from "node:crypto";

import sanitizeHtml from "sanitize-html";

import { featuredAlumniRepository } from "@/repositories/featured-alumni.repository";
import { featuredAlumniSchema } from "@/schemas/featured-alumni";
import type { FeaturedAlumni } from "@/types/featured-alumni";
import { NotFoundError } from "@/lib/errors";
import { deleteStoredImageByUrl, deleteStoredImagesForRecord, resolveNullableImageField } from "@/lib/firebase/storage";
import { revalidateFeaturedAlumniPublicPages } from "@/lib/public-cache";
import { AuditService } from "./audit.service";

// Matches exactly what the Tiptap StarterKit editor (bold/italic/lists,
// heading disabled) can produce, so this is a strict allowlist rather than
// a generic HTML sanitizer.
function sanitizeBio(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "strong", "em", "ul", "ol", "li", "br"],
    allowedAttributes: {},
  });
}

export const FeaturedAlumniService = {
  async listAll(): Promise<FeaturedAlumni[]> {
    const records = await featuredAlumniRepository.findAll();
    return [...records].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async getById(id: string): Promise<FeaturedAlumni> {
    const record = await featuredAlumniRepository.findById(id);
    if (!record) throw new NotFoundError("Featured alumni record not found.");
    return record;
  },

  async create(input: unknown, actorUsername: string): Promise<FeaturedAlumni> {
    const data = featuredAlumniSchema.parse(input);
    const id = randomUUID();
    const photoUrl = await resolveNullableImageField(data.photoUrl, `featured-alumni/${id}/photo`);
    const now = new Date().toISOString();
    const record: FeaturedAlumni = {
      id,
      ...data,
      bio: sanitizeBio(data.bio),
      photoUrl,
      createdAt: now,
      updatedAt: now,
    };

    await featuredAlumniRepository.create(record);
    await AuditService.record({
      actorUsername,
      action: "create",
      entityType: "featured-alumni",
      entityId: record.id,
      description: `Added ${record.fullName} to Featured Alumni`,
    });
    revalidateFeaturedAlumniPublicPages(record.id);

    return record;
  },

  async update(id: string, input: unknown, actorUsername: string): Promise<FeaturedAlumni> {
    const existing = await this.getById(id);
    const data = featuredAlumniSchema.partial().parse(input);
    const photoUrl =
      data.photoUrl !== undefined
        ? await resolveNullableImageField(data.photoUrl, `featured-alumni/${id}/photo`)
        : undefined;
    const updated = await featuredAlumniRepository.update(id, {
      ...data,
      ...(data.bio !== undefined ? { bio: sanitizeBio(data.bio) } : {}),
      ...(photoUrl !== undefined ? { photoUrl } : {}),
      updatedAt: new Date().toISOString(),
    });
    if (!updated) throw new NotFoundError("Featured alumni record not found.");

    await AuditService.record({
      actorUsername,
      action: "update",
      entityType: "featured-alumni",
      entityId: id,
      description: `Updated featured alumni profile for ${existing.fullName}`,
    });
    revalidateFeaturedAlumniPublicPages(id);

    return updated;
  },

  async delete(id: string, actorUsername: string): Promise<void> {
    const existing = await this.getById(id);
    const deleted = await featuredAlumniRepository.delete(id);
    if (!deleted) throw new NotFoundError("Featured alumni record not found.");

    await AuditService.record({
      actorUsername,
      action: "delete",
      entityType: "featured-alumni",
      entityId: id,
      description: `Removed ${existing.fullName} from Featured Alumni`,
    });
    revalidateFeaturedAlumniPublicPages(id);

    void Promise.allSettled([
      existing.photoUrl ? deleteStoredImageByUrl(existing.photoUrl) : Promise.resolve(),
      deleteStoredImagesForRecord(`featured-alumni/${id}/`),
    ]);
  },
};
