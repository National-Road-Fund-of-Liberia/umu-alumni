import { createResourceClient } from "@/lib/resource-client";
import type { GalleryItemFormValues } from "@/schemas/gallery";
import type { GalleryItem } from "@/types/gallery";

export const galleryApi = createResourceClient<GalleryItem, GalleryItemFormValues>("/api/admin/gallery");
