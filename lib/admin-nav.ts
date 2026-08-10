import {
  BarChart3,
  CalendarDays,
  History,
  Image as ImageIcon,
  LayoutDashboard,
  Newspaper,
  Settings,
  ShieldCheck,
  UserCircle,
  Users,
  Landmark,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface AdminNavSection {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavSection[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { label: "Alumni", href: "/admin/alumni", icon: Users },
      { label: "News", href: "/admin/news", icon: Newspaper },
      { label: "Events", href: "/admin/events", icon: CalendarDays },
      { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
      { label: "Executive Committee", href: "/admin/committee", icon: Landmark },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Users", href: "/admin/users", icon: UserCircle },
      { label: "Roles", href: "/admin/roles", icon: ShieldCheck },
      { label: "Reports", href: "/admin/reports", icon: BarChart3 },
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Audit Log", href: "/admin/audit-log", icon: History },
    ],
  },
];

export const ADMIN_NAV_FLAT: AdminNavItem[] = ADMIN_NAV.flatMap((section) => section.items);

/** Longest-prefix match so /admin/alumni/new resolves to the "Alumni" item. */
export function findActiveNavItem(pathname: string): AdminNavItem | undefined {
  return [...ADMIN_NAV_FLAT]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => (item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)));
}
