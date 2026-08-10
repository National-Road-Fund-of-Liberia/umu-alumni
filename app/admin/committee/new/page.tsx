import type { Metadata } from "next";

import { CommitteeForm } from "@/features/committee/components/committee-form";

export const metadata: Metadata = {
  title: "Add Committee Member",
};

export default function NewCommitteeMemberPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Add Committee Member</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add a new member to the Executive Committee.</p>
      </div>
      <CommitteeForm />
    </div>
  );
}
