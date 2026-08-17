export const SITE_NAME = "United Methodist University Alumni Association";
export const SITE_SHORT_NAME = "UMU Alumni";
export const UNIVERSITY_NAME = "United Methodist University";
export const SITE_DESCRIPTION =
  "The official home for United Methodist University alumni.";

export const MISSION_STATEMENT =
  "To establish and maintain good workings and partnership with the United Methodist University through diverse professional institutional development and to encourage high educational standards.";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/committee", label: "Executive Committee" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
] as const;

// A deliberately shorter list than NAV_LINKS — the footer is a wayfinding
// aid, not a mirror of the primary nav.
export const FOOTER_NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const CONTACT_EMAIL = "alumni@umu.edu.lr";
export const CONTACT_PHONE = "+231 777100735";
export const CONTACT_ADDRESS = "United Methodist University, Camp Johnson Road, Monrovia, Liberia";
