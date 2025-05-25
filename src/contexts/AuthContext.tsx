
"use client";

import type { User } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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
    // console.log("AuthContext: Initial effect running to load user from localStorage");
    const storedUser = localStorage.getItem('adeptlearn-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Gagal mem-parsing pengguna yang tersimpan:", error);
        localStorage.removeItem('adeptlearn-user'); // Hapus data yang tidak valid
      }
    }
    setIsLoading(false);
  }, []); // Hanya dijalankan sekali saat mount

  useEffect(() => {
    // console.log(`AuthContext: Redirection effect running. isLoading: ${isLoading}, user: ${!!user}, pathname: ${pathname}`);
    if (isLoading) {
      return; // Jangan lakukan apa-apa jika masih loading data awal
    }

    const publicPaths = ['/login', '/register', '/'];
    const isPublicPath = publicPaths.includes(pathname);

    if (!user && !isPublicPath) {
      // Jika tidak ada user dan bukan di halaman publik, redirect ke login
      if (pathname !== '/login') {
        // console.log(`AuthContext: No user, not public. Redirecting from ${pathname} to /login.`);
        router.replace('/login');
      }
    } else if (user && isPublicPath) {
      // Jika ada user dan berada di halaman publik, redirect ke dasbor yang sesuai
      let targetDashboard = '/dashboard';
      if (user.isAdmin) {
        targetDashboard = '/admin';
      } else if (user.role === 'parent') {
        targetDashboard = '/parent/dashboard';
      }
      
      if (pathname !== targetDashboard) {
        // Hanya redirect jika belum berada di halaman target (misalnya jika dari / atau /login atau /register)
        // console.log(`AuthContext: User exists, on public path ${pathname}. Redirecting to ${targetDashboard}.`);
        router.replace(targetDashboard);
      }
    }
    // Tidak ada else di sini, karena jika user ada dan bukan di public path, atau jika user tidak ada dan di public path, biarkan saja.
  }, [user, isLoading, router, pathname]);

  const login = (userData: User) => {
    localStorage.setItem('adeptlearn-user', JSON.stringify(userData));
    setUser(userData);
    // Pengalihan setelah login sudah ditangani oleh useEffect di atas,
    // namun kita bisa juga melakukannya secara eksplisit di sini untuk respons yang lebih cepat.
    // Ini akan ditangani oleh useEffect di atas setelah `user` state diperbarui.
    // if (userData.isAdmin) {
    //   router.push('/admin');
    // } else if (userData.role === 'parent') {
    //   router.push('/parent/dashboard');
    // } else {
    //   router.push('/dashboard');
    // }
  };

  const logout = () => {
    localStorage.removeItem('adeptlearn-user');
    setUser(null);
    // console.log("AuthContext: Logging out. Redirecting to /login.");
    router.push('/login'); // Selalu redirect ke login setelah logout
  };
  
  if (isLoading && !['/login', '/register', '/'].includes(pathname)) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <div className="w-1/3">
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

