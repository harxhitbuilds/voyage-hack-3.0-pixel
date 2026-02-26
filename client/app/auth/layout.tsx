import { AuthProvider } from "@/providers/auth.provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen w-screen bg-black">{children}</div>
    </AuthProvider>
  );
}
