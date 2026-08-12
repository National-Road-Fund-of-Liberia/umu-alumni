import type { MetadataRoute } from "next";

import { AlumniService } from "@/services/alumni.service";
import { EventService } from "@/services/event.service";
import { NewsService } from "@/services/news.service";

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/committee`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/news`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/events`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/directory`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const [alumni, news, events] = await Promise.all([
      AlumniService.listPublic(),
      NewsService.listPublished(),
      EventService.listAll(),
    ]);

    const alumniEntries: MetadataRoute.Sitemap = alumni.map((person) => ({
      url: `${base}/directory/${person.id}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

    const newsEntries: MetadataRoute.Sitemap = news.map((article) => ({
      url: `${base}/news/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
      url: `${base}/events/${event.slug}`,
      lastModified: new Date(event.updatedAt),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticEntries, ...alumniEntries, ...newsEntries, ...eventEntries];
  } catch {
    // Sitemap should still serve static routes if Firestore is unavailable.
    return staticEntries;
  }
}
