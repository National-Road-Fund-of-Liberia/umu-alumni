"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { downloadCsv, toCsv } from "@/lib/csv";
import { formatDate } from "@/lib/utils";
import type { Alumni } from "@/types/alumni";

export function ExportAlumniButton({ alumni }: { alumni: Alumni[] }) {
  function handleExport() {
    const csv = toCsv(alumni, [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "degree", label: "Degree" },
      { key: "program", label: "Program" },
      { key: "graduationYear", label: "Graduation Year" },
      { key: "occupation", label: "Occupation" },
      { key: "organization", label: "Organization" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "address", label: "Address" },
      { key: "studentId", label: "Student ID" },
      { key: (row) => formatDate(row.createdAt), label: "Added On" },
    ]);
    downloadCsv(`umu-alumni-directory-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  }

  return (
    <Button type="button" variant="outline" onClick={handleExport}>
      <Download className="size-4" aria-hidden="true" />
      Export Alumni (CSV)
    </Button>
  );
}
