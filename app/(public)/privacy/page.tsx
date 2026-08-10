import type { Metadata } from "next";

import { PageHeader } from "@/components/common/page-header";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How the United Methodist University Alumni Association collects, uses, and protects your information.",
};

const SECTIONS = [
  {
    title: "Information We Collect",
    body: `When you're added to the alumni directory, the association records your name, degree, program, graduation year, occupation, organization, and a short biography, along with private contact details — email, phone number, mailing address, and student ID — used only for internal administration.`,
  },
  {
    title: "What's Published in the Public Directory",
    body: `Only your name, photo, degree, program, graduation year, occupation, organization, and biography appear in the public Alumni Directory. Anyone visiting the website can view these fields.`,
  },
  {
    title: "What's Never Published",
    body: `Your email address, phone number, mailing address, and student ID are stored for internal use by association administrators only and are never displayed on the public website or included in any public-facing API response.`,
  },
  {
    title: "How We Use Your Information",
    body: `Private contact details are used to send event invitations, share association news, and administer scholarship and giving programs. We do not sell or share your information with third parties for marketing purposes.`,
  },
  {
    title: "Data Storage & Security",
    body: `Alumni records are maintained by the association's administrative team and protected by access controls limiting administration to authorized association staff.`,
  },
  {
    title: "Your Rights",
    body: `You may request a copy of the information the association holds about you, ask for corrections, or request that your directory listing be removed entirely by contacting the association office.`,
  },
] as const;

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        description="Last updated August 2026. This policy explains what information the association collects and how it is used."
      />
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="font-heading text-lg font-semibold text-foreground">{section.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
              </div>
            ))}
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">Contact</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Questions about this policy or your data can be directed to{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline underline-offset-4">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
