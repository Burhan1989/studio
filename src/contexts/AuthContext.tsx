
"use client";

import type { User, LoginHistoryEntry, UserRole } from '@/lib/types'; // Added LoginHistoryEntry & UserRole
import { useRouter, usePathname } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const LOGIN_HISTORY_KEY = 'adeptlearn-login-history';
const MAX_LOGIN_HISTORY_ENTRIES = 10;

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

  useEffect(() => {
    console.log(`AuthContext: Redirection effect check. isLoading: ${isLoading}, user: ${!!user}, pathname: ${pathname}`);
    if (isLoading) {
      console.log("AuthContext: Still loading, redirection logic skipped.");
      return;
    }

    const publicPaths = ['/login', '/register', '/'];
    const isPublicPath = publicPaths.includes(pathname);

    if (!user && !isPublicPath) {
      if (pathname !== '/login') {
        console.log(`AuthContext: No user, not public. Attempting redirect from ${pathname} to /login.`);
        router.replace('/login');
      } else {
         console.log("AuthContext: No user, already on /login.");
      }
    } else if (user && isPublicPath) {
      let targetDashboard = '/dashboard';
      if (user.isAdmin) {
        targetDashboard = '/admin';
      } else if (user.role === 'parent') {
        targetDashboard = '/parent/dashboard';
      }
      
      if (pathname !== targetDashboard) {
        console.log(`AuthContext: User exists, on public path ${pathname}. Attempting redirect to ${targetDashboard}.`);
        router.replace(targetDashboard);
      } else {
        console.log(`AuthContext: User exists, already on target dashboard ${targetDashboard}.`);
      }
    } else {
      console.log("AuthContext: Redirection conditions not met or already on correct page.");
    }
  }, [user, isLoading, router, pathname]);

  const login = (userData: User) => {
    console.log("AuthContext: login function called with:", userData);
    localStorage.setItem('adeptlearn-user', JSON.stringify(userData));
    setUser(userData);

    // Record login event
    try {
      const now = new Date().toISOString();
      const loginEntry: LoginHistoryEntry = {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        loginTime: now,
      };
      const historyString = localStorage.getItem(LOGIN_HISTORY_KEY);
      let history: LoginHistoryEntry[] = historyString ? JSON.parse(historyString) : [];
      history.unshift(loginEntry); // Add to the beginning
      history = history.slice(0, MAX_LOGIN_HISTORY_ENTRIES); // Keep only the last N entries
      localStorage.setItem(LOGIN_HISTORY_KEY, JSON.stringify(history));
      console.log("AuthContext: Login event recorded:", loginEntry);
    } catch (error) {
      console.error("AuthContext: Failed to record login history", error);
    }


    // Pengalihan akan ditangani oleh useEffect
    let targetDashboard = '/dashboard';
    if (userData.isAdmin) {
      targetDashboard = '/admin';
    } else if (userData.role === 'parent') {
      targetDashboard = '/parent/dashboard';
    }
    console.log(`AuthContext: Login successful, router.push to ${targetDashboard}`);
    router.push(targetDashboard);
  };

  const logout = () => {
    console.log("AuthContext: logout function called. Redirecting to /login.");
    localStorage.removeItem('adeptlearn-user');
    setUser(null);
    router.push('/login'); 
  };
  
  const publicPathsForLoading = ['/login', '/register', '/'];
  // if (isLoading && !publicPathsForLoading.includes(pathname)) {
  //    return (
  //       <div className="flex flex-col items-center justify-center min-h-screen bg-background">
  //         <svg className="w-16 h-16 mb-4 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  //           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  //           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  //         </svg>
  //         <div className="p-4 m-4 text-lg font-semibold rounded-md shadow-lg bg-card text-primary">
  //           Memuat AdeptLearn...
  //         </div>
  //       </div>
  //     );
  // }

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
