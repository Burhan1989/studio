
"use client";

import type { User } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Progress } from '@/components/ui/progress'; // For loading state

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem('adeptlearn-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('adeptlearn-user'); // Clear invalid data
      }
    }
    setIsLoading(false);
  }, []); // Hanya dijalankan sekali saat mount

  useEffect(() => {
    if (isLoading) {
      return; // Jangan lakukan apa-apa jika masih loading data awal
    }

    const publicPaths = ['/login', '/register', '/'];
    const isPublicPath = publicPaths.includes(pathname);

    if (!user && !isPublicPath) {
      // Jika tidak ada user dan bukan di halaman publik, redirect ke login
      router.replace('/login');
    } else if (user && isPublicPath) {
      // Jika ada user dan berada di halaman publik, redirect ke dasbor yang sesuai
      if (user.isAdmin) {
        router.replace('/admin');
      } else if (user.role === 'parent') {
        router.replace('/parent/dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
    // Tidak ada else di sini, karena jika user ada dan bukan di public path, atau jika user tidak ada dan di public path, biarkan saja.
  }, [user, isLoading, router, pathname]);

  const login = (userData: User) => {
    localStorage.setItem('adeptlearn-user', JSON.stringify(userData));
    setUser(userData);
    // Pengalihan setelah login sudah ditangani oleh useEffect di atas,
    // namun kita bisa juga melakukannya secara eksplisit di sini untuk respons yang lebih cepat.
    if (userData.isAdmin) {
      router.push('/admin');
    } else if (userData.role === 'parent') {
      router.push('/parent/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('adeptlearn-user');
    setUser(null);
    router.push('/login'); // Selalu redirect ke login setelah logout
  };
  
  // Tampilkan loading indicator hanya jika belum selesai loading awal DAN bukan di halaman publik
  if (isLoading && !['/login', '/register', '/'].includes(pathname)) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <div className="w-1/3">
            {/* Indikator loading yang lebih sederhana untuk menghindari masalah Progress */}
            <p className="text-center text-lg font-semibold text-primary animate-pulse">Memuat AdeptLearn...</p>
          </div>
        </div>
      );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

