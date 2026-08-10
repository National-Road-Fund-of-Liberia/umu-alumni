import type { WriteBatch } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase/admin";
import type { StorageAdapter } from "./storage-adapter";
import { getSeedData } from "./seed";

// Firestore caps a single batch at 500 writes; stay comfortably under that.
const MAX_BATCH_SIZE = 400;

function docId(record: unknown, index: number): string {
  const id = (record as { id?: string }).id;
  return id ?? String(index);
}

async function commitInChunks(operations: Array<(batch: WriteBatch) => void>) {
  for (let i = 0; i < operations.length; i += MAX_BATCH_SIZE) {
    const batch = adminDb.batch();
    for (const op of operations.slice(i, i + MAX_BATCH_SIZE)) op(batch);
    await batch.commit();
  }
}

// Mirrors the JSON-file adapter's semantics: write() replaces a collection
// wholesale, and an empty collection gets seeded from the same mock-data
// registry the JSON adapter used.
export class FirestoreStorageAdapter implements StorageAdapter {
  async read<T>(collection: string): Promise<T[]> {
    const snapshot = await adminDb.collection(collection).get();
    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => doc.data() as T);
    }

    const seed = getSeedData<T>(collection);
    if (seed && seed.length > 0) {
      await this.write(collection, seed);
      return seed;
    }
    return [];
  }

  async write<T>(collection: string, records: T[]): Promise<void> {
    const ref = adminDb.collection(collection);
    const existingDocs = await ref.listDocuments();
    const nextIds = new Set(records.map((record, index) => docId(record, index)));

    const operations: Array<(batch: WriteBatch) => void> = [];

    for (const doc of existingDocs) {
      if (!nextIds.has(doc.id)) {
        operations.push((batch) => batch.delete(doc));
      }
    }
    for (const [index, record] of records.entries()) {
      const id = docId(record, index);
      operations.push((batch) => batch.set(ref.doc(id), record as FirebaseFirestore.DocumentData));
    }

    await commitInChunks(operations);
  }
}

export const storageAdapter: StorageAdapter = new FirestoreStorageAdapter();
