import type { Metadata } from "next";

import { FeaturedAlumniAdminGrid } from "@/features/featured-alumni/components/featured-alumni-admin-grid";
import { FeaturedAlumniService } from "@/services/featured-alumni.service";

export const metadata: Metadata = {
  title: "Featured Alumni",
};

export default async function AdminFeaturedAlumniPage() {
  const members = await FeaturedAlumniService.listAll();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Featured Alumni</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the graduate spotlights shown in &ldquo;Graduates making an impact&rdquo; on the homepage.
        </p>
      </div>
      <FeaturedAlumniAdminGrid members={members} />
    </div>
  );
}
