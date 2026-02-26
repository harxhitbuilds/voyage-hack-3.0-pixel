"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as UiSidebar,
  useSidebar,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { getSidebarConfig } from "@/config/sidebar";
import { useAuthStore } from "@/store/auth.store";

import Logo from "../global/assets/logo";
import { Button } from "../ui/button";

export default function Sidebar() {
  const { logout, user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const sidebarConfig = getSidebarConfig(user);

  const { open } = useSidebar();

  const handleLogout = async () => {
    setIsLoading(true);
    toast.info("Logging you out...");
    await logout();
    setIsLoading(false);
  };

  return (
    <UiSidebar
      collapsible="icon"
      className="bg-background border-r border-white/5"
    >
      <SidebarHeader className="flex items-center py-8 group-data-[state=collapsed]:justify-center">
        {open && <Logo />}
      </SidebarHeader>

      <SidebarContent className="p">
        {sidebarConfig.sections.map((section: any) => (
          <SidebarGroup key={section.label} className="py-2">
            <SidebarGroupLabel className="mb-2 text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
              {section.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {section.links.map((item: any) => {
                const isActive = pathname === item.link;
                const requiresAuth =
                  item.requiresAuth ||
                  (item.link &&
                    item.link.toString().toLowerCase().includes("profile")) ||
                  (item.label &&
                    item.label.toString().toLowerCase().includes("profile"));

                if (requiresAuth && !isAuthenticated) {
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        isActive={false}
                        tooltip={item.label}
                        className="cursor-not-allowed py-5 opacity-30 grayscale"
                        aria-disabled="true"
                        tabIndex={-1}
                      >
                        {item.icon}
                        <span className="text-xs">{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.label}>
                    <Link href={item.link} passHref className="w-full">
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.label}
                        className={`mb-1 cursor-pointer rounded-md py-5 transition-all duration-200 ${
                          isActive
                            ? "bg-white text-black hover:bg-zinc-200"
                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        } `}
                      >
                        <div className={isActive ? "" : ""}>{item.icon}</div>
                        <span className="text-xs font-medium">
                          {item.label}
                        </span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-white/5 p-4">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex h-auto w-full cursor-pointer items-center justify-start gap-3 border border-transparent p-2 transition-all"
              >
                <div className="relative">
                  <Image
                    src={user?.profile || "/avatar.png"}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full border border-white/10"
                  />
                  <div className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[#0a0a0a] bg-green-500" />
                </div>
                <div className="min-w-0 text-left group-data-[state=collapsed]:hidden">
                  <p className="truncate text-xs font-bold text-white">
                    {user?.name || "User"}
                  </p>
                  <p className="truncate text-[10px] text-zinc-500">
                    @{user?.username || user?.email?.split("@")[0] || "user"}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 border-white/10 bg-[#0f0f0f] text-white"
              side="top"
              align="start"
            >
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-400 focus:bg-red-400/10 focus:text-red-400"
              >
                {isLoading ? (
                  <Spinner className="h-4 w-4 animate-spin" />
                ) : (
                  "Logout"
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          open && (
            <div className="py-2">
              <Link href="/auth">
                <Button className="w-full cursor-pointer rounded-md bg-white text-xs font-bold text-black hover:bg-zinc-200">
                  Login
                </Button>
              </Link>
            </div>
          )
        )}
      </SidebarFooter>
    </UiSidebar>
  );
}
