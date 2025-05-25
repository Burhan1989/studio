
"use client";

import Link from 'next/link';
import { GraduationCap, LogIn, UserPlus, LogOut } from 'lucide-react';
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
import { mockSchoolProfile } from '@/lib/mockData';
import Image from 'next/image';

export default function Header() {
  const { user, logout } = useAuth();
  const schoolLogoUrl = (typeof mockSchoolProfile.logo === 'string' && mockSchoolProfile.logo.trim() !== '') ? mockSchoolProfile.logo : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center h-20 max-w-screen-2xl"> {/* Adjusted height for vertical logo */}
        <Link href="/" className="flex flex-col items-center gap-1 mr-4 text-center sm:mr-6">
          {schoolLogoUrl ? (
            <Image
              src={schoolLogoUrl}
              alt={`${mockSchoolProfile.namaSekolah || 'AdeptLearn'} Logo`}
              width={160} // Aspect ratio base
              height={40}  // Aspect ratio base
              className="h-10 w-auto object-contain" // Tailwind for actual size
              data-ai-hint="school logo"
            />
          ) : (
            <GraduationCap className="w-8 h-8 text-primary" />
          )}
          <span className="text-sm font-semibold text-foreground mt-1">
            {mockSchoolProfile.namaSekolah || 'AdeptLearn'}
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

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative w-8 h-8 rounded-full">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.name ? `https://avatar.vercel.sh/${user.name}.png` : undefined} alt={user.name || user.email || "User"} />
                    <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
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
