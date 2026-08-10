import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

// Pushes .data/*.json (the JSON-file adapter's live state, admin edits
// included) into Firestore, one collection per file. Re-runnable — write()
// replaces each collection wholesale.
async function main() {
  const { storageAdapter } = await import("../storage/firestore-adapter");

  const dataDir = path.join(process.cwd(), ".data");
  const files = (await readdir(dataDir)).filter((file) => file.endsWith(".json"));

  for (const file of files) {
    const collection = file.replace(/\.json$/, "");
    const raw = await readFile(path.join(dataDir, file), "utf-8");
    const records = JSON.parse(raw) as unknown[];

    await storageAdapter.write(collection, records);
    console.log(`Seeded "${collection}" (${records.length} record${records.length === 1 ? "" : "s"})`);
  }

  console.log("Firestore seed complete.");
}

main().catch((error) => {
  console.error("Firestore seed failed:", error);
  process.exit(1);
});
