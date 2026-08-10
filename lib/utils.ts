import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function formatDate(value: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = typeof value === "string" ? new Date(value) : value
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  })
}

export function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

const TIME_AGO_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
]

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

export function timeAgo(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value
  const seconds = Math.round((date.getTime() - Date.now()) / 1000)

  for (const [unit, secondsInUnit] of TIME_AGO_UNITS) {
    if (Math.abs(seconds) >= secondsInUnit) {
      return relativeTimeFormatter.format(Math.round(seconds / secondsInUnit), unit)
    }
  }
  return relativeTimeFormatter.format(seconds, "second")
}
