import { requireAdmin } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

// Guards the whole /admin route group. requireAdmin() redirects to /login if
// the visitor is not an authenticated admin.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <AdminNav email={admin.email} />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
