import Image from "next/image";
import { notFound } from "next/navigation";

import Counters from "@/components/Counters";
import SectionHeading from "@/components/SectionHeading";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { getSettings, mediaUrl } from "@/lib/api";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);
  const settings = await getSettings(typedLocale);

  const image = mediaUrl(settings?.about_image);
  const pillars = settings
    ? [
        {
          label: dict.about.missionLabel,
          title: settings.our_mission_title,
          body: settings.our_mission_description,
        },
        {
          label: dict.about.visionLabel,
          title: settings.our_view_title,
          body: settings.our_view_description,
        },
        {
          label: dict.about.valuesLabel,
          title: settings.our_values_title,
          body: settings.our_values_description,
        },
      ].filter((pillar) => pillar.body)
    : [];

  const stats = settings
    ? [
        { value: settings.about_count_first, label: settings.about_count_first_title },
        { value: settings.about_count_second, label: settings.about_count_second_title },
        { value: settings.about_count_third, label: settings.about_count_third_title },
        { value: settings.about_count_fourth, label: settings.about_count_fourth_title },
      ]
    : [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <SectionHeading
        as="h1"
        title={settings?.about_big_title || dict.about.title}
        lead={settings?.about_small_title}
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        <div className="prose-body">
          {(settings?.about_description ?? "")
            .split(/\n{2,}|\r\n\r\n/)
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
        </div>
        {image && (
          <div className="card relative aspect-4/3 overflow-hidden lg:aspect-auto lg:min-h-[320px]">
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 440px"
              className="object-cover"
            />
          </div>
        )}
      </div>

      {stats.length > 0 && (
        <div className="mt-20">
          <Counters stats={stats} />
        </div>
      )}

      {pillars.length > 0 && (
        <div className="mt-20 grid gap-5 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.label} className="card p-6">
              <p className="chip text-signal bg-signal-soft">{pillar.label}</p>
              <h2 className="text-body mt-4 text-xl">{pillar.title}</h2>
              <p className="text-muted mt-3 text-[0.9375rem] leading-relaxed">
                {pillar.body}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
