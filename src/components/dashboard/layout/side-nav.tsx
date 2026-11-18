"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { config } from "@/config";
import { paths } from "@/paths";

import { navItems } from "./nav-config";

export function AppSidebar({ allowedHrefs }: { allowedHrefs: string[] }) {
  const pathname = usePathname();
  const items = navItems.filter((item) => allowedHrefs.includes(item.href));

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href={paths.dashboard.overview}
          className="flex items-center gap-2 px-2 py-1.5 font-semibold"
        >
          <Image
            src="/assets/comlinked-logo.png"
            alt={config.site.name}
            width={120}
            height={24}
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
