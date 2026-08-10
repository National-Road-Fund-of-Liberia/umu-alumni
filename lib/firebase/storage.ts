import { randomUUID } from "node:crypto";

import { getStorage } from "firebase-admin/storage";

import { adminApp } from "./admin";

const bucket = getStorage(adminApp).bucket();

const DATA_URI_PATTERN = /^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/;

export function isImageDataUri(value: string): boolean {
  return DATA_URI_PATTERN.test(value);
}

// Returns the same firebasestorage.googleapis.com token-URL shape the
// client SDK's getDownloadURL() gives you — the token itself grants read
// access, so this works under default Storage rules with no ACL/IAM changes.
async function uploadDataUriImage(dataUri: string, objectPath: string): Promise<string> {
  const match = DATA_URI_PATTERN.exec(dataUri);
  if (!match) throw new Error("Invalid image data URI.");
  const [, subtype, base64] = match;
  const token = randomUUID();

  const file = bucket.file(objectPath);
  await file.save(Buffer.from(base64, "base64"), {
    resumable: false,
    contentType: `image/${subtype}`,
    metadata: { metadata: { firebaseStorageDownloadTokens: token } },
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
}

export async function deleteStoredImage(objectPath: string): Promise<void> {
  await bucket.file(objectPath).delete({ ignoreNotFound: true });
}

export async function deleteStoredImagesForRecord(recordPrefix: string): Promise<void> {
  await bucket.deleteFiles({ prefix: recordPrefix, force: true });
}

// objectPath is fixed per record+field rather than per upload, so replacing
// a photo overwrites the old Storage object instead of orphaning it. If the
// value's already a stored URL (form resubmitted an untouched field), leave
// it alone.
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
