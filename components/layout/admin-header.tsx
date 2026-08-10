"use client";

import { Menu, Search, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useUiStore } from "@/store/ui-store";
import { AdminBreadcrumbs } from "./admin-breadcrumbs";
import { AdminNavList } from "./admin-nav-list";
import { AdminProfileMenu } from "./admin-profile-menu";
import { SiteLogo } from "./site-logo";

interface AdminHeaderProps {
  displayName: string;
  username: string;
  avatarUrl: string | null;
}

export function AdminHeader({ displayName, username, avatarUrl }: AdminHeaderProps) {
  const setCommandPaletteOpen = useUiStore((state) => state.setCommandPaletteOpen);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background px-4 sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button type="button" variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
            <Menu className="size-5" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle className="text-left">
              <SiteLogo href="/admin" />
            </SheetTitle>
          </SheetHeader>
          <div className="px-3">
            <AdminNavList />
          </div>
        </SheetContent>
      </Sheet>

      <Separator orientation="vertical" className="hidden h-6 lg:block" />

      <div className="hidden lg:block">
        <AdminBreadcrumbs />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="flex h-8 items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
        >
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Search or jump to…</span>
          <kbd className="hidden items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
            ⌘K
          </kbd>
        </button>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild type="button" variant="ghost" size="icon" aria-label="View public site">
                <Link href="/" target="_blank" rel="noopener noreferrer">
                  <SquareArrowOutUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>View public site</TooltipContent>
          </Tooltip>
          <AdminProfileMenu displayName={displayName} username={username} avatarUrl={avatarUrl} />
        </div>
      </div>
    </header>
  );
}
