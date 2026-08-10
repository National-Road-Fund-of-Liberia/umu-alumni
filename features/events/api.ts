import { createResourceClient } from "@/lib/resource-client";
import type { EventFormValues } from "@/schemas/event";
import type { AlumniEvent } from "@/types/event";

export const eventsApi = createResourceClient<AlumniEvent, EventFormValues>("/api/admin/events");
