import { randomUUID } from "node:crypto";

import { NotFoundError } from "@/lib/errors";
import { contactMessageRepository } from "@/repositories/contact-message.repository";
import { contactSchema } from "@/schemas/contact";
import type { ContactMessage } from "@/types/contact-message";
import { AuditService } from "./audit.service";

export const ContactService = {
  async listAll(): Promise<ContactMessage[]> {
    const records = await contactMessageRepository.findAll();
    return [...records].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getById(id: string): Promise<ContactMessage> {
    const record = await contactMessageRepository.findById(id);
    if (!record) throw new NotFoundError("Message not found.");
    return record;
  },

  async create(input: unknown): Promise<ContactMessage> {
    const data = contactSchema.parse(input);
    const record: ContactMessage = {
      id: randomUUID(),
      ...data,
      status: "unread",
      createdAt: new Date().toISOString(),
    };
    await contactMessageRepository.create(record);
    return record;
  },

  async markRead(id: string, actorUsername: string): Promise<ContactMessage> {
    const existing = await this.getById(id);
    if (existing.status === "read") return existing;

    const updated = await contactMessageRepository.update(id, { status: "read" });
    if (!updated) throw new NotFoundError("Message not found.");

    await AuditService.record({
      actorUsername,
      action: "update",
      entityType: "contact-message",
      entityId: id,
      description: `Marked contact message from ${existing.name} as read`,
    });

    return updated;
  },

  async delete(id: string, actorUsername: string): Promise<void> {
    const existing = await this.getById(id);
    const deleted = await contactMessageRepository.delete(id);
    if (!deleted) throw new NotFoundError("Message not found.");

    await AuditService.record({
      actorUsername,
      action: "delete",
      entityType: "contact-message",
      entityId: id,
      description: `Deleted contact message from ${existing.name}`,
    });
  },
};
