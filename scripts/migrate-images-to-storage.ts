import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

// Sweeps every collection's live Firestore data for image fields still
// holding an inline base64 data URI (leftover from the initial seed, or
// from any create/update that ran before a service was wired to Storage)
// and pushes them to Firebase Storage, replacing the field with the
// resulting URL. Reads and writes go straight through the live Firestore
// adapter — never a local snapshot — so this is safe to run at any time
// without clobbering data written since the last local seed.
const IMAGE_FIELDS: Record<string, { field: string; folder: string; nullable: boolean }[]> = {
  alumni: [{ field: "photoUrl", folder: "photo", nullable: true }],
  gallery: [{ field: "imageUrl", folder: "image", nullable: false }],
  news: [{ field: "coverImageUrl", folder: "cover", nullable: true }],
  committee: [{ field: "photoUrl", folder: "photo", nullable: true }],
  "past-presidents": [{ field: "photoUrl", folder: "photo", nullable: true }],
  events: [{ field: "coverImageUrl", folder: "cover", nullable: true }],
  "admin-users": [{ field: "avatarUrl", folder: "avatar", nullable: true }],
};

async function main() {
  const { storageAdapter } = await import("../storage/firestore-adapter");
  const { resolveImageField, resolveNullableImageField, isImageDataUri } = await import("../lib/firebase/storage");

  for (const [collection, fields] of Object.entries(IMAGE_FIELDS)) {
    const records = await storageAdapter.read<Record<string, unknown>>(collection);

    let migrated = 0;
    for (const record of records) {
      const id = record.id as string;
      for (const { field, folder, nullable } of fields) {
        const value = record[field];
        if (typeof value === "string" && isImageDataUri(value)) {
          const objectPath = `${collection}/${id}/${folder}`;
          record[field] = nullable
            ? await resolveNullableImageField(value, objectPath)
            : await resolveImageField(value, objectPath);
          migrated += 1;
        }
      }
    }

    if (migrated > 0) {
      await storageAdapter.write(collection, records);
    }
    console.log(`${collection}: migrated ${migrated} image field(s) of ${records.length} record(s)`);
  }

  console.log("Image migration complete.");
}

main().catch((error) => {
  console.error("Image migration failed:", error);
  process.exit(1);
});
