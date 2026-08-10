import type { StorageAdapter } from "@/storage/storage-adapter";
import { storageAdapter } from "@/storage/firestore-adapter";

export interface Entity {
  id: string;
}

/**
 * Generic CRUD over a single named collection. Domain repositories extend
 * this for the common case and add entity-specific queries on top — the
 * swap-to-Postgres story is: implement StorageAdapter against a real DB,
 * everything here and above stays the same.
 */
export class BaseRepository<T extends Entity> {
  constructor(
    protected readonly collection: string,
    private readonly adapter: StorageAdapter = storageAdapter
  ) {}

  async findAll(): Promise<T[]> {
    return this.adapter.read<T>(this.collection);
  }

  async findById(id: string): Promise<T | null> {
    const records = await this.findAll();
    return records.find((record) => record.id === id) ?? null;
  }

  async create(record: T): Promise<T> {
    const records = await this.findAll();
    records.push(record);
    await this.adapter.write(this.collection, records);
    return record;
  }

  async update(id: string, patch: Partial<T>): Promise<T | null> {
    const records = await this.findAll();
    const index = records.findIndex((record) => record.id === id);
    if (index === -1) return null;

    const existing = records[index] as T;
    const updated: T = { ...existing, ...patch, id: existing.id };
    records[index] = updated;
    await this.adapter.write(this.collection, records);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const records = await this.findAll();
    const next = records.filter((record) => record.id !== id);
    if (next.length === records.length) return false;
    await this.adapter.write(this.collection, next);
    return true;
  }
}
