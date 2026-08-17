import { ArrowLeft, Briefcase, GraduationCap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DataUriImage } from "@/components/common/data-uri-image";
import { FeaturedAlumniService } from "@/services/featured-alumni.service";

interface FeaturedAlumniProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: FeaturedAlumniProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const member = await FeaturedAlumniService.getById(id);
    return { title: member.fullName };
  } catch {
    return { title: "Featured alumni not found" };
  }
}

export default async function FeaturedAlumniProfilePage({ params }: FeaturedAlumniProfilePageProps) {
  const { id } = await params;

  let member;
  try {
    member = await FeaturedAlumniService.getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to Home
        </Link>

        <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row">
          <div className="aspect-square w-32 shrink-0 overflow-hidden rounded-lg border border-border bg-muted sm:w-40">
            <DataUriImage src={member.photoUrl} alt={`Portrait of ${member.fullName}`} className="h-full w-full" />
          </div>

          <div className="min-w-0">
            <h1 className="text-balance font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {member.fullName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Class of {member.graduationYear}</p>

            <dl className="mt-5 space-y-3">
              <div className="flex items-start gap-2.5 text-sm">
                <Briefcase className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Role</dt>
                  <dd className="text-foreground">
                    {member.title} at {member.organization}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-sm">
                <GraduationCap className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Class</dt>
                  <dd className="text-foreground">Class of {member.graduationYear}</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <h2 className="font-heading text-base font-semibold text-foreground">Biography</h2>
          <div
            className="mt-3 text-base leading-relaxed text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: member.bio }}
          />
        </div>
      </div>
    </div>
  );
}
