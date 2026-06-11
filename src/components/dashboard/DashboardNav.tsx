"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/login/actions";

type Labels = {
  title: string;
  overview: string;
  assignments: string;
  availability: string;
  signOut: string;
  viewSite: string;
};

export default function DashboardNav({
  email,
  isSitter,
  labels,
}: {
  email: string | null;
  isSitter: boolean;
  labels: Labels;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: labels.overview, exact: true },
    ...(isSitter
      ? [
          { href: "/dashboard/sitter", label: labels.assignments },
          { href: "/dashboard/availability", label: labels.availability },
        ]
      : []),
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="flex w-full flex-col border-b border-gray-200 bg-white md:h-screen md:w-60 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2 px-5 py-4 font-bold text-brand-700">
        <span className="text-2xl" aria-hidden>
          🐾
        </span>
        <span>{labels.title}</span>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:pb-0">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={[
              "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition",
              isActive(link.href, link.exact)
                ? "bg-brand-100 text-brand-800"
                : "text-gray-600 hover:bg-gray-100",
            ].join(" ")}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto hidden border-t border-gray-200 px-5 py-4 md:block">
        <p className="truncate text-xs text-gray-500">{email}</p>
        <form action={signOut} className="mt-2">
          <button
            type="submit"
            className="text-sm font-medium text-gray-600 hover:text-red-600"
          >
            {labels.signOut}
          </button>
        </form>
        <Link
          href="/"
          className="mt-2 block text-xs text-gray-400 hover:text-brand-600"
        >
          {labels.viewSite}
        </Link>
      </div>
    </aside>
  );
}
