import { randomUUID } from "node:crypto";

import type { PastPresident } from "@/types/past-president";
import { generateInitialsAvatar } from "./placeholder-image";

const PAST_PRESIDENTS: Array<Pick<PastPresident, "fullName" | "year">> = [
  { fullName: "Cyrus B. Manyeh", year: 2020 },
  { fullName: "Deddeh S. Kwekwe", year: 2017 },
  { fullName: "Alhaji T. Kromah", year: 2014 },
  { fullName: "Ma-Cinta G. Toe", year: 2010 },
];

export function generatePastPresidents(): PastPresident[] {
  return PAST_PRESIDENTS.map((entry, index) => {
    const createdAt = new Date(2023, 0, 15).toISOString();
    return {
      id: randomUUID(),
      photoUrl: generateInitialsAvatar(entry.fullName),
      displayOrder: index,
      createdAt,
      updatedAt: createdAt,
      ...entry,
    } satisfies PastPresident;
  });
}
