import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { getTranslations } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { Analytics } from '@vercel/analytics/next';

const sans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return {
    title: t.meta.homeTitle,
    description: t.meta.homeDescription,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { locale, t } = await getTranslations();

  return (
    <html lang={locale}>
      <body className={`${sans.variable} font-sans`}>
        <I18nProvider locale={locale} dict={t}>
          {children}
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
