import { randomUUID } from "node:crypto";

import type { GalleryItem } from "@/types/gallery";
import { generateCoverPlaceholder } from "./placeholder-image";

const ALBUMS: Array<{ album: string; captions: string[]; daysAgo: number }> = [
  {
    album: "Homecoming 2025",
    daysAgo: 320,
    captions: [
      "Alumni gather on the main quad ahead of the Saturday banquet.",
      "The Class of 1994 poses for a group photo outside the Alumni Center.",
      "The university president delivers opening remarks at the banquet.",
      "Chapter representatives present regional updates to the Executive Committee.",
      "Evening reception on the terrace of the Alumni Center.",
    ],
  },
  {
    album: "Class of 2010 — 15 Year Reunion",
    daysAgo: 18,
    captions: [
      "Graduates tour the newly renovated Business Building.",
      "A panel of Class of 2010 alumni shares career reflections with current students.",
      "The class gathers for a formal photo on the library steps.",
      "Guests mingle during the Saturday evening gala dinner.",
    ],
  },
  {
    album: "Career Development Workshop",
    daysAgo: 60,
    captions: [
      "Alumni HR professionals lead a resume-writing session.",
      "Students practice mock interviews with alumni volunteers.",
      "A packed room for the salary negotiation segment.",
    ],
  },
  {
    album: "Campus Life",
    daysAgo: 200,
    captions: [
      "The UMU Main Campus administration building at sunrise.",
      "Students cross the quad between classes.",
      "The university library reading room ahead of renovation.",
      "The Business Building lecture hall.",
      "Graduation day on the main lawn.",
      "The Alumni Center entrance.",
    ],
  },
];

export function generateGallery(): GalleryItem[] {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const items: GalleryItem[] = [];

  for (const { album, captions, daysAgo } of ALBUMS) {
    captions.forEach((caption, index) => {
      const uploadedAt = new Date(now - (daysAgo + index) * dayMs).toISOString();
      items.push({
        id: randomUUID(),
        imageUrl: generateCoverPlaceholder(`${album}-${index}`, album),
        caption,
        album,
        uploadedAt,
      });
    });
  }

  return items;
}
