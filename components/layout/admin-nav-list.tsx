"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

interface AdminNavListProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function AdminNavList({ collapsed = false, onNavigate }: AdminNavListProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex flex-col gap-5">
      {ADMIN_NAV.map((section) => (
        <div key={section.label}>
          {!collapsed && (
            <h2 className="px-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              {section.label}
            </h2>
          )}
          <ul className={cn("flex flex-col gap-0.5", !collapsed && "mt-2")}>
            {section.items.map((item) => {
              const isActive =
                item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

              const link = (
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center px-0 py-2",
                    isActive && "bg-muted text-foreground"
                  )}
                >
                  <item.icon className="size-4 shrink-0" aria-hidden="true" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );

              return (
                <li key={item.href}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  ) : (
                    link
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
