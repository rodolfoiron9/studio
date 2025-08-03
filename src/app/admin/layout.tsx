
"use client";

import * as React from "react";
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Home, Settings, Database, Palette, KeyRound, Film, Image, Megaphone, Link as LinkIcon, Folder, Shapes } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "Public Site", icon: <Home />, isActive: pathname === "/" },
    { href: "/admin", label: "Dashboard", icon: <Settings />, isActive: pathname === "/admin" },
    { href: "/admin/presets", label: "Presets", icon: <Shapes />, isActive: pathname.startsWith("/admin/presets") },
    { href: "/admin/database", label: "Data Management", icon: <Database />, isActive: pathname.startsWith("/admin/database") },
    { href: "/admin/file-management", label: "File Management", icon: <Folder />, isActive: pathname.startsWith("/admin/file-management") },
    { href: "/admin/ui-customization", label: "UI Customization", icon: <Palette />, isActive: pathname.startsWith("/admin/ui-customization") },
    { href: "/admin/api-keys", label: "API Keys", icon: <KeyRound />, isActive: pathname.startsWith("/admin/api-keys") },
    { href: "/admin/video-tuning", label: "Veo Fine-Tuning", icon: <Film />, isActive: pathname.startsWith("/admin/video-tuning") },
    { href: "/admin/album-art", label: "Album Art", icon: <Image />, isActive: pathname.startsWith("/admin/album-art") },
    { href: "/admin/marketing", label: "Marketing Agent", icon: <Megaphone />, isActive: pathname.startsWith("/admin/marketing") },
    { href: "/admin/link-importer", label: "Link Importer", icon: <LinkIcon />, isActive: pathname.startsWith("/admin/link-importer") },
  ]

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
             <SidebarTrigger />
             <h2 className="font-headline text-lg font-semibold group-data-[collapsible=icon]:hidden">Admin Panel</h2>
          </div>
        </SiderbarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
               <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.label}>
                  <Link href={item.href}>
                    {item.icon}
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
