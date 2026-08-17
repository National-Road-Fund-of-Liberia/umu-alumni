import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { AlumniDirectory } from "@/features/alumni/components/alumni-directory";
import { AlumniService } from "@/services/alumni.service";

// Safety net so this self-heals if an admin mutation's on-demand
// revalidation (lib/public-cache.ts) ever misses this deployment.
export const revalidate = 30;

export const metadata: Metadata = {
  title: "Alumni Directory",
  description: "Search and connect with United Methodist University graduates.",
};

async function DirectoryContent() {
  const alumni = await AlumniService.listPublic();
  return <AlumniDirectory alumni={alumni} />;
}

function DirectorySkeleton() {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-full sm:w-56" />
        <Skeleton className="h-10 w-full sm:w-36" />
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        <Skeleton className="h-10 w-full rounded-none" />
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full rounded-none border-t border-border" />
        ))}
      </div>
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <>
      <PageHeader
        title="Find an alumni"
        description="Search by name, filter by program or graduation year."
      />
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <Suspense fallback={<DirectorySkeleton />}>
            <DirectoryContent />
          </Suspense>
        </div>
      </section>
    </>
  );
}
