import { Handshake, HeartHandshake, Megaphone, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/common/page-header";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description: "The mission, history, and work of the United Methodist University Alumni Association.",
};

const PILLARS = [
  {
    icon: Users,
    title: "Networking",
    description: "Regional chapters and quarterly mixers keep graduates connected across every industry and county.",
  },
  {
    icon: HeartHandshake,
    title: "Mentorship",
    description: "Alumni volunteer their time to guide current students through career workshops and one-on-one advising.",
  },
  {
    icon: Handshake,
    title: "Giving Back",
    description: "Scholarship funds and campus improvement drives are supported entirely by alumni contributions.",
  },
  {
    icon: Megaphone,
    title: "Advocacy",
    description: "The association represents alumni interests in university governance and long-term planning.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="A community built by graduates, for graduates."
        description="The United Methodist University Alumni Association exists to keep every graduate connected to one another and to the institution that shaped them."
      />

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Our Story</h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              United Methodist University has sent graduates into public service, business, healthcare, education,
              and ministry across Liberia and beyond for decades. As that community grew, so did the need for a
              formal body to keep it connected — one that could organize reunions, share news, and give graduates a
              structured way to support the university and each other.
            </p>
            <p>
              The Alumni Association was formed to do exactly that. Run by an elected Executive Committee and
              supported by regional chapters, the association today coordinates homecoming and reunion events,
              publishes news from across the alumni community, maintains the official alumni directory, and
              administers a scholarship fund supporting current UMU students.
            </p>
            <p>
              Membership is open to every graduate of United Methodist University, regardless of program, class
              year, or where their career has taken them since.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading title="Four pillars of the association's work" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="rounded-lg border border-border bg-card p-6">
                <pillar.icon className="size-5 text-muted-foreground" aria-hidden="true" />
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              Meet the people leading the association
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              The Executive Committee is elected by the membership and serves three-year terms.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/committee">View the Executive Committee</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
