"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SiteLogo } from "@/components/layout/site-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";
import { AdminNavList } from "./admin-nav-list";

export function AdminSidebar() {
  const collapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <aside
      className="sticky top-0 hidden h-svh shrink-0 flex-col border-r border-border bg-background transition-[width] duration-150 lg:flex"
      style={{ width: collapsed ? "4.5rem" : "17rem" }}
    >
      <div className="flex h-16 items-center border-b border-border px-4">
        {collapsed ? (
          <Link href="/admin" className="mx-auto flex size-9 items-center justify-center" aria-label="UMU Alumni admin home">
            <Image src="/umu.png" alt="" width={32} height={32} className="size-8" />
          </Link>
        ) : (
          <SiteLogo href="/admin" />
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <AdminNavList collapsed={collapsed} />
      </div>

      <div className="border-t border-border p-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn("w-full", collapsed ? "justify-center" : "justify-start gap-2")}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" aria-hidden="true" />
          ) : (
            <>
              <PanelLeftClose className="size-4" aria-hidden="true" />
              Collapse
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
