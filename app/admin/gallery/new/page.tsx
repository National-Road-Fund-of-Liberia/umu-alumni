import type { Metadata } from "next";

import { GalleryForm } from "@/features/gallery/components/gallery-form";

export const metadata: Metadata = {
  title: "Add Photo",
};

export default function NewGalleryItemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Add Photo</h1>
        <p className="mt-1 text-sm text-muted-foreground">Upload a new photo to the gallery.</p>
      </div>
      <GalleryForm />
    </div>
  );
}
