import type { NewsArticle } from "@/types/news";
import { BaseRepository } from "./base-repository";

class NewsRepository extends BaseRepository<NewsArticle> {
  constructor() {
    super("news");
  }

  async findBySlug(slug: string): Promise<NewsArticle | null> {
    const records = await this.findAll();
    return records.find((record) => record.slug === slug) ?? null;
  }
}

export const newsRepository = new NewsRepository();
