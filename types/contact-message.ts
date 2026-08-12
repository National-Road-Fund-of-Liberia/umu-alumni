export const CONTACT_MESSAGE_STATUSES = ["unread", "read"] as const;
export type ContactMessageStatus = (typeof CONTACT_MESSAGE_STATUSES)[number];

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
}

export type CreateContactMessageInput = Omit<ContactMessage, "id" | "status" | "createdAt">;
