import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// The initial seed carried images over as inline base64, which blows past
// Firestore's 1MiB document cap for anything but tiny placeholders. This
// uploads any leftover data URIs to Storage and rewrites the field, in both
// Firestore and .data/*.json (so a later seed:firestore run doesn't undo it).
const IMAGE_FIELDS: Record<string, { field: string; folder: string }[]> = {
  alumni: [{ field: "photoUrl", folder: "photo" }],
  gallery: [{ field: "imageUrl", folder: "image" }],
  news: [{ field: "coverImageUrl", folder: "cover" }],
  committee: [{ field: "photoUrl", folder: "photo" }],
  events: [{ field: "coverImageUrl", folder: "cover" }],
  "admin-users": [{ field: "avatarUrl", folder: "avatar" }],
};

async function main() {
  const { storageAdapter } = await import("../storage/firestore-adapter");
  const { resolveImageField, isImageDataUri } = await import("../lib/firebase/storage");

  const dataDir = path.join(process.cwd(), ".data");

  for (const [collection, fields] of Object.entries(IMAGE_FIELDS)) {
    const filePath = path.join(dataDir, `${collection}.json`);
    const raw = await readFile(filePath, "utf-8");
    const records = JSON.parse(raw) as Array<Record<string, unknown>>;

    let migrated = 0;
    for (const record of records) {
      const id = record.id as string;
      for (const { field, folder } of fields) {
        const value = record[field];
        if (typeof value === "string" && isImageDataUri(value)) {
          record[field] = await resolveImageField(value, `${collection}/${id}/${folder}`);
          migrated += 1;
        }
      }
    }

    if (migrated > 0) {
      await storageAdapter.write(collection, records);
      await writeFile(filePath, JSON.stringify(records, null, 2), "utf-8");
    }
    console.log(`${collection}: migrated ${migrated} image field(s)`);
  }

  console.log("Image migration complete.");
}

main().catch((error) => {
  console.error("Image migration failed:", error);
  process.exit(1);
});
