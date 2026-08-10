import { randomUUID } from "node:crypto";

import { newsRepository } from "@/repositories/news.repository";
import { newsSchema } from "@/schemas/news";
import type { NewsArticle } from "@/types/news";
import { NotFoundError } from "@/lib/errors";
import { deleteStoredImagesForRecord, resolveNullableImageField } from "@/lib/firebase/storage";
import { revalidateNewsPublicPages } from "@/lib/public-cache";
import { slugify } from "@/lib/utils";
import { AuditService } from "./audit.service";

async function uniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title);
  const existing = await newsRepository.findAll();
  let candidate = base;
  let suffix = 2;
  while (existing.some((item) => item.slug === candidate && item.id !== excludeId)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export const NewsService = {
  async listAll(): Promise<NewsArticle[]> {
    const records = await newsRepository.findAll();
    return [...records].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async listPublished(): Promise<NewsArticle[]> {
    const records = await this.listAll();
    return records.filter((article) => article.status === "published");
  },

  async getById(id: string): Promise<NewsArticle> {
    const record = await newsRepository.findById(id);
    if (!record) throw new NotFoundError("News article not found.");
    return record;
  },

  async getPublishedBySlug(slug: string): Promise<NewsArticle> {
    const record = await newsRepository.findBySlug(slug);
    if (!record || record.status !== "published") {
      throw new NotFoundError("News article not found.");
    }
    return record;
  },

  async create(input: unknown, actorUsername: string): Promise<NewsArticle> {
    const data = newsSchema.parse(input);
    const id = randomUUID();
    const coverImageUrl = await resolveNullableImageField(data.coverImageUrl, `news/${id}/cover`);
    const now = new Date().toISOString();
    const record: NewsArticle = {
      id,
      ...data,
      coverImageUrl,
      slug: await uniqueSlug(data.title),
      createdAt: now,
      updatedAt: now,
    };

    await newsRepository.create(record);
    await AuditService.record({
      actorUsername,
      action: "create",
      entityType: "news",
      entityId: record.id,
      description: `Created news article "${record.title}"`,
    });
    revalidateNewsPublicPages(record.slug);

    return record;
  },

  async update(id: string, input: unknown, actorUsername: string): Promise<NewsArticle> {
    const existing = await this.getById(id);
    const data = newsSchema.partial().parse(input);
    const coverImageUrl =
      data.coverImageUrl !== undefined ? await resolveNullableImageField(data.coverImageUrl, `news/${id}/cover`) : undefined;
    const updated = await newsRepository.update(id, {
      ...data,
      ...(coverImageUrl !== undefined ? { coverImageUrl } : {}),
      updatedAt: new Date().toISOString(),
    });
    if (!updated) throw new NotFoundError("News article not found.");

    await AuditService.record({
      actorUsername,
      action: "update",
      entityType: "news",
      entityId: id,
      description: `Updated news article "${existing.title}"`,
    });
    revalidateNewsPublicPages(updated.slug);

    return updated;
  },

  async delete(id: string, actorUsername: string): Promise<void> {
    const existing = await this.getById(id);
    const deleted = await newsRepository.delete(id);
    if (!deleted) throw new NotFoundError("News article not found.");
    await deleteStoredImagesForRecord(`news/${id}/`);

    await AuditService.record({
      actorUsername,
      action: "delete",
      entityType: "news",
      entityId: id,
      description: `Deleted news article "${existing.title}"`,
    });
    revalidateNewsPublicPages(existing.slug);
  },
};
