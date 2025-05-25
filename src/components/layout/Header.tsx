
"use client";

import Link from 'next/link';
import { GraduationCap, LogIn, UserPlus, LogOut, UserCircle } from 'lucide-react';
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

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center h-16 max-w-screen-2xl">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <GraduationCap className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-foreground">AdeptLearn</span>
        </Link>
        
        <nav className="flex items-center flex-1 gap-6 text-sm">
          {user && (
            <>
              <Link href="/dashboard" className="transition-colors text-foreground/60 hover:text-foreground/80">
                Dasbor
              </Link>
              <Link href="/learning-path" className="transition-colors text-foreground/60 hover:text-foreground/80">
                Sesuaikan Jalur
              </Link>
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
                    <AvatarImage src={user.name ? `https://avatar.vercel.sh/${user.name}.png` : undefined} alt={user.name || user.email} />
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
