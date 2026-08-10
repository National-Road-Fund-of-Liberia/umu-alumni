"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROGRAMS } from "@/types/alumni";

interface AlumniFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  program: string;
  onProgramChange: (value: string) => void;
  year: string;
  onYearChange: (value: string) => void;
  years: number[];
}

export function AlumniFilters({
  search,
  onSearchChange,
  program,
  onProgramChange,
  year,
  onYearChange,
  years,
}: AlumniFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Search by name, occupation, or organization…"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-10 pl-9"
          aria-label="Search the alumni directory"
        />
      </div>
      <Select value={program} onValueChange={onProgramChange}>
        <SelectTrigger className="h-10 w-full sm:w-56" aria-label="Filter by program">
          <SelectValue placeholder="All Programs" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Programs</SelectItem>
          {PROGRAMS.map((program_) => (
            <SelectItem key={program_} value={program_}>
              {program_}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={year} onValueChange={onYearChange}>
        <SelectTrigger className="h-10 w-full sm:w-36" aria-label="Filter by graduation year">
          <SelectValue placeholder="All Years" />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          <SelectItem value="all">All Years</SelectItem>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
