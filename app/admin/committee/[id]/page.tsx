import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CommitteeForm } from "@/features/committee/components/committee-form";
import { CommitteeService } from "@/services/committee.service";

interface EditCommitteeMemberPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Committee Member",
};

export default async function EditCommitteeMemberPage({ params }: EditCommitteeMemberPageProps) {
  const { id } = await params;

  let member;
  try {
    member = await CommitteeService.getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">{member.fullName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update this committee member&apos;s profile.</p>
      </div>
      <CommitteeForm member={member} />
    </div>
  );
}
