import { createResourceClient } from "@/lib/resource-client";
import type { NewsFormValues } from "@/schemas/news";
import type { NewsArticle } from "@/types/news";

export const newsApi = createResourceClient<NewsArticle, NewsFormValues>("/api/admin/news");
