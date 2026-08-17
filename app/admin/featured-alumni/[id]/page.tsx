import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FeaturedAlumniForm } from "@/features/featured-alumni/components/featured-alumni-form";
import { FeaturedAlumniService } from "@/services/featured-alumni.service";

interface EditFeaturedAlumniPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Featured Alumni",
};

export default async function EditFeaturedAlumniPage({ params }: EditFeaturedAlumniPageProps) {
  const { id } = await params;

  let member;
  try {
    member = await FeaturedAlumniService.getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">{member.fullName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update this featured alumni profile.</p>
      </div>
      <FeaturedAlumniForm member={member} />
    </div>
  );
}
