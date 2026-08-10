import type { Metadata } from "next";

import { NewsAdminTable } from "@/features/news/components/news-admin-table";
import { NewsService } from "@/services/news.service";

export const metadata: Metadata = {
  title: "News",
};

export default async function AdminNewsPage() {
  const articles = await NewsService.listAll();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">News</h1>
        <p className="mt-1 text-sm text-muted-foreground">Publish announcements and updates to the public newsroom.</p>
      </div>
      <NewsAdminTable articles={articles} />
    </div>
  );
}
