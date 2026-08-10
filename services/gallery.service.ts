import { randomUUID } from "node:crypto";

import { galleryRepository } from "@/repositories/gallery.repository";
import { galleryItemSchema } from "@/schemas/gallery";
import type { GalleryItem } from "@/types/gallery";
import { NotFoundError } from "@/lib/errors";
import { deleteStoredImageByUrl, deleteStoredImagesForRecord, resolveImageField } from "@/lib/firebase/storage";
import { revalidateGalleryPages } from "@/lib/public-cache";
import { AuditService } from "./audit.service";

export const GalleryService = {
  async listAll(): Promise<GalleryItem[]> {
    const records = await galleryRepository.findAll();
    return [...records].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  },

  async getById(id: string): Promise<GalleryItem> {
    const record = await galleryRepository.findById(id);
    if (!record) throw new NotFoundError("Gallery item not found.");
    return record;
  },

  async create(input: unknown, actorUsername: string): Promise<GalleryItem> {
    const data = galleryItemSchema.parse(input);
    const id = randomUUID();
    const imageUrl = await resolveImageField(data.imageUrl, `gallery/${id}/image`);
    const record: GalleryItem = { id, ...data, imageUrl, uploadedAt: new Date().toISOString() };

    await galleryRepository.create(record);
    await AuditService.record({
      actorUsername,
      action: "create",
      entityType: "gallery",
      entityId: record.id,
      description: `Uploaded a photo to the "${record.album}" album`,
    });
    revalidateGalleryPages();

    return record;
  },

  async update(id: string, input: unknown, actorUsername: string): Promise<GalleryItem> {
    const existing = await this.getById(id);
    const data = galleryItemSchema.partial().parse(input);
    const imageUrl = data.imageUrl !== undefined ? await resolveImageField(data.imageUrl, `gallery/${id}/image`) : undefined;
    const updated = await galleryRepository.update(id, {
      ...data,
      ...(imageUrl !== undefined ? { imageUrl } : {}),
    });
    if (!updated) throw new NotFoundError("Gallery item not found.");

    await AuditService.record({
      actorUsername,
      action: "update",
      entityType: "gallery",
      entityId: id,
      description: `Updated a photo in the "${existing.album}" album`,
    });
    revalidateGalleryPages();

    return updated;
  },

  async delete(id: string, actorUsername: string): Promise<void> {
    const existing = await this.getById(id);
    const deleted = await galleryRepository.delete(id);
    if (!deleted) throw new NotFoundError("Gallery item not found.");

    await AuditService.record({
      actorUsername,
      action: "delete",
      entityType: "gallery",
      entityId: id,
      description: `Removed a photo from the "${existing.album}" album`,
    });
    revalidateGalleryPages();

    void Promise.allSettled([
      deleteStoredImageByUrl(existing.imageUrl),
      deleteStoredImagesForRecord(`gallery/${id}/`),
    ]);
  },
};
