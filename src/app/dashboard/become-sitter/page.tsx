import { redirect } from "next/navigation";
import {
  requireUser,
  getOwnSitterProfile,
  getCurrentProfile,
} from "@/lib/auth";
import { getTranslations } from "@/lib/i18n";
import SitterForm from "@/components/forms/SitterForm";

export const dynamic = "force-dynamic";

export default async function DashboardBecomeSitterPage() {
  const user = await requireUser();
  // Already applied / is a sitter → show their status on the overview instead.
  const existing = await getOwnSitterProfile();
  if (existing) redirect("/dashboard");

  const { t } = await getTranslations();
  const profile = await getCurrentProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t.sitter.pageTitle}
        </h1>
        <p className="mt-1 text-gray-600">{t.sitter.pageIntro}</p>
      </div>
      <SitterForm
        defaults={{
          fullName: profile?.full_name ?? undefined,
          email: profile?.email ?? user.email ?? undefined,
        }}
      />
    </div>
  );
}
