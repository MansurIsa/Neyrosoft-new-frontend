import Image from "next/image";
import Link from "next/link";

import { getDictionary, type Locale } from "@/i18n/config";
import { mediaUrl } from "@/lib/api";
import type { Banner, SiteSettings } from "@/lib/types";

import { IconArrowRight, IconAward, IconCheck, IconPhone } from "./Icons";
import { LogoMark } from "./Logo";

/**
 * The trace behind the image is the shape from the logo — a circuit leaving the
 * cog, turning at right angles, ending on a live node. It draws itself once on
 * load; nothing else on the page moves unless the visitor does something.
 */
function CircuitTrace() {
  return (
    <svg
      viewBox="0 0 460 340"
      className="text-line-strong h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path
          className="animate-trace"
          style={{ ["--trace-length" as string]: "820" }}
          d="M6 56h140a14 14 0 0114 14v52a14 14 0 0014 14h96a14 14 0 0014-14V70a14 14 0 0114-14h140"
        />
        <path
          className="animate-trace"
          style={{ ["--trace-length" as string]: "620", animationDelay: "150ms" }}
          d="M6 170h84a14 14 0 0114 14v112a14 14 0 0014 14h250"
        />
        <path
          className="animate-trace"
          style={{ ["--trace-length" as string]: "430", animationDelay: "300ms" }}
          d="M64 6v46a14 14 0 0014 14h116a14 14 0 0114 14v54"
        />
      </g>

      {[
        [146, 56],
        [274, 70],
        [104, 184],
        [368, 310],
        [208, 134],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill="currentColor" opacity="0.5" />
      ))}
      <circle cx="426" cy="56" r="6" fill="var(--signal)" className="animate-node" />
    </svg>
  );
}

export default function Hero({
  locale,
  banner,
  settings,
}: {
  locale: Locale;
  banner: Banner | null;
  settings: SiteSettings | null;
}) {
  const dict = getDictionary(locale);
  const href = (path: string) => `/${locale}${path}`;

  // CMS copy wins; the dictionary covers a cold start.
  const title = banner?.title || dict.home.heroTitle;
  const lead = banner?.description || dict.home.heroLead;
  const image = mediaUrl(banner?.image);

  const secondStat =
    settings && settings.about_count_second > 0
      ? { value: settings.about_count_second, label: settings.about_count_second_title }
      : null;

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[62%] opacity-45 lg:block"
        aria-hidden="true"
      >
        <CircuitTrace />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pt-12 pb-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:px-8 lg:pt-20 lg:pb-24">
        <div className="flex flex-col justify-center">
          <span className="chip w-fit">
            <span className="bg-signal h-1.5 w-1.5 rounded-full" aria-hidden="true" />
            {dict.home.eyebrow}
          </span>

          <h1 className="text-body mt-5 max-w-[16ch] text-[2.125rem] leading-[1.08] sm:text-[2.75rem] lg:text-[3.375rem]">
            {title}
          </h1>

          <p className="text-muted mt-5 max-w-lg text-lg leading-relaxed">{lead}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={href("/calculator")} className="btn btn-primary">
              {dict.home.heroPrimary}
              <IconArrowRight width={17} height={17} />
            </Link>
            {settings?.tel_number ? (
              <a
                href={`tel:${settings.tel_number.replace(/\s/g, "")}`}
                className="btn btn-ink"
              >
                <IconPhone width={17} height={17} />
                {dict.home.heroCall}
              </a>
            ) : (
              <Link href={href("/projects")} className="btn btn-outline">
                {dict.home.heroSecondary}
              </Link>
            )}
          </div>

          <p className="text-muted mt-5 inline-flex items-center gap-2 text-sm">
            <IconCheck width={15} height={15} className="text-signal" />
            {dict.home.heroNote}
          </p>
        </div>

        <div className="relative min-h-[300px] lg:min-h-[400px]">
          <div className="card relative h-full w-full overflow-hidden lg:absolute lg:inset-y-4 lg:right-0 lg:w-[88%]">
            {image ? (
              <Image
                src={image}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 460px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="bg-surface-2 flex h-full items-center justify-center">
                <LogoMark size={92} />
              </div>
            )}
          </div>

          {/* A small stat card overlapping the image, so the corner isn't empty. */}
          {secondStat && (
            <div className="card absolute bottom-0 left-0 hidden items-center gap-3 px-5 py-4 lg:flex">
              <span className="icon-plate h-11 w-11">
                <IconAward width={22} height={22} />
              </span>
              <span>
                <span className="text-body font-display block text-2xl leading-none font-bold">
                  {secondStat.value}+
                </span>
                <span className="text-muted mt-1 block text-xs">
                  {secondStat.label}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
