import Link from "next/link";

import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, FOOTER_LINKS, FOOTER_NAV_LINKS, SITE_DESCRIPTION } from "@/lib/constants";
import { SiteLogo } from "./site-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <SiteLogo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{SITE_DESCRIPTION}</p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">Explore</h2>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">Contact</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-foreground">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT_PHONE.replace(/\s+/g, "")}`} className="hover:text-foreground">
                  {CONTACT_PHONE}
                </a>
              </li>
              <li className="leading-relaxed">{CONTACT_ADDRESS}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} United Methodist University Alumni Association. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-muted-foreground hover:text-foreground">
                {link.label}
              </Link>
            ))}
            <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground">
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
