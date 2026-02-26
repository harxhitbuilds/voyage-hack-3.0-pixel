import { AuthProvider } from "@/providers/auth.provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        {children}
      </div>
    </AuthProvider>
  );
}
