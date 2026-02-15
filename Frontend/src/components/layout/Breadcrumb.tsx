"use client";

import { usePathname } from "next/navigation";
import { BreadcrumbPage } from "../ui/breadcrumb";

function getBreadcrumbTitle(pathname: string) {

  const ROUTE_TITLES: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/boards": "My Boards",
    "/joined": "My Joined Boards",
    "/settings": "Settings",
  };

  return ROUTE_TITLES[pathname] ?? "Dashboard";
}

export default function BreadcrumbPageClient() {
  const pathname = usePathname();

  const title = getBreadcrumbTitle(pathname);

  return (
    <BreadcrumbPage>
      {title}
    </BreadcrumbPage>
  );
}
