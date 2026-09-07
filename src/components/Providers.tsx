"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Provider } from "react-redux";

import { I18nProvider } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import { useAppDispatch } from "@/store/hooks";
import { readStoredTheme, setTheme } from "@/store/slices/uiSlice";
import { makeStore, type AppStore } from "@/store/store";

function ThemeSync() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setTheme(readStoredTheme()));
  }, [dispatch]);
  return null;
}

export default function Providers({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  // One store per browser session; useRef keeps it stable across re-renders.
  const storeRef = useRef<AppStore | null>(null);
  storeRef.current ??= makeStore();

  return (
    <Provider store={storeRef.current}>
      <I18nProvider locale={locale}>
        <ThemeSync />
        {children}
      </I18nProvider>
    </Provider>
  );
}
