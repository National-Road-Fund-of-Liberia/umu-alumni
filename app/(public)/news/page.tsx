import { Newspaper } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { CardGridSkeleton } from "@/components/common/skeletons";
import { EmptyState } from "@/components/common/empty-state";
import { FilterPill } from "@/components/common/filter-pill";
import { PageHeader } from "@/components/common/page-header";
import { NewsCard } from "@/features/news/components/news-card";
import { NewsService } from "@/services/news.service";
import { NEWS_CATEGORIES } from "@/types/news";

export const metadata: Metadata = {
  title: "News",
  description: "Announcements, alumni achievements, and updates from the UMU Alumni Association.",
};

interface NewsPageProps {
  searchParams: Promise<{ category?: string }>;
}

async function NewsGrid({ category }: { category?: string }) {
  const articles = await NewsService.listPublished();
  const filtered = category ? articles.filter((article) => article.category === category) : articles;

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={Newspaper}
        title="No articles in this category"
        description="Try a different category or check back later."
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { category } = await searchParams;

  return (
    <>
      <PageHeader
        title="News & Announcements"
        description="The latest from the Executive Committee, regional chapters, and the alumni community at large."
      />
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            <FilterPill href="/news" label="All" active={!category} />
            {NEWS_CATEGORIES.map((cat) => (
              <FilterPill key={cat} href={`/news?category=${encodeURIComponent(cat)}`} label={cat} active={category === cat} />
            ))}
          </div>

          <div className="mt-8">
            <Suspense fallback={<CardGridSkeleton count={6} />}>
              <NewsGrid category={category} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
