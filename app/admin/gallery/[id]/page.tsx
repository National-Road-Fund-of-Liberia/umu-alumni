import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GalleryForm } from "@/features/gallery/components/gallery-form";
import { GalleryService } from "@/services/gallery.service";

interface EditGalleryItemPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Photo",
};

export default async function EditGalleryItemPage({ params }: EditGalleryItemPageProps) {
  const { id } = await params;

  let item;
  try {
    item = await GalleryService.getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Edit Photo</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update this photo&apos;s caption or album.</p>
      </div>
      <GalleryForm item={item} />
    </div>
  );
}
