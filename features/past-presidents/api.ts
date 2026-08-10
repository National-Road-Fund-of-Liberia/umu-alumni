import { createResourceClient } from "@/lib/resource-client";
import type { PastPresidentFormValues } from "@/schemas/past-president";
import type { PastPresident } from "@/types/past-president";

export const pastPresidentsApi = createResourceClient<PastPresident, PastPresidentFormValues>(
  "/api/admin/past-presidents"
);
