"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useI18n } from "@/i18n/client";
import { locales, type Locale } from "@/i18n/config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMenuOpen, toggleTheme } from "@/store/slices/uiSlice";

import { IconClose, IconMenu, IconMoon, IconSun } from "./Icons";
import Logo from "./Logo";

const NAV_KEYS = ["about", "services", "projects", "blog", "contact"] as const;
const NAV_PATHS: Record<(typeof NAV_KEYS)[number], string> = {
  about: "/about",
  services: "/services",
  projects: "/projects",
  blog: "/blog",
  contact: "/contact",
};

function LanguageSwitcher() {
  const { locale, dict } = useI18n();
  const pathname = usePathname();

  /** Same page, different locale prefix. */
  const swap = (target: Locale) => {
    const rest = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
    return `/${target}${rest}`;
  };

  return (
    <div
      className="bg-surface-2 flex items-center rounded-full p-1"
      role="group"
      aria-label={dict.language.label}
    >
      {locales.map((code) => (
        <Link
          key={code}
          href={swap(code)}
          hrefLang={code}
          lang={code}
          aria-current={code === locale ? "true" : undefined}
          onClick={() => {
            // Remember the choice so the middleware stops guessing next visit.
            document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; samesite=lax`;
          }}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
            code === locale
              ? "bg-surface text-body shadow-card"
              : "text-muted hover:text-body"
          }`}
        >
          {code.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

function ThemeToggle() {
  const { dict } = useI18n();
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.ui.theme) === "dark";
  const label = isDark ? dict.theme.toLight : dict.theme.toDark;

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      aria-label={label}
      title={label}
      className="bg-surface-2 text-muted hover:text-body flex h-10 w-10 items-center justify-center rounded-full transition-colors"
    >
      {isDark ? <IconSun width={18} height={18} /> : <IconMoon width={18} height={18} />}
    </button>
  );
}

export default function Navbar() {
  const { dict, href } = useI18n();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const menuOpen = useAppSelector((state) => state.ui.menuOpen);

  useEffect(() => {
    dispatch(setMenuOpen(false));
  }, [pathname, dispatch]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (path: string) => pathname === href(path);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="border-line bg-canvas/80 shadow-card mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 rounded-full border pr-2 pl-5 backdrop-blur-xl sm:pr-2.5 sm:pl-6">
        <Link href={href("/")} aria-label="Neyrosoft" className="shrink-0">
          <Logo size={32} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={dict.nav.home}>
          {NAV_KEYS.map((key) => (
            <Link
              key={key}
              href={href(NAV_PATHS[key])}
              aria-current={isActive(NAV_PATHS[key]) ? "page" : undefined}
              className="nav-pill"
            >
              {dict.nav[key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
          <Link href={href("/calculator")} className="btn btn-primary hidden md:inline-flex">
            {dict.nav.calculator}
          </Link>
          <button
            type="button"
            onClick={() => dispatch(setMenuOpen(!menuOpen))}
            aria-label={menuOpen ? dict.nav.closeMenu : dict.nav.openMenu}
            aria-expanded={menuOpen}
            className="bg-surface-2 text-body flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
          >
            {menuOpen ? <IconClose width={19} height={19} /> : <IconMenu width={19} height={19} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="card animate-rise mx-auto mt-2 max-w-6xl p-3 lg:hidden">
          <nav>
            {NAV_KEYS.map((key) => (
              <Link
                key={key}
                href={href(NAV_PATHS[key])}
                className="text-body hover:bg-surface-2 block rounded-2xl px-4 py-3 text-lg font-medium transition-colors"
              >
                {dict.nav[key]}
              </Link>
            ))}
          </nav>
          <div className="border-line mt-3 flex items-center gap-3 border-t pt-3">
            <LanguageSwitcher />
            <Link href={href("/calculator")} className="btn btn-primary flex-1">
              {dict.nav.calculator}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
