import type { Metadata } from "next";

import { GalleryAdminGrid } from "@/features/gallery/components/gallery-admin-grid";
import { GalleryService } from "@/services/gallery.service";

export const metadata: Metadata = {
  title: "Gallery",
};

export default async function AdminGalleryPage() {
  const items = await GalleryService.listAll();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Gallery</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage photos shown across the public site.</p>
      </div>
      <GalleryAdminGrid items={items} />
    </div>
  );
}
