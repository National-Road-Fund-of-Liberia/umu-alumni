import { randomUUID } from "node:crypto";

import type { CommitteeMember } from "@/types/committee";
import { generateInitialsAvatar } from "./placeholder-image";

const MEMBERS: Array<Pick<CommitteeMember, "fullName" | "title" | "bio" | "termStart" | "termEnd">> = [
  {
    fullName: "Emmet Payopa Coker",
    title: "President",
    bio: "A 1998 graduate of the Business Administration program, Dr. Sackie has led the Alumni Association since 2023, focused on expanding the association's scholarship endowment and strengthening chapter engagement across Liberia.",
    termStart: 2023,
    termEnd: 2026,
  },
  {
    fullName: "James N. Fallah",
    title: "Vice President for Administration",
    bio: "Comfort brings two decades of nonprofit leadership experience to the association, having previously coordinated donor relations for several regional development programs.",
    termStart: 2023,
    termEnd: 2026,
  },
  {
    fullName: "Meekie J. Reeves",
    title: "Vice President for Operations",
    bio: "Meekie oversees the association's records, correspondence, and chapter communications, and is a graduate of the Mass Communication program.",
    termStart: 2023,
    termEnd: 2026,
  },
  {
    fullName: "Obediah T. Zonoe",
    title: "Secretary General",
    bio: "Obediah manages the association's finances and reporting, drawing on a career in accounting and audit across Monrovia's banking sector.",
    termStart: 2023,
    termEnd: 2026,
  },
  {
    fullName: "Josephine Kesselly",
    title: "Treasurer",
    bio: "Josephine manages the association's finances and reporting, drawing on a career in accounting and audit across Monrovia's banking sector.",
    termStart: 2023,
    termEnd: 2026,
  },
  {
    fullName: "Emmanuel F. Vesselee",
    title: "Financial Secretary",
    bio: "Vesselee supports the treasury office with membership dues, chapter budgets, and financial recordkeeping for the association's annual programs.",
    termStart: 2023,
    termEnd: 2026,
  },
  {
    fullName: "Felecia J. W. Dorbor",
    title: "Assistant Secretary",
    bio: "Felecia supports the treasury office with membership dues, chapter budgets, and financial recordkeeping for the association's annual programs.",
    termStart: 2023,
    termEnd: 2026,
  },
  {
    fullName: "Miatta Roseline Karnley",
    title: "Public Relations Officer",
    bio: "Miatta manages the association's public communications, press relations, and social media presence, and previously worked as a broadcast journalist.",
    termStart: 2023,
    termEnd: 2026,
  },
  {
    fullName: "Prince Momolu Varney",
    title: "Organizing Secretary",
    bio: "Prince coordinates logistics for reunions, homecoming, and regional chapter events, ensuring every gathering reflects the association's standards.",
    termStart: 2023,
    termEnd: 2026,
  },
  {
    fullName: "Rev. Augustine Wesseh",
    title: "Chaplain",
    bio: "Rev. Wesseh provides spiritual guidance for the association's programs and represents the alumni body at university and church functions.",
    termStart: 2023,
    termEnd: 2026,
  },
];

export function generateCommittee(): CommitteeMember[] {
  return MEMBERS.map((member, index) => {
    const createdAt = new Date(2023, 0, 15).toISOString();
    return {
      id: randomUUID(),
      photoUrl: generateInitialsAvatar(member.fullName),
      displayOrder: index,
      createdAt,
      updatedAt: createdAt,
      ...member,
    } satisfies CommitteeMember;
  });
}
