import type { ContactMessage } from "@/types/contact-message";
import { BaseRepository } from "./base-repository";

class ContactMessageRepository extends BaseRepository<ContactMessage> {
  constructor() {
    super("contact-messages");
  }
}

export const contactMessageRepository = new ContactMessageRepository();
