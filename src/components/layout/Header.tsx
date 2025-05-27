
"use client";

import Link from 'next/link';
import { GraduationCap, LogIn, UserPlus, LogOut, Settings, UserCircle, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSchoolProfile } from '@/lib/mockData'; 
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import { useEffect, useState } from 'react';
import type { SchoolProfileData } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const THEME_STORAGE_KEY = "adeptlearn-theme";
type Theme = "default" | "ocean" | "forest" | "dark";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter(); 
  const { toast } = useToast();
  const [currentSchoolProfile, setCurrentSchoolProfile] = useState<SchoolProfileData | null>(null);
  const [currentTheme, setCurrentTheme] = useState<Theme>("default");

  useEffect(() => {
    setCurrentSchoolProfile(getSchoolProfile());
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (storedTheme) {
      setCurrentTheme(storedTheme);
      // ThemeProvider akan menerapkan tema saat mount awal, jadi tidak perlu applyThemeClasses di sini
      // kecuali jika kita ingin memaksa perubahan tema dari sini.
    }
  }, []);
  
  const schoolLogoUrl = (typeof currentSchoolProfile?.logo === 'string' && currentSchoolProfile.logo.trim() !== '') ? currentSchoolProfile.logo : null;
  const schoolName = currentSchoolProfile?.namaSekolah || 'AdeptLearn';

  const applyThemeClasses = (themeName: Theme) => {
    const htmlEl = document.documentElement;
    htmlEl.classList.remove("dark", "theme-ocean", "theme-forest");

    if (themeName === "dark") {
      htmlEl.classList.add("dark");
    } else if (themeName === "ocean") {
      htmlEl.classList.add("theme-ocean");
    } else if (themeName === "forest") {
      htmlEl.classList.add("theme-forest");
    }
    console.log(`Header: Tema diterapkan: ${themeName}`);
  };

  const handleThemeChange = (themeName: Theme) => {
    applyThemeClasses(themeName);
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
    setCurrentTheme(themeName);
    toast({
      title: "Tema Diubah",
      description: `Tema aplikasi diubah menjadi ${themeName.charAt(0).toUpperCase() + themeName.slice(1)}.`,
    });
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center h-16 max-w-screen-2xl">
        <Link href="/" className="flex flex-row items-center gap-2 mr-4 sm:mr-6">
          {schoolLogoUrl ? (
            <Image
              src={schoolLogoUrl}
              alt={`${schoolName} Logo`}
              width={24} 
              height={24} 
              className="h-7 w-7 object-contain" 
              data-ai-hint="school logo"
              priority 
            />
          ) : (
            <GraduationCap className="w-7 h-7 text-primary" /> 
          )}
          <span className="text-base font-semibold text-foreground"> 
            {schoolName}
          </span>
        </Link>

        <nav className="flex items-center flex-1 gap-6 text-sm">
          {user && (
            <>
              <Link href="/dashboard" className="transition-colors text-foreground/60 hover:text-foreground/80">
                Dasbor
              </Link>
              {user.role === 'student' && (
                 <Link href="/learning-path" className="transition-colors text-foreground/60 hover:text-foreground/80">
                    Sesuaikan Jalur
                  </Link>
              )}
               {user.role === 'teacher' && (
                 <Link href="/teacher/materials" className="transition-colors text-foreground/60 hover:text-foreground/80">
                    Materi Saya
                  </Link>
              )}
              <Link href="/lessons" className="transition-colors text-foreground/60 hover:text-foreground/80">
                Pelajaran
              </Link>
               <Link href="/reports" className="transition-colors text-foreground/60 hover:text-foreground/80">
                Laporan
              </Link>
            </>
          )}
        </nav>
        
        <div className="flex items-center gap-2 mr-4">
          <Button 
            variant={currentTheme === "default" ? "default" : "outline"} 
            size="sm"
            onClick={() => handleThemeChange("default")}
            title="Tema Bawaan"
            className="p-2"
          >
            <Sun className="w-4 h-4" />
          </Button>
          <Button 
            variant={currentTheme === "dark" ? "default" : "outline"} 
            size="sm"
            onClick={() => handleThemeChange("dark")}
            title="Tema Gelap"
            className="p-2"
          >
            <Moon className="w-4 h-4" />
          </Button>
        </div>


        <div className="flex items-center gap-4">
          {user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center justify-start gap-2 p-1.5 h-auto rounded-full">
                    <Avatar className="w-8 h-8">
                    <AvatarImage src={user.Profil_Foto || `https://avatar.vercel.sh/${user.name || user.email}.png`} alt={user.name || "Pengguna"} />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-col items-start hidden sm:flex">
                        <span className="text-sm font-medium truncate max-w-[120px]">{user.name || "Pengguna"}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">{user.email}</span>
                    </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || "Pengguna"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <UserCircle className="w-4 h-4 mr-2" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Pengaturan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Masuk
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Daftar
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
