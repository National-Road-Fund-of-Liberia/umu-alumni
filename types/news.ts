export const NEWS_CATEGORIES = [
  "Announcement",
  "Alumni Spotlight",
  "Campus",
  "Achievement",
  "Partnership",
] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export const NEWS_STATUSES = ["draft", "published"] as const;
export type NewsStatus = (typeof NEWS_STATUSES)[number];

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  category: NewsCategory;
  status: NewsStatus;
  author: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateNewsInput = Omit<NewsArticle, "id" | "slug" | "createdAt" | "updatedAt">;
export type UpdateNewsInput = Partial<CreateNewsInput>;
