import type { Metadata } from "next";

import { PageHeader } from "@/components/common/page-header";
import { SectionHeading } from "@/components/common/section-heading";
import { CommitteeCard } from "@/features/committee/components/committee-card";
import { PastPresidentCard } from "@/features/past-presidents/components/past-president-card";
import { CommitteeService } from "@/services/committee.service";
import { PastPresidentService } from "@/services/past-president.service";

// Safety net on top of the on-demand revalidatePath() calls in
// lib/public-cache.ts: if an admin mutation's revalidation ever fails to
// reach this deployment (e.g. it was triggered from a different
// environment), this page self-heals within 30s instead of staying stale
// until the next deploy.
export const revalidate = 30;

export const metadata: Metadata = {
  title: "Executive Committee",
  description: "Meet the elected leadership of the United Methodist University Alumni Association.",
};

export default async function CommitteePage() {
  const [members, pastPresidents] = await Promise.all([CommitteeService.listAll(), PastPresidentService.listAll()]);

  return (
    <>
      <PageHeader
        title="Executive Committee"
        description="Elected by the membership to serve three-year terms, the Executive Committee sets the association's direction and represents alumni interests to the university."
      />
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((member) => (
              <CommitteeCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {pastPresidents.length > 0 && (
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeading
              title="Past Presidents"
              description="Honoring those who have led the association before us."
            />
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {pastPresidents.map((person) => (
                <PastPresidentCard key={person.id} person={person} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
