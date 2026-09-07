import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter_Tight } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import RouteProgress from "@/components/RouteProgress";
import ThemeScript from "@/components/ThemeScript";
import { getDictionary, isLocale, locales, type Locale } from "@/i18n/config";
import { getServices, getSettings, getSocials } from "@/lib/api";

/* Two families, clearly distinct: Bricolage carries the headlines with its
   narrow-to-wide axis, Inter Tight keeps body copy compact and legible. */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bricolage",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter-tight",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: { default: dict.meta.title, template: "%s — Neyrosoft" },
    description: dict.meta.description,
    alternates: {
      languages: Object.fromEntries(locales.map((code) => [code, `/${code}`])),
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: locale === "az" ? "az_AZ" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;

  const dict = getDictionary(typedLocale);
  const [settings, services, socials] = await Promise.all([
    getSettings(typedLocale),
    getServices(typedLocale),
    getSocials(typedLocale),
  ]);

  return (
    <html lang={typedLocale} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${bricolage.variable} ${interTight.variable}`}>
        <Providers locale={typedLocale}>
          <a
            href="#main"
            className="bg-signal sr-only px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60]"
          >
            {dict.common.skipToContent}
          </a>
          <RouteProgress />
          <Navbar />
          <main id="main">{children}</main>
          <Footer
            locale={typedLocale}
            settings={settings}
            services={services}
            socials={socials}
          />
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
