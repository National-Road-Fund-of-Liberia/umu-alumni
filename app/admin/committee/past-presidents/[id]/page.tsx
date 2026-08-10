import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PastPresidentForm } from "@/features/past-presidents/components/past-president-form";
import { PastPresidentService } from "@/services/past-president.service";

interface EditPastPresidentPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Past President",
};

export default async function EditPastPresidentPage({ params }: EditPastPresidentPageProps) {
  const { id } = await params;

  let person;
  try {
    person = await PastPresidentService.getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">{person.fullName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update this past president&apos;s record.</p>
      </div>
      <PastPresidentForm person={person} />
    </div>
  );
}
