import { apiError, apiSuccess } from "@/lib/api-response";
import { AlumniService } from "@/services/alumni.service";

/**
 * Public, read-only. The page that renders the Directory calls
 * AlumniService directly (Server Component, no self-fetch needed), but
 * this route exists as the real public entry point for any other client —
 * and, like every other alumni access path, it only ever returns the
 * public projection.
 */
export async function GET() {
  try {
    const alumni = await AlumniService.listPublic();
    return apiSuccess(alumni);
  } catch (error) {
    return apiError(error);
  }
}
