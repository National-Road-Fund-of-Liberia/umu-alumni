/**
 * Contract every persistence backend must satisfy. Repositories only ever
 * talk to this interface, so swapping the JSON-file adapter for a Postgres
 * (or any other) adapter later is a one-file change with no ripple effect
 * into Repositories, Services, API Routes, or the UI.
 */
export interface StorageAdapter {
  read<T>(collection: string): Promise<T[]>;
  write<T>(collection: string, records: T[]): Promise<void>;
}
