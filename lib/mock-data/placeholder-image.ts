/**
 * Deterministic SVG data-URI placeholders for seed data, so the app never
 * makes an outbound network request for imagery and looks the same on every
 * machine. Real records use this exact data-URI mechanism too — a photo
 * uploaded through the admin UI is read client-side into a base64 data URI
 * by the same `<ImageUpload>` field, so seeded and admin-uploaded photos are
 * indistinguishable to the rest of the app.
 */

const PORTRAIT_PALETTE: Array<[bg: string, fg: string]> = [
  ["#111113", "#EFB508"],
  ["#1B1B1D", "#F3C947"],
  ["#0F0F10", "#D9A400"],
  ["#17181A", "#EFB508"],
];

const COVER_PALETTE: Array<[base: string, accent: string]> = [
  ["#101012", "#EFB508"],
  ["#131315", "#D9A400"],
  ["#0D0D0E", "#F3C947"],
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function toDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateInitialsAvatar(name: string): string {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const hash = hashString(name);
  const [bg, fg] = PORTRAIT_PALETTE[hash % PORTRAIT_PALETTE.length] as [string, string];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
    <rect width="320" height="320" fill="${bg}"/>
    <circle cx="160" cy="160" r="150" fill="none" stroke="${fg}" stroke-opacity="0.25" stroke-width="1.5"/>
    <text x="50%" y="53%" dy=".35em" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="112" fill="${fg}">${escapeXml(initials)}</text>
  </svg>`;

  return toDataUri(svg);
}

export function generateCoverPlaceholder(seed: string, label: string): string {
  const hash = hashString(seed);
  const [base, accent] = COVER_PALETTE[hash % COVER_PALETTE.length] as [string, string];
  const stripeOffset = hash % 320;
  const truncatedLabel = label.length > 42 ? `${label.slice(0, 41)}…` : label;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <rect width="800" height="450" fill="${base}"/>
    <g opacity="0.12" stroke="${accent}" stroke-width="2">
      ${Array.from({ length: 10 })
        .map((_, i) => {
          const x = (i * 90 + stripeOffset) % 900;
          return `<line x1="${x}" y1="0" x2="${x - 220}" y2="450" />`;
        })
        .join("")}
    </g>
    <rect x="0" y="0" width="800" height="450" fill="none" stroke="${accent}" stroke-opacity="0.35" stroke-width="4"/>
    <text x="40" y="392" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="${accent}">${escapeXml(truncatedLabel)}</text>
  </svg>`;

  return toDataUri(svg);
}
