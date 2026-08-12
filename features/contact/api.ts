import { createResourceClient } from "@/lib/resource-client";
import type { ContactMessage } from "@/types/contact-message";

type MarkReadInput = { status: "read" };

const client = createResourceClient<ContactMessage, MarkReadInput>("/api/admin/messages");

export const messagesApi = {
  list: client.list,
  get: client.get,
  remove: client.remove,
  markRead: (id: string) => client.update(id, { status: "read" }),
};
