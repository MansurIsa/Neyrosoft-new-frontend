import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark";

interface UiState {
  theme: Theme;
  themeReady: boolean;
  menuOpen: boolean;
  chatOpen: boolean;
  routeLoading: boolean;
}

const initialState: UiState = {
  theme: "light",
  themeReady: false,
  menuOpen: false,
  chatOpen: false,
  routeLoading: false,
};

const STORAGE_KEY = "neyrosoft-theme";

/** Applies the theme to <html> and remembers it. Called from the provider. */
export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode — the theme just won't persist */
  }
}

export function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      state.themeReady = true;
      applyTheme(action.payload);
    },
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      applyTheme(state.theme);
    },
    setMenuOpen(state, action: PayloadAction<boolean>) {
      state.menuOpen = action.payload;
    },
    setChatOpen(state, action: PayloadAction<boolean>) {
      state.chatOpen = action.payload;
    },
    setRouteLoading(state, action: PayloadAction<boolean>) {
      state.routeLoading = action.payload;
    },
  },
});

export const { setTheme, toggleTheme, setMenuOpen, setChatOpen, setRouteLoading } =
  uiSlice.actions;

export default uiSlice.reducer;
