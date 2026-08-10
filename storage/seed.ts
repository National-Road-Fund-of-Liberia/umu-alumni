import { generateAlumni } from "@/lib/mock-data/alumni";
import { generateAuditLog } from "@/lib/mock-data/audit-log";
import { generateCommittee } from "@/lib/mock-data/committee";
import { generateEvents } from "@/lib/mock-data/events";
import { generateGallery } from "@/lib/mock-data/gallery";
import { generateNews } from "@/lib/mock-data/news";
import { generatePastPresidents } from "@/lib/mock-data/past-presidents";
import { generateRoles } from "@/lib/mock-data/roles";
import { generateAdminUsers } from "@/lib/mock-data/users";

const ALUMNI_SEED_COUNT = 75;

type SeedFn = () => unknown[];

/**
 * Registry of "collection name" -> "generator". A collection is only ever
 * seeded once: the Firestore adapter calls this on the first read of a
 * collection that has never been initialized, then persists a meta marker
 * so later permanent deletes (including emptying the collection) are not
 * undone by re-seeding mock data.
 */
const SEED_REGISTRY: Record<string, SeedFn> = {
  alumni: () => generateAlumni(ALUMNI_SEED_COUNT),
  news: () => generateNews(),
  events: () => generateEvents(),
  committee: () => generateCommittee(),
  "past-presidents": () => generatePastPresidents(),
  gallery: () => generateGallery(),
  "admin-users": () => generateAdminUsers(),
  roles: () => generateRoles(),
  "audit-log": () => generateAuditLog(),
};

export function getSeedData<T>(collection: string): T[] | null {
  const seedFn = SEED_REGISTRY[collection];
  return seedFn ? (seedFn() as T[]) : null;
}
