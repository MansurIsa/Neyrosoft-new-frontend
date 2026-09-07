"use client";

import { createContext, useContext, type ReactNode } from "react";

import { defaultLocale, format, getDictionary, type Dictionary, type Locale } from "./config";

interface I18nValue {
  locale: Locale;
  dict: Dictionary;
  /** Fill {placeholders}: t(dict.calculator.step, { current: 2, total: 4 }) */
  t: (template: string, values?: Record<string, string | number>) => string;
  /** Prefix a path with the active locale: href("/contact") -> "/az/contact" */
  href: (path: string) => string;
}

const I18nContext = createContext<I18nValue>({
  locale: defaultLocale,
  dict: getDictionary(defaultLocale),
  t: (template) => template,
  href: (path) => `/${defaultLocale}${path}`,
});

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const dict = getDictionary(locale);
  const value: I18nValue = {
    locale,
    dict,
    t: (template, values) => (values ? format(template, values) : template),
    href: (path) => `/${locale}${path === "/" ? "" : path}`,
  };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
