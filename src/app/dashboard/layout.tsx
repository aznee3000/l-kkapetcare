import { requireUser, getOwnSitterProfile, getCurrentProfile } from "@/lib/auth";
import { getTranslations } from "@/lib/i18n";
import DashboardNav from "@/components/dashboard/DashboardNav";

// Guards the whole /dashboard route group. Buyers and sitters both land here;
// the nav adapts based on whether the user owns a sitter profile.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const [profile, sitter, { t }] = await Promise.all([
    getCurrentProfile(),
    getOwnSitterProfile(),
    getTranslations(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <DashboardNav
        email={profile?.email ?? user.email ?? null}
        isSitter={sitter?.status === "approved"}
        labels={{
          title: t.dashboard.title,
          overview: t.dashboard.overview,
          assignments: t.dashboard.myAssignments,
          availability: t.dashboard.availability,
          signOut: t.dashboard.signOut,
          viewSite: t.dashboard.viewSite,
        }}
      />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
