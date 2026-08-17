import { createResourceClient } from "@/lib/resource-client";
import type { FeaturedAlumniFormValues } from "@/schemas/featured-alumni";
import type { FeaturedAlumni } from "@/types/featured-alumni";

export const featuredAlumniApi = createResourceClient<FeaturedAlumni, FeaturedAlumniFormValues>(
  "/api/admin/featured-alumni"
);
