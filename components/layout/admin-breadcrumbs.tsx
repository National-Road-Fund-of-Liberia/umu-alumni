"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { findActiveNavItem } from "@/lib/admin-nav";

function segmentLabel(segment: string): string {
  if (segment === "new") return "New";
  if (/^[0-9a-f-]{8,}$/i.test(segment)) return "Edit";
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function AdminBreadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/admin") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const activeItem = findActiveNavItem(pathname);
  const trailingSegments = activeItem
    ? pathname.slice(activeItem.href.length).split("/").filter(Boolean)
    : [];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/admin">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {activeItem && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {trailingSegments.length > 0 ? (
                <BreadcrumbLink asChild>
                  <Link href={activeItem.href}>{activeItem.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{activeItem.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}
        {trailingSegments.map((segment, index) => (
          <Fragment key={segment}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === trailingSegments.length - 1 ? (
                <BreadcrumbPage>{segmentLabel(segment)}</BreadcrumbPage>
              ) : (
                segmentLabel(segment)
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
