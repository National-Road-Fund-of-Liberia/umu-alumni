export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  album: string;
  uploadedAt: string;
}

export type CreateGalleryItemInput = Omit<GalleryItem, "id" | "uploadedAt">;
export type UpdateGalleryItemInput = Partial<CreateGalleryItemInput>;
