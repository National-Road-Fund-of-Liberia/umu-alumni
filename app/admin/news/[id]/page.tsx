import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsForm } from "@/features/news/components/news-form";
import { NewsService } from "@/services/news.service";

interface EditNewsPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Article",
};

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = await params;

  let article;
  try {
    article = await NewsService.getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">{article.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update this article.</p>
      </div>
      <NewsForm article={article} />
    </div>
  );
}
