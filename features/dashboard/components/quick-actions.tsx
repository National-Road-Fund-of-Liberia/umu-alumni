import { CalendarPlus, ImagePlus, Newspaper, SquareArrowOutUpRight, UserPlus } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ACTIONS = [
  { label: "Add Alumni", href: "/admin/alumni/new", icon: UserPlus, external: false },
  { label: "Add News Article", href: "/admin/news/new", icon: Newspaper, external: false },
  { label: "Add Event", href: "/admin/events/new", icon: CalendarPlus, external: false },
  { label: "Manage Gallery", href: "/admin/gallery", icon: ImagePlus, external: false },
  { label: "View Public Site", href: "/", icon: SquareArrowOutUpRight, external: true },
] as const;

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {ACTIONS.map((action) => (
            <Link
              key={action.href + action.label}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noopener noreferrer" : undefined}
              className="flex flex-col items-start gap-2 rounded-lg border border-border p-4 transition-colors hover:border-foreground/25 hover:bg-muted/50"
            >
              <action.icon className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">{action.label}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
