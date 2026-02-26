"use client";

import { usePathname, useRouter } from "next/navigation";

import { useEffect } from "react";

import { useAuthStore } from "@/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initializeAuthListener, checkingAuth, isAuthenticated } =
    useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = initializeAuthListener();
    return () => unsubscribe && unsubscribe();
  }, [initializeAuthListener]);

  useEffect(() => {
    if (!checkingAuth) {
      if (isAuthenticated) {
        if (pathname === "/auth") {
          router.push("/home");
        }
        const user = useAuthStore.getState().user;
        if (user && !user.onBoarded && pathname !== "/on-board") {
          router.replace("/on-board");
        }
        if (user && user.onBoarded && pathname === "/on-board") {
          router.replace("/home");
        }
      } else {
        const protectedRoutes = ["/home", "/on-board"];
        if (protectedRoutes.some((route) => pathname.startsWith(route))) {
          router.push("/auth");
        }
      }
    }
  }, [isAuthenticated, checkingAuth, pathname, router]);

  if (checkingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}
