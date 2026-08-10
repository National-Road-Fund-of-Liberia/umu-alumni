import { randomUUID } from "node:crypto";

import { getStorage } from "firebase-admin/storage";

import { adminApp } from "./admin";

const bucket = getStorage(adminApp).bucket();

// Returns the same firebasestorage.googleapis.com token-URL shape the
// client SDK's getDownloadURL() gives you — the token itself grants read
// access, so this works under default Storage rules with no ACL/IAM changes.
export async function uploadImageBuffer(buffer: Buffer, contentType: string, objectPath: string): Promise<string> {
  const token = randomUUID();
  const file = bucket.file(objectPath);
  await file.save(buffer, {
    resumable: false,
    contentType,
    metadata: { metadata: { firebaseStorageDownloadTokens: token } },
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
}

// Accepts both encodings the app's own mock-data generators produce
// (";base64," and the percent-encoded ";utf8,") — used only for seeding
// and the one-off migration script. The live admin upload path never
// produces a data URI at all; the browser uploads raw bytes directly via
// /api/admin/upload instead.
const DATA_URI_PATTERN = /^data:image\/([a-zA-Z0-9.+-]+);(base64|utf8),(.+)$/;

export function isImageDataUri(value: string): boolean {
  return DATA_URI_PATTERN.test(value);
}

async function uploadDataUriImage(dataUri: string, objectPath: string): Promise<string> {
  const match = DATA_URI_PATTERN.exec(dataUri);
  if (!match) throw new Error("Invalid image data URI.");
  const [, subtype, encoding, payload] = match;
  const buffer = encoding === "base64" ? Buffer.from(payload, "base64") : Buffer.from(decodeURIComponent(payload), "utf-8");
  return uploadImageBuffer(buffer, `image/${subtype}`, objectPath);
}

export async function deleteStoredImage(objectPath: string): Promise<void> {
  await bucket.file(objectPath).delete({ ignoreNotFound: true });
}

export async function deleteStoredImagesForRecord(recordPrefix: string): Promise<void> {
  await bucket.deleteFiles({ prefix: recordPrefix, force: true });
}

// Every URL this app hands out has the object path embedded in it
// (.../o/<encoded-path>?...), so a stored photo can always be deleted from
// its own URL alone — the caller never needs to separately track paths.
export async function deleteStoredImageByUrl(url: string): Promise<void> {
  const match = /\/o\/([^?]+)\?/.exec(url);
  if (!match) return;
  await deleteStoredImage(decodeURIComponent(match[1]));
}

// objectPath is fixed per record+field rather than per upload, so replacing
// a photo overwrites the old Storage object instead of orphaning it. If the
// value's already a stored URL (form resubmitted an untouched field), leave
// it alone. Only reachable via seeding/migration now — see the data-URI note above.
export async function resolveImageField(value: string, objectPath: string): Promise<string> {
  return isImageDataUri(value) ? uploadDataUriImage(value, objectPath) : value;
}

// Same idea, but for optional fields where null clears the image.
export async function resolveNullableImageField(value: string | null, objectPath: string): Promise<string | null> {
  if (value === null) {
    await deleteStoredImage(objectPath);
    return null;
  }
  return resolveImageField(value, objectPath);
}
