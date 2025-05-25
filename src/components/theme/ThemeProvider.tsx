"use client";

import { useEffect, type ReactNode } from 'react';

const THEME_STORAGE_KEY = "adeptlearn-theme";
type Theme = "default" | "ocean" | "forest";

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (storedTheme) {
      document.documentElement.classList.remove("theme-ocean", "theme-forest");
      if (storedTheme !== "default") {
        document.documentElement.classList.add(`theme-${storedTheme}`);
      }
    }
  }, []);

  return <>{children}</>;
}
