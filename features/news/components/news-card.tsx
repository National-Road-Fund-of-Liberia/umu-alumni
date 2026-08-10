import Link from "next/link";

import { DataUriImage } from "@/components/common/data-uri-image";
import { formatDate } from "@/lib/utils";
import type { NewsArticle } from "@/types/news";

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="aspect-16/9 w-full overflow-hidden bg-muted">
        <DataUriImage
          src={article.coverImageUrl}
          alt=""
          className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{article.category}</p>
        <h3 className="font-heading text-lg font-semibold leading-snug text-foreground">{article.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        <p className="mt-auto pt-2 text-xs text-muted-foreground">
          {article.publishedAt ? formatDate(article.publishedAt) : "Draft"}
        </p>
      </div>
    </Link>
  );
}
