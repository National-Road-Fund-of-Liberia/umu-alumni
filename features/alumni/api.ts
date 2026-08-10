import { createResourceClient } from "@/lib/resource-client";
import type { AlumniFormValues } from "@/schemas/alumni";
import type { Alumni } from "@/types/alumni";

export const alumniApi = createResourceClient<Alumni, AlumniFormValues>("/api/admin/alumni");
