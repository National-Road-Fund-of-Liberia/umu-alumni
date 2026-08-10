export const EVENT_CATEGORIES = [
  "Reunion",
  "Homecoming",
  "Networking",
  "Fundraiser",
  "Workshop",
  "Webinar",
] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const EVENT_STATUSES = ["upcoming", "past", "cancelled"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export interface AlumniEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string | null;
  coverImageUrl: string | null;
  category: EventCategory;
  status: EventStatus;
  registrationUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateEventInput = Omit<AlumniEvent, "id" | "slug" | "createdAt" | "updatedAt">;
export type UpdateEventInput = Partial<CreateEventInput>;
