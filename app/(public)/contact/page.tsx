import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/common/page-header";
import { ContactForm } from "@/features/contact/components/contact-form";
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the United Methodist University Alumni Association.",
};

interface ContactDetail {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

const DETAILS: ContactDetail[] = [
  { icon: Mail, label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: Phone, label: "Phone", value: CONTACT_PHONE, href: `tel:${CONTACT_PHONE.replace(/\s+/g, "")}` },
  { icon: MapPin, label: "Office", value: CONTACT_ADDRESS },
  { icon: Clock, label: "Office Hours", value: "Monday–Friday, 9:00 AM–4:00 PM GMT" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact the Association"
        description="Questions about membership, events, or updating your alumni record? Send a message and the office will follow up."
      />
      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <ContactForm />

          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-heading text-base font-semibold text-foreground">Association Office</h2>
              <dl className="mt-4 space-y-4">
                {DETAILS.map((detail) => (
                  <div key={detail.label} className="flex gap-3">
                    <detail.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">{detail.label}</dt>
                      <dd className="text-sm text-foreground">
                        {detail.href ? (
                          <a href={detail.href} className="hover:underline">
                            {detail.value}
                          </a>
                        ) : (
                          detail.value
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
