import type { Metadata } from "next";

import { FeaturedAlumniForm } from "@/features/featured-alumni/components/featured-alumni-form";

export const metadata: Metadata = {
  title: "Add Featured Alumni",
};

export default function NewFeaturedAlumniPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Add Featured Alumni</h1>
        <p className="mt-1 text-sm text-muted-foreground">Spotlight a graduate on the homepage.</p>
      </div>
      <FeaturedAlumniForm />
    </div>
  );
}
