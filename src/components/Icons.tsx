import type { ReactElement, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/**
 * One consistent icon set: 24px grid, 1.9 stroke, round caps and joins, with a
 * few filled accents. Thin hairline icons looked washed out on the cards, so
 * everything here is drawn heavier and sits inside an `.icon-plate`.
 */
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  width: 22,
  height: 22,
};

/* ---------- interface ---------- */

export function IconMenu(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </svg>
  );
}

export function IconSun(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
    </svg>
  );
}

export function IconMoon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M20.5 14.2A8.7 8.7 0 019.8 3.5 8.7 8.7 0 1020.5 14.2z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function IconGlobe(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M3.2 12h17.6M12 3.2c2.4 2.7 2.4 15.1 0 17.6M12 3.2c-2.4 2.7-2.4 15.1 0 17.6" />
    </svg>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9.5l6 6 6-6" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconArrowUp(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 19.5V5M5.5 11.5L12 5l6.5 6.5" />
    </svg>
  );
}

export function IconExternal(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 4.5h5.5V10M19.5 4.5L11 13" />
      <path d="M18 14.5V18a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h3.5" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2.4} {...props}>
      <path d="M4.5 12.5l5 5L19.5 7" />
    </svg>
  );
}

export function IconChat(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21 11.5a8 8 0 01-8.5 8L7 21.5l.6-3.2A8 8 0 1121 11.5z" />
      <path d="M9 10.5h6.5M9 14h4" />
    </svg>
  );
}

export function IconSend(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20.5 3.5L10 14M20.5 3.5l-6.6 17.2-3.9-6.7-6.7-3.9L20.5 3.5z" />
    </svg>
  );
}

/* ---------- contact ---------- */

export function IconPhone(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 3.5h-2A1.5 1.5 0 003 5.2 16.8 16.8 0 0018.8 21a1.5 1.5 0 001.7-1.5v-2a1.3 1.3 0 00-1-1.3l-3-.7a1.3 1.3 0 00-1.3.5l-.9 1.2a13 13 0 01-5.5-5.5l1.2-.9a1.3 1.3 0 00.5-1.3l-.7-3a1.3 1.3 0 00-1.3-1z" />
    </svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.8" y="5" width="18.4" height="14" rx="3" />
      <path d="M3.5 7.5l7.4 5.2a2 2 0 002.2 0l7.4-5.2" />
    </svg>
  );
}

export function IconPin(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21.5s7.3-6.6 7.3-11.3a7.3 7.3 0 10-14.6 0C4.7 14.9 12 21.5 12 21.5z" />
      <circle cx="12" cy="10" r="2.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M12 6.8V12l3.6 2.2" />
    </svg>
  );
}

export function IconAward(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="9" r="6.2" />
      <path d="M8.4 14.2L7 21.5l5-2.4 5 2.4-1.4-7.3" />
    </svg>
  );
}

export function IconStar({
  filled = false,
  ...props
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      {...base}
      strokeWidth={1.6}
      fill={filled ? "currentColor" : "none"}
      width={15}
      height={15}
      {...props}
    >
      <path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
    </svg>
  );
}

export function IconEye(props: IconProps) {
  return (
    <svg {...base} width={15} height={15} {...props}>
      <path d="M2.2 12S5.6 5.8 12 5.8 21.8 12 21.8 12 18.4 18.2 12 18.2 2.2 12 2.2 12z" />
      <circle cx="12" cy="12" r="3.1" />
    </svg>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <svg {...base} width={15} height={15} {...props}>
      <rect x="3.2" y="5" width="17.6" height="16" rx="3" />
      <path d="M3.2 9.8h17.6M8 3v4M16 3v4" />
    </svg>
  );
}

/* ---------- project types (calculator + service cards) ---------- */

export function IconLayout(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M3 9h18" />
      <circle cx="6.2" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
      <path d="M7 13h10M7 16.5h6" />
    </svg>
  );
}

export function IconBuilding(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20.5V5a2 2 0 012-2h7a2 2 0 012 2v15.5" />
      <path d="M15 9.5h3a2 2 0 012 2v9M2.5 20.5h19" />
      <path d="M7.5 7.5h4M7.5 11.5h4M7.5 15.5h4" />
    </svg>
  );
}

