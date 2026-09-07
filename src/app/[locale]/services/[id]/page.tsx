import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { excerpt } from "@/components/Cards";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { getService } from "@/lib/api";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale)) return {};
  const service = await getService(locale as Locale, id);
  if (!service) return {};
  return {
    title: service.title,
    description: excerpt(service.description, 155),
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);

  const service = await getService(typedLocale, id);
  if (!service) notFound();

  const paragraphs = service.description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <article className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <Link
        href={`/${typedLocale}/services`}
        className="chip hover:text-body transition-colors"
      >
        {dict.services.backToList}
      </Link>

      <div className="mt-6">
        <h1 className="text-body max-w-3xl text-3xl sm:text-4xl lg:text-5xl">
          {service.title}
        </h1>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
        <div className="prose-body">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <aside className="card h-fit p-6 lg:sticky lg:top-28">
          <p className="text-body text-lg leading-snug">{dict.home.ctaTitle}</p>
          <p className="text-muted mt-2.5 text-sm leading-relaxed">{dict.home.ctaLead}</p>
          <Link href={`/${typedLocale}/calculator`} className="btn btn-primary mt-5 w-full">
            {dict.services.askPrice}
          </Link>
          <Link href={`/${typedLocale}/contact`} className="btn btn-outline mt-3 w-full">
            {dict.home.ctaButton}
          </Link>
        </aside>
      </div>
    </article>
  );
}
