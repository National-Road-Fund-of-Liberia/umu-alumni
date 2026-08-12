import type { Metadata } from "next";

import { ContactMessagesTable } from "@/features/contact/components/contact-messages-table";
import { ContactService } from "@/services/contact.service";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function AdminMessagesPage() {
  const messages = await ContactService.listAll();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact form submissions from the public site. Unread messages are marked as read when you open them.
        </p>
      </div>
      <ContactMessagesTable messages={messages} />
    </div>
  );
}
