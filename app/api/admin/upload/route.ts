import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/api-response";
import { requireSession } from "@/lib/auth/get-session";
import { ValidationError } from "@/lib/errors";
import { deleteStoredImageByUrl, uploadImageBuffer } from "@/lib/firebase/storage";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * The one place a browser-selected file ever leaves the browser: raw bytes
 * via multipart, straight to Firebase Storage. Nothing in this app's forms,
 * JSON payloads, or Firestore documents holds a base64 image anymore — this
 * route returns a Storage URL and that's the only thing that travels
 * further. `folder` scopes where the object lands (e.g. "committee");
 * `previousUrl`, when present, is deleted after the new upload succeeds so
 * replacing a photo doesn't orphan the old one.
 */
export async function POST(request: NextRequest) {
  try {
    await requireSession();

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");
    const previousUrl = formData.get("previousUrl");

    if (!(file instanceof File)) {
      throw new ValidationError("No file provided.");
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      throw new ValidationError("Please upload a PNG, JPG, or WebP image.");
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new ValidationError("Image must be smaller than 10MB.");
    }
    if (typeof folder !== "string" || !folder) {
      throw new ValidationError("Missing upload folder.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const objectPath = `${folder}/${crypto.randomUUID()}`;
    const url = await uploadImageBuffer(buffer, file.type, objectPath);

    if (typeof previousUrl === "string" && previousUrl) {
      await deleteStoredImageByUrl(previousUrl).catch(() => {});
    }

    return apiSuccess({ url });
  } catch (error) {
    return apiError(error);
  }
}
