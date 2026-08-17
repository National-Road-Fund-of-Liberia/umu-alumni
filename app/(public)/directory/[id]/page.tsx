import { ArrowLeft, Briefcase } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DataUriImage } from "@/components/common/data-uri-image";
import { AlumniService } from "@/services/alumni.service";

// Safety net so this self-heals if an admin mutation's on-demand
// revalidation (lib/public-cache.ts) ever misses this deployment.
export const revalidate = 30;

interface AlumniProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AlumniProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const alumni = await AlumniService.getPublicById(id);
    return { title: `${alumni.firstName} ${alumni.lastName}` };
  } catch {
    return { title: "Alumni profile not found" };
  }
}

export default async function AlumniProfilePage({ params }: AlumniProfilePageProps) {
  const { id } = await params;

  let alumni;
  try {
    alumni = await AlumniService.getPublicById(id);
  } catch {
    notFound();
  }

  const fullName = `${alumni.firstName} ${alumni.lastName}`;

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/directory"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to Directory
        </Link>

        <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row">
          {alumni.photoUrl && (
            <div className="aspect-square w-32 shrink-0 overflow-hidden rounded-lg border border-border bg-muted sm:w-40">
              <DataUriImage src={alumni.photoUrl} alt={`Portrait of ${fullName}`} className="h-full w-full" />
            </div>
          )}

          <div className="min-w-0">
            <h1 className="text-balance font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {fullName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {alumni.program} · Class of {alumni.graduationYear}
            </p>

            <div className="mt-5 flex items-start gap-2.5 text-sm">
              <Briefcase className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="text-foreground">
                {alumni.occupation} at {alumni.organization}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
