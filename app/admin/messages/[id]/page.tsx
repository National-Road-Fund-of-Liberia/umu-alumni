import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactMessageDetail } from "@/features/contact/components/contact-message-detail";
import { getSession } from "@/lib/auth/get-session";
import { ContactService } from "@/services/contact.service";

interface AdminMessagePageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Message",
};

export default async function AdminMessagePage({ params }: AdminMessagePageProps) {
  const { id } = await params;

  let message;
  try {
    message = await ContactService.getById(id);
  } catch {
    notFound();
  }

  if (message.status === "unread") {
    const session = await getSession();
    if (session) {
      message = await ContactService.markRead(id, session.username);
    }
  }

  return <ContactMessageDetail message={message} />;
}
