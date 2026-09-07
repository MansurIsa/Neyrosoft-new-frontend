import Link from "next/link";

import { getDictionary, type Locale } from "@/i18n/config";
import type { Service, SiteSettings, SocialLink } from "@/lib/types";

import BackToTop from "./BackToTop";
import { IconMail, IconPhone, IconPin, SocialIcon } from "./Icons";
import Logo from "./Logo";

export default function Footer({
  locale,
  settings,
  services,
  socials,
}: {
  locale: Locale;
  settings: SiteSettings | null;
  services: Service[];
  socials: SocialLink[];
}) {
  const dict = getDictionary(locale);
  const href = (path: string) => `/${locale}${path === "/" ? "" : path}`;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 px-3 pb-4 sm:px-5">
      <div className="bg-surface border-line shadow-card mx-auto max-w-6xl rounded-[28px] border px-6 py-12 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          <div>
            <Link href={href("/")} aria-label="Neyrosoft">
              <Logo size={34} />
            </Link>
            <p className="text-muted mt-4 max-w-xs text-sm leading-relaxed">
              {dict.footer.tagline}
            </p>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-2">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.title}
                    className="bg-surface-2 text-muted hover:bg-signal-soft hover:text-signal flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                  >
                    <SocialIcon name={social.icon || social.title} width={18} height={18} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <nav aria-labelledby="footer-links">
            <h3 id="footer-links" className="text-body mb-4 text-sm font-semibold">
              {dict.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {(["about", "services", "projects", "blog", "contact"] as const).map((key) => (
                <li key={key}>
                  <Link
                    href={href(`/${key}`)}
                    className="text-muted hover:text-signal transition-colors"
                  >
                    {dict.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-services">
            <h3 id="footer-services" className="text-body mb-4 text-sm font-semibold">
              {dict.footer.servicesTitle}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link
                    href={href(`/services/${service.id}`)}
                    className="text-muted hover:text-signal line-clamp-1 transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-body mb-4 text-sm font-semibold">
              {dict.footer.contactTitle}
            </h3>
            <ul className="text-muted space-y-3 text-sm">
              {settings?.tel_number && (
                <li className="flex items-start gap-2.5">
                  <IconPhone width={17} height={17} className="mt-px shrink-0" />
                  <a
                    href={`tel:${settings.tel_number.replace(/\s/g, "")}`}
                    className="hover:text-signal transition-colors"
                  >
                    {settings.tel_number}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-start gap-2.5">
                  <IconMail width={17} height={17} className="mt-px shrink-0" />
                  <a
                    href={`mailto:${settings.email}`}
                    className="hover:text-signal transition-colors"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.location && (
                <li className="flex items-start gap-2.5">
                  <IconPin width={17} height={17} className="mt-px shrink-0" />
                  <span>{settings.location}</span>
                </li>
              )}
            </ul>
            <Link href={href("/calculator")} className="btn btn-primary mt-6 w-full">
              {dict.nav.calculator}
            </Link>
          </div>
        </div>

        <div className="border-line mt-10 flex flex-col items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center">
          <p className="text-muted text-xs">
            © {year} Neyrosoft. {dict.footer.rights}
          </p>
          <BackToTop label={dict.footer.backToTop} />
        </div>
      </div>
    </footer>
  );
}
