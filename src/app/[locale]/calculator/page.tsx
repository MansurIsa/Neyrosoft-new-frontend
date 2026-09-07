import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Calculator from "@/components/Calculator";
import SectionHeading from "@/components/SectionHeading";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale as Locale);
  return { title: dict.calculator.title, description: dict.calculator.lead };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <SectionHeading as="h1" title={dict.calculator.title} lead={dict.calculator.lead} />
      <div className="mt-12">
        <Calculator />
      </div>
    </div>
  );
}
