import { ArrowLeft, Briefcase, GraduationCap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DataUriImage } from "@/components/common/data-uri-image";
import { AlumniService } from "@/services/alumni.service";

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
          <div className="aspect-square w-32 shrink-0 overflow-hidden rounded-lg border border-border bg-muted sm:w-40">
            <DataUriImage src={alumni.photoUrl} alt={`Portrait of ${fullName}`} className="h-full w-full" />
          </div>

          <div className="min-w-0">
            <h1 className="text-balance font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {fullName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {alumni.degree} in {alumni.program} · Class of {alumni.graduationYear}
            </p>

            <dl className="mt-5 space-y-3">
              <div className="flex items-start gap-2.5 text-sm">
                <Briefcase className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Occupation</dt>
                  <dd className="text-foreground">
                    {alumni.occupation} at {alumni.organization}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-sm">
                <GraduationCap className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Education</dt>
                  <dd className="text-foreground">
                    {alumni.degree}, {alumni.program} ({alumni.graduationYear})
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <h2 className="font-heading text-base font-semibold text-foreground">Biography</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{alumni.biography}</p>
        </div>
      </div>
    </div>
  );
}
