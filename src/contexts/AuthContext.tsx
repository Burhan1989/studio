
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
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && !user && !['/login', '/register', '/'].includes(pathname)) {
      router.replace('/login');
    }
    if (!isLoading && user && (pathname === '/login' || pathname === '/register' || pathname === '/')) {
      if (user.isAdmin) { // Prioritize isAdmin check
        router.replace('/admin');
      } else if (user.role === 'parent') {
        router.replace('/parent/dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, isLoading, router, pathname]);

  const login = (userData: User) => {
    localStorage.setItem('adeptlearn-user', JSON.stringify(userData));
    setUser(userData);
    if (userData.isAdmin) { // Prioritize isAdmin check
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
    router.push('/login');
  };
  
  if (isLoading && !['/login', '/register', '/'].includes(pathname)) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <div className="w-1/3">
            <Progress value={50} className="w-full h-2 mb-4" />
            <p className="text-center text-foreground">Memuat AdeptLearn...</p>
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
