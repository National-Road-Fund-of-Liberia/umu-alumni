import { randomUUID } from "node:crypto";

import type { AlumniEvent, EventStatus } from "@/types/event";
import { slugify } from "@/lib/utils";
import { generateCoverPlaceholder } from "./placeholder-image";

const EVENTS: Array<
  Pick<AlumniEvent, "title" | "description" | "location" | "category" | "registrationUrl"> & {
    startOffsetDays: number;
    endOffsetDays: number | null;
  }
> = [
  {
    title: "Homecoming 2026",
    description:
      "The association's flagship annual gathering, bringing together graduates from every class for a weekend of campus tours, panels, and a formal banquet.",
    location: "UMU Main Campus, Monrovia",
    category: "Homecoming",
    registrationUrl: "https://umualumni.org/events/homecoming-2026",
    startOffsetDays: 45,
    endOffsetDays: 47,
  },
  {
    title: "Class of 2016 10-Year Reunion",
    description:
      "A milestone reunion for the Class of 2016, featuring a campus tour, a class photo at the quad, and an evening reception.",
    location: "UMU Main Campus, Monrovia",
    category: "Reunion",
    registrationUrl: "https://umualumni.org/events/class-2016-reunion",
    startOffsetDays: 74,
    endOffsetDays: 74,
  },
  {
    title: "Quarterly Networking Mixer — Monrovia Chapter",
    description:
      "An evening of informal networking for alumni working across banking, telecoms, and public service in and around Monrovia.",
    location: "Royal Grand Hotel, Sinkor",
    category: "Networking",
    registrationUrl: "https://umualumni.org/events/monrovia-mixer-q3",
    startOffsetDays: 21,
    endOffsetDays: 21,
  },
  {
    title: "Scholarship Fund Gala Dinner",
    description:
      "A formal fundraising dinner in support of the 2026 Scholarship Fund, featuring remarks from the university president and Executive Committee.",
    location: "Monrovia City Hall",
    category: "Fundraiser",
    registrationUrl: "https://umualumni.org/events/scholarship-gala",
    startOffsetDays: 60,
    endOffsetDays: 60,
  },
  {
    title: "Career Development Workshop: Resume & Interview Skills",
    description:
      "A hands-on workshop for recent graduates covering resume writing, interview preparation, and salary negotiation, led by alumni HR professionals.",
    location: "UMU Business Building, Room 204",
    category: "Workshop",
    registrationUrl: "https://umualumni.org/events/career-workshop",
    startOffsetDays: 14,
    endOffsetDays: 14,
  },
  {
    title: "Webinar: Navigating Public Service Careers",
    description:
      "A virtual panel with UMU alumni currently serving in government ministries, discussing how to build a career in public service.",
    location: "Online — Zoom",
    category: "Webinar",
    registrationUrl: "https://umualumni.org/events/public-service-webinar",
    startOffsetDays: 9,
    endOffsetDays: 9,
  },
  {
    title: "Buchanan Chapter Inaugural Meetup",
    description:
      "The newly chartered Grand Bassa County chapter's first official gathering, open to all alumni based in or near Buchanan.",
    location: "Buchanan City Hall, Grand Bassa County",
    category: "Networking",
    registrationUrl: null,
    startOffsetDays: -12,
    endOffsetDays: -12,
  },
  {
    title: "Homecoming 2025",
    description:
      "Last year's homecoming weekend, which drew record attendance from alumni across every graduating class since 1994.",
    location: "UMU Main Campus, Monrovia",
    category: "Homecoming",
    registrationUrl: null,
    startOffsetDays: -320,
    endOffsetDays: -318,
  },
  {
    title: "Annual Giving Campaign Kickoff Breakfast",
    description:
      "A breakfast event marking the start of the annual giving campaign, with remarks from the Treasurer's office on the year's fundraising priorities.",
    location: "UMU Alumni Center",
    category: "Fundraiser",
    registrationUrl: null,
    startOffsetDays: -210,
    endOffsetDays: -210,
  },
];

function statusFor(startOffsetDays: number): EventStatus {
  return startOffsetDays < 0 ? "past" : "upcoming";
}

export function generateEvents(): AlumniEvent[] {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  return EVENTS.map((event) => {
    const slug = slugify(event.title);
    const startDate = new Date(now + event.startOffsetDays * dayMs).toISOString();
    const endDate = event.endOffsetDays === null ? null : new Date(now + event.endOffsetDays * dayMs).toISOString();
    const createdAt = new Date(now - 30 * dayMs).toISOString();

    return {
      id: randomUUID(),
      title: event.title,
      slug,
      description: event.description,
      location: event.location,
      startDate,
      endDate,
      coverImageUrl: generateCoverPlaceholder(slug, event.category),
      category: event.category,
      status: statusFor(event.startOffsetDays),
      registrationUrl: event.registrationUrl,
      createdAt,
      updatedAt: createdAt,
    } satisfies AlumniEvent;
  });
}
