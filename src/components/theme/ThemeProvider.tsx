
"use client";

import { useEffect, type ReactNode } from 'react';

const THEME_STORAGE_KEY = "adeptlearn-theme";
type Theme = "default" | "ocean" | "forest" | "dark";

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const htmlEl = document.documentElement;

    // Clear existing theme classes
    htmlEl.classList.remove("dark", "theme-ocean", "theme-forest");

    if (storedTheme) {
      if (storedTheme === "dark") {
        htmlEl.classList.add("dark");
      } else if (storedTheme === "ocean") {
        htmlEl.classList.add("theme-ocean");
      } else if (storedTheme === "forest") {
        htmlEl.classList.add("theme-forest");
      }
      // "default" theme means no extra theme-specific class, and no "dark" class (unless "dark" is the default)
    }
  }, []);

  return <>{children}</>;
}
