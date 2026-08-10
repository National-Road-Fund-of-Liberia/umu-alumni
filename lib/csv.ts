interface CsvColumn<T> {
  key: keyof T | ((row: T) => string | number | null | undefined);
  label: string;
}

function escapeCsvValue(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((column) => escapeCsvValue(column.label)).join(",");
  const lines = rows.map((row) =>
    columns
      .map((column) => {
        const value = typeof column.key === "function" ? column.key(row) : row[column.key];
        return escapeCsvValue(value);
      })
      .join(",")
  );
  return [header, ...lines].join("\r\n");
}

/** Client-side only — generates a Blob and triggers a download with no server round-trip or extra dependency. */
export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
