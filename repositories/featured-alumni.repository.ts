import type { FeaturedAlumni } from "@/types/featured-alumni";
import { BaseRepository } from "./base-repository";

class FeaturedAlumniRepository extends BaseRepository<FeaturedAlumni> {
  constructor() {
    super("featured-alumni");
  }
}

export const featuredAlumniRepository = new FeaturedAlumniRepository();
