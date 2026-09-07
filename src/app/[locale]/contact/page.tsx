import { notFound } from "next/navigation";

import ContactForm from "@/components/ContactForm";
import { IconClock, IconMail, IconPhone, IconPin } from "@/components/Icons";
import SectionHeading from "@/components/SectionHeading";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { getSettings } from "@/lib/api";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);
  const settings = await getSettings(typedLocale);

  const details = [
    settings?.tel_number && {
      icon: <IconPhone width={18} height={18} />,
      label: dict.contact.phoneLabel,
      value: settings.tel_number,
      href: `tel:${settings.tel_number.replace(/\s/g, "")}`,
    },
    settings?.email && {
      icon: <IconMail width={18} height={18} />,
      label: dict.contact.emailLabel,
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    settings?.location && {
      icon: <IconPin width={18} height={18} />,
      label: dict.contact.addressLabel,
      value: settings.location,
      href: null,
    },
    {
      icon: <IconClock width={18} height={18} />,
      label: dict.contact.hoursLabel,
      value: settings?.working_hours || dict.contact.hoursValue,
      href: null,
    },
  ].filter(Boolean) as {
    icon: React.ReactNode;
    label: string;
    value: string;
    href: string | null;
  }[];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <SectionHeading
        as="h1"
        title={dict.contact.title}
        lead={settings?.contact_description || dict.contact.lead}
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        <div className="space-y-3">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="card flex items-start gap-4 p-5"
            >
              <span className="icon-plate h-11 w-11">{detail.icon}</span>
              <div className="min-w-0">
                <p className="text-muted text-sm">{detail.label}</p>
                {detail.href ? (
                  <a
                    href={detail.href}
                    className="text-body hover:text-signal mt-1 block break-words font-medium transition-colors"
                  >
                    {detail.value}
                  </a>
                ) : (
                  <p className="text-body mt-1 font-medium">{detail.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <ContactForm />
      </div>

      {settings?.map_embed_url && (
        <div className="card mt-12 overflow-hidden">
          <iframe
            src={settings.map_embed_url}
            title={dict.contact.addressLabel}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[380px] w-full"
          />
        </div>
      )}
    </div>
  );
}