export function IconCart(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.8 3.5h2.4l2.4 11.2h9.6l2-8H6" />
      <circle cx="9.2" cy="19.2" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="16.8" cy="19.2" r="1.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconPhoneApp(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="2.2" width="12" height="19.6" rx="3" />
      <path d="M10.2 5.3h3.6" />
      <circle cx="12" cy="18.3" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconGrid(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2.2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.2" />
    </svg>
  );
}

export function IconCode(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8.5 7L4 12l4.5 5M15.5 7l4.5 5-4.5 5M13.6 4.5l-3.2 15" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7.2" />
      <path d="M16.4 16.4l4.4 4.4" />
    </svg>
  );
}

export function IconPalette(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3a9 9 0 000 18c1.4 0 2-1 2-1.8 0-1.6-1.6-1.7-1.6-3 0-.9.8-1.7 1.8-1.7h1.6A5.2 5.2 0 0021 9.3C21 5.7 17 3 12 3z" />
      <circle cx="7.6" cy="11.4" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="10.4" cy="7.4" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15.4" cy="7.8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconCard(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="3" />
      <path d="M2.5 9.8h19M6 15h3.5" />
    </svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.8l7.5 3v5.8c0 4.6-3.1 8.3-7.5 9.6-4.4-1.3-7.5-5-7.5-9.6V5.8z" />
      <path d="M9 12l2.2 2.2L15.4 10" />
    </svg>
  );
}

const projectTypeIcons: Record<string, (props: IconProps) => ReactElement> = {
  layout: IconLayout,
  building: IconBuilding,
  cart: IconCart,
  phone: IconPhoneApp,
  grid: IconGrid,
  code: IconCode,
  seo: IconSearch,
  design: IconPalette,
  payment: IconCard,
  mail: IconMail,
};

export function ProjectTypeIcon({ name, ...props }: IconProps & { name: string }) {
  const Component = projectTypeIcons[name] ?? IconCode;
  return <Component {...props} />;
}

/**
 * Legacy services came from the CMS with an image, not an icon name. Rather
 * than show a broken plate, pick a glyph from the service title.
 */
const titleKeywords: [RegExp, (props: IconProps) => ReactElement][] = [
  [/mobil|mobile|app|tətbiq|tetbiq/i, IconPhoneApp],
  [/seo|axtar|search/i, IconSearch],
  [/dizayn|design|ui|ux/i, IconPalette],
  [/ödəniş|odenis|payment|kart|card/i, IconCard],
  [/erp|sistem|system/i, IconGrid],
  [/email|e-poçt|mail|poct/i, IconMail],
  [/ticarət|ticaret|commerce|mağaza|magaza|shop/i, IconCart],
  [/sayt|site|web|veb/i, IconCode],
];

export function ServiceGlyph({ title, ...props }: IconProps & { title: string }) {
  for (const [pattern, Component] of titleKeywords) {
    if (pattern.test(title)) return <Component {...props} />;
  }
  return <IconCode {...props} />;
}

/* ---------- social ---------- */

export function IconInstagram(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5.2" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconFacebook(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M13.5 21.5v-8h2.7l.5-3.2h-3.2V8.2c0-.9.3-1.6 1.7-1.6h1.6V3.7c-.8-.1-1.7-.2-2.6-.2-2.6 0-4.4 1.6-4.4 4.5v2.3H7v3.2h2.8v8z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function IconLinkedIn(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4.2" />
      <path d="M7.6 10.6V16.4M11.4 16.4v-3.3a2.1 2.1 0 014.2 0v3.3" />
      <circle cx="7.6" cy="7.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconWhatsApp(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20.6 11.7a8.6 8.6 0 01-12.7 7.6L3.4 20.6l1.4-4.4A8.6 8.6 0 1120.6 11.7z" />
      <path d="M9 9.4c0 3.1 2.5 5.6 5.6 5.6.6 0 1.1-.5 1.1-1.1l-1.6-.8-.9.8a5.2 5.2 0 01-2.5-2.5l.8-.9-.8-1.6c-.6 0-1.1.5-1.1 1.1z" />
    </svg>
  );
}

const socialIcons: Record<string, (props: IconProps) => ReactElement> = {
  instagram: IconInstagram,
  facebook: IconFacebook,
  linkedin: IconLinkedIn,
  whatsapp: IconWhatsApp,
};

export function SocialIcon({ name, ...props }: IconProps & { name: string }) {
  const Component = socialIcons[name.toLowerCase()] ?? IconGlobe;
  return <Component {...props} />;
}
