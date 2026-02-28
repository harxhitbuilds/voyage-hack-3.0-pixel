"use client";

import { usePathname } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

import ModeToggle from "../theme/mode-toggle";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

const pageLabels: Record<string, string> = {
  home: "Dashboard",
  trips: "Trips",
  experience: "Heritage Explorer",
  profile: "Profile",
  "ar-studio": "AR Studio",
  trip: "Trip Detail",
};

export default function Topbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const segments = pathname.split("/").filter(Boolean);
  const currentKey = segments[segments.length - 1] || "home";
  const currentLabel = pageLabels[currentKey] || currentKey.replace(/-/g, " ");
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "N";

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-white/5 bg-white px-4 backdrop-blur-xl dark:bg-black">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-zinc-500 transition-colors hover:bg-white/5 hover:text-white" />
        <Separator orientation="vertical" className="h-4 bg-white/8" />
        <nav className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide">
          <span className="text-zinc-700">Nimbus</span>
          <span className="text-zinc-800">/</span>
          <span className="text-zinc-300 capitalize">{currentLabel}</span>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {/* User avatar */}
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/8 text-[11px] font-black text-zinc-300 select-none">
          {initials}
        </div>
      </div>
    </header>
  );
}
