import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AlumniForm } from "@/features/alumni/components/alumni-form";
import { AlumniService } from "@/services/alumni.service";

interface EditAlumniPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Alumni",
};

export default async function EditAlumniPage({ params }: EditAlumniPageProps) {
  const { id } = await params;

  let alumni;
  try {
    alumni = await AlumniService.getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          {alumni.firstName} {alumni.lastName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Update this alumni record.</p>
      </div>
      <AlumniForm alumni={alumni} />
    </div>
  );
}
