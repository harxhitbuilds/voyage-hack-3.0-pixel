import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/providers/auth.provider";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full flex-col">
          <div className="flex flex-1">
            <Sidebar />
            <SidebarInset className="flex flex-1 flex-col">
              <Topbar />
              <main className="flex-1  ">{children}</main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
