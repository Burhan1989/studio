
"use client";

import { useEffect, type ReactNode } from 'react';

const THEME_STORAGE_KEY = "adeptlearn-theme";
type Theme = "default" | "ocean" | "forest" | "dark";

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const htmlEl = document.documentElement;

    // Hapus semua kelas tema spesifik terlebih dahulu
    htmlEl.classList.remove("dark", "theme-ocean", "theme-forest");

    if (storedTheme) {
      if (storedTheme === "dark") {
        htmlEl.classList.add("dark");
      } else if (storedTheme === "ocean") {
        htmlEl.classList.add("theme-ocean");
      } else if (storedTheme === "forest") {
        htmlEl.classList.add("theme-forest");
      }
      // Jika tema adalah "default", tidak ada kelas spesifik yang ditambahkan,
      // mengandalkan variabel CSS :root.
      console.log(`ThemeProvider: Tema dari localStorage ('${storedTheme}') diterapkan.`);
    } else {
      console.log("ThemeProvider: Tidak ada tema di localStorage, menggunakan tema default.");
    }
    // Dependensi kosong agar hanya berjalan sekali saat komponen dimuat.
  }, []);

  return <>{children}</>;
}
