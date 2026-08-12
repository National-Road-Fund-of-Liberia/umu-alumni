"use client";

import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useConfirm } from "@/components/common/confirm-dialog-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { messagesApi } from "@/features/contact/api";
import { formatDate } from "@/lib/utils";
import type { ContactMessage } from "@/types/contact-message";

export function ContactMessageDetail({ message }: { message: ContactMessage }) {
  const router = useRouter();
  const confirm = useConfirm();

  async function handleDelete() {
    const confirmed = await confirm({
      title: `Delete message from ${message.name}?`,
      description: "This will permanently remove this contact message. This action cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!confirmed) return;

    try {
      await messagesApi.remove(message.id);
      toast.success("Message deleted.");
      router.push("/admin/messages");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete message.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/messages">
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to messages
          </Link>
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleDelete}>
          <Trash2 className="size-3.5 text-destructive" aria-hidden="true" />
          Delete
        </Button>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={message.status === "unread" ? "default" : "secondary"}>
            {message.status === "unread" ? "Unread" : "Read"}
          </Badge>
          <span className="text-sm text-muted-foreground">{formatDate(message.createdAt)}</span>
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">{message.subject}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            From{" "}
            <a href={`mailto:${message.email}`} className="font-medium text-foreground underline-offset-4 hover:underline">
              {message.name} &lt;{message.email}&gt;
            </a>
          </p>
        </div>
        <div className="border-t border-border pt-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{message.message}</p>
        </div>
      </div>
    </div>
  );
}
