import { notFound } from "next/navigation";

import { ServiceCard } from "@/components/Cards";
import SectionHeading from "@/components/SectionHeading";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { getServices } from "@/lib/api";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);
  const services = await getServices(typedLocale);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <SectionHeading as="h1" title={dict.services.title} lead={dict.services.lead} />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            locale={typedLocale}
            readMore={dict.services.readMore}
          />
        ))}
      </div>
    </div>
  );
}
