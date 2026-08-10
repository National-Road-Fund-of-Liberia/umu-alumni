import type { ApiResponse } from "@/types/api";

import { ResourceApiError } from "./resource-client";

/**
 * POSTs a raw File to /api/admin/upload as multipart form data and returns
 * the Firebase Storage download URL. The browser never base64-encodes the
 * bytes — FormData carries them as-is. `previousUrl`, when set, asks the
 * server to delete the replaced object after the new upload succeeds.
 */
export async function uploadImage(file: File, folder: string, previousUrl?: string | null): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  if (previousUrl) {
    formData.append("previousUrl", previousUrl);
  }

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const result = (await response.json()) as ApiResponse<{ url: string }>;
  if (!result.success) {
    throw new ResourceApiError(result.error.message, result.error.fieldErrors);
  }
  return result.data.url;
}
