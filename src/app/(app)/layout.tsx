
"use client"; 
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/contexts/AuthContext'; 

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, user } = useAuth();

  console.log("AuthenticatedAppLayout: Rendering. isLoading:", isLoading, "User exists:", !!user);

  if (isLoading) { 
    console.log("AuthenticatedAppLayout: isLoading is true, returning null (AuthProvider should show global loader or nothing if on public path).");
    return null; 
  }

  if (!user) {
    console.log("AuthenticatedAppLayout: isLoading is false and no user, returning null (AuthProvider should redirect).");
    return null; 
  }

  console.log("AuthenticatedAppLayout: isLoading is false and user exists. Rendering AppShell for user:", user.email);
  return <AppShell>{children}</AppShell>;
}
