import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { DataUriImage } from "@/components/common/data-uri-image";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { NewsService } from "@/services/news.service";

// Safety net so this self-heals if an admin mutation's on-demand
// revalidation (lib/public-cache.ts) ever misses this deployment.
export const revalidate = 30;

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await NewsService.getPublishedBySlug(slug);
    return { title: article.title, description: article.excerpt };
  } catch {
    return { title: "Article not found" };
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;

  let article;
  try {
    article = await NewsService.getPublishedBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <article>
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to News
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <Badge variant="outline">{article.category}</Badge>
            <span className="text-sm text-muted-foreground">
              {article.publishedAt ? formatDate(article.publishedAt) : "Draft"}
            </span>
          </div>
          <h1 className="mt-3 text-balance font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">By {article.author}</p>
        </div>
      </div>

      {article.coverImageUrl && (
        <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="aspect-16/9 overflow-hidden rounded-lg bg-muted">
            <DataUriImage src={article.coverImageUrl} alt="" className="h-full w-full" />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-5 text-base leading-relaxed text-foreground">
          {article.content.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
