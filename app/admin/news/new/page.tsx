import type { Metadata } from "next";

import { NewsForm } from "@/features/news/components/news-form";

export const metadata: Metadata = {
  title: "Add Article",
};

export default function NewNewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Add Article</h1>
        <p className="mt-1 text-sm text-muted-foreground">Publish a new article to the newsroom.</p>
      </div>
      <NewsForm />
    </div>
  );
}
