import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "gridory-demo-theme";

const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark";

/**
 * `?theme=light|dark` wins (deterministic for automated checks), then the
 * choice stored by the toggle, then light.
 */
const readInitialTheme = (): Theme => {
  const fromQuery = new URLSearchParams(window.location.search).get("theme");
  if (isTheme(fromQuery)) return fromQuery;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // Storage unavailable (private mode or blocked): fall back to light.
  }
  return "light";
};

export const useDemoTheme = () => {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);
  // The library reads the theme from `.dark` on <html>, exactly as a consumer
  // app would set it; the demo shell follows through its own tokens.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage unavailable: the choice simply is not remembered.
    }
  }, [theme]);
  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");
  return { isDark, toggleTheme };
};
