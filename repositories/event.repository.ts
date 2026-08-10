import type { AlumniEvent } from "@/types/event";
import { BaseRepository } from "./base-repository";

class EventRepository extends BaseRepository<AlumniEvent> {
  constructor() {
    super("events");
  }

  async findBySlug(slug: string): Promise<AlumniEvent | null> {
    const records = await this.findAll();
    return records.find((record) => record.slug === slug) ?? null;
  }
}

export const eventRepository = new EventRepository();
