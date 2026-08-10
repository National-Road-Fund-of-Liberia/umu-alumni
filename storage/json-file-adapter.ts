import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { StorageAdapter } from "./storage-adapter";
import { getSeedData } from "./seed";

const DATA_DIR = path.join(process.cwd(), ".data");

function collectionPath(collection: string) {
  return path.join(DATA_DIR, `${collection}.json`);
}

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

// Server-side only: the browser's real localStorage cannot be reached from a
// Route Handler, so this JSON-file store is the temporary persistence engine
// behind the same StorageAdapter interface. See project notes for details.
// One write queue per collection prevents interleaved writes (two mutating
// requests racing on the same file) from corrupting or dropping data.
const writeQueues = new Map<string, Promise<void>>();

export class JsonFileStorageAdapter implements StorageAdapter {
  async read<T>(collection: string): Promise<T[]> {
    await ensureDataDir();
    try {
      const raw = await readFile(collectionPath(collection), "utf-8");
      return JSON.parse(raw) as T[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        const seed = getSeedData<T>(collection);
        if (seed) {
          await this.write(collection, seed);
          return seed;
        }
        return [];
      }
      throw error;
    }
  }

  write<T>(collection: string, records: T[]): Promise<void> {
    const previous = writeQueues.get(collection) ?? Promise.resolve();
    const next = previous.then(async () => {
      await ensureDataDir();
      await writeFile(collectionPath(collection), JSON.stringify(records, null, 2), "utf-8");
    });
    writeQueues.set(collection, next);
    return next;
  }
}

export const storageAdapter: StorageAdapter = new JsonFileStorageAdapter();
