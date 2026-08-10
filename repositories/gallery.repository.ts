import type { GalleryItem } from "@/types/gallery";
import { BaseRepository } from "./base-repository";

class GalleryRepository extends BaseRepository<GalleryItem> {
  constructor() {
    super("gallery");
  }
}

export const galleryRepository = new GalleryRepository();
