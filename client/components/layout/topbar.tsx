"use client";

import { usePathname } from "next/navigation";

import ModeToggle from "../theme/mode-toggle";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

export default function Topbar() {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);
  const currentPage = pathSegments[pathSegments.length - 1] || "Home";

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-white/5 px-4 backdrop-blur-md transition-all">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-400 transition-colors hover:bg-white/5 hover:text-white" />

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
              Nimbus
            </span>
            <span className="text-zinc-700">/</span>
            <span className="text-[10px] font-bold tracking-widest text-zinc-300 capitalize">
              {currentPage.replace("-", " ")}
            </span>
          </div>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
