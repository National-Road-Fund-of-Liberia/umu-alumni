import type { WriteBatch } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase/admin";
import type { StorageAdapter } from "./storage-adapter";
import { getSeedData } from "./seed";

// Firestore caps a single batch at 500 writes; stay comfortably under that.
const MAX_BATCH_SIZE = 400;
const META_COLLECTION = "_collections";

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

async function markInitialized(collection: string, count: number): Promise<void> {
  await adminDb.collection(META_COLLECTION).doc(collection).set(
    {
      initializedAt: new Date().toISOString(),
      count,
    },
    { merge: true }
  );
}

/**
 * Mirrors the old JSON-file adapter's semantics: write() replaces a
 * collection wholesale. Seed data is applied only the first time a
 * collection is seen — after that, an empty collection stays empty so
 * permanent deletes are not undone by mock-data re-seeding.
 */
export class FirestoreStorageAdapter implements StorageAdapter {
  async read<T>(collection: string): Promise<T[]> {
    const snapshot = await adminDb.collection(collection).get();
    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => doc.data() as T);
    }

    const meta = await adminDb.collection(META_COLLECTION).doc(collection).get();
    if (meta.exists) {
      return [];
    }

    const seed = getSeedData<T>(collection);
    if (seed && seed.length > 0) {
      await this.write(collection, seed);
      return seed;
    }

    await markInitialized(collection, 0);
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
    await markInitialized(collection, records.length);
  }
}

export const storageAdapter: StorageAdapter = new FirestoreStorageAdapter();
