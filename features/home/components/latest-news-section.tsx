import { Newspaper } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { SectionHeading } from "@/components/common/section-heading";
import { NewsCard } from "@/features/news/components/news-card";
import type { NewsArticle } from "@/types/news";

export function LatestNewsSection({ articles }: { articles: NewsArticle[] }) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          title="From the Alumni Association"
          description="Announcements, member achievements, and updates from chapters across the country."
          viewAllHref="/news"
        />
        <div className="mt-8">
          {articles.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <EmptyState icon={Newspaper} title="No news yet" description="Check back soon for updates." />
          )}
        </div>
      </div>
    </section>
  );
}
