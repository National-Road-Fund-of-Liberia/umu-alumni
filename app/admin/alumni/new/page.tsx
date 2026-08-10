import type { Metadata } from "next";

import { AlumniForm } from "@/features/alumni/components/alumni-form";

export const metadata: Metadata = {
  title: "Add Alumni",
};

export default function NewAlumniPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Add Alumni</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add a new graduate to the alumni directory.</p>
      </div>
      <AlumniForm />
    </div>
  );
}
