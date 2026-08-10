import type { Metadata } from "next";

import { PastPresidentForm } from "@/features/past-presidents/components/past-president-form";

export const metadata: Metadata = {
  title: "Add Past President",
};

export default function NewPastPresidentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Add Past President</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add a former president to the association&apos;s record.</p>
      </div>
      <PastPresidentForm />
    </div>
  );
}
