import ProtectedRoute from "@/components/protected-route";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAuth={false} redirectTo="/dashboard">
      <div className="flex items-center justify-center min-h-screen">
        {children}
      </div>
    </ProtectedRoute>
  );
}
