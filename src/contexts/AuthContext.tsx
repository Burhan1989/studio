
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
    console.log("AuthContext: Initial effect - loading user from localStorage");
    try {
      const storedUser = localStorage.getItem('adeptlearn-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log("AuthContext: User loaded from localStorage:", parsedUser);
      } else {
        console.log("AuthContext: No user in localStorage");
      }
    } catch (error) {
      console.error("AuthContext: Failed to parse stored user. Clearing.", error);
      localStorage.removeItem('adeptlearn-user');
    }
    setIsLoading(false);
    console.log("AuthContext: Initial loading finished. isLoading set to false.");
  }, []);

  // Temporarily comment out redirection logic to diagnose freeze
  useEffect(() => {
    console.log(`AuthContext: Redirection effect check. isLoading: ${isLoading}, user: ${!!user}, pathname: ${pathname}`);
    // if (isLoading) {
    //   console.log("AuthContext: Still loading, redirection logic skipped.");
    //   return; 
    // }

    // const publicPaths = ['/login', '/register', '/'];
    // const isPublicPath = publicPaths.includes(pathname);

    // if (!user && !isPublicPath) {
    //   if (pathname !== '/login') {
    //     console.log(`AuthContext: No user, not public. Attempting redirect from ${pathname} to /login.`);
    //     // router.replace('/login');
    //   } else {
    //      console.log("AuthContext: No user, already on /login.");
    //   }
    // } else if (user && isPublicPath) {
    //   let targetDashboard = '/dashboard';
    //   if (user.isAdmin) {
    //     targetDashboard = '/admin';
    //   } else if (user.role === 'parent') {
    //     targetDashboard = '/parent/dashboard';
    //   }
      
    //   if (pathname !== targetDashboard) {
    //     console.log(`AuthContext: User exists, on public path ${pathname}. Attempting redirect to ${targetDashboard}.`);
    //     // router.replace(targetDashboard);
    //   } else {
    //     console.log(`AuthContext: User exists, already on target dashboard ${targetDashboard}.`);
    //   }
    // } else {
    //   console.log("AuthContext: Redirection conditions not met or already on correct page.");
    // }
  }, [user, isLoading, router, pathname]);

  const login = (userData: User) => {
    console.log("AuthContext: login function called with:", userData);
    localStorage.setItem('adeptlearn-user', JSON.stringify(userData));
    setUser(userData);
    // Pengalihan setelah login akan ditangani oleh useEffect di atas (jika tidak dikomentari)
  };

  const logout = () => {
    console.log("AuthContext: logout function called. Redirecting to /login.");
    localStorage.removeItem('adeptlearn-user');
    setUser(null);
    router.push('/login'); 
  };
  
  // Simplified global loader, only active if isLoading is true AND path is not public
  // If we are on a public path, we don't want to show a global loader even if AuthContext is loading in background
  const publicPathsForLoading = ['/login', '/register', '/'];
  if (isLoading && !publicPathsForLoading.includes(pathname)) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <div className="p-4 m-4 text-lg font-semibold rounded-md shadow-lg bg-card text-primary">
            Memuat AdeptLearn...
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
