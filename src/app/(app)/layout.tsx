
"use client"; // Keep this for AuthContext checks if needed, or AppShell can be client
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/contexts/AuthContext'; // Ensure AuthContext handles redirects

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, user } = useAuth();

  // AuthProvider already handles redirection logic based on isLoading and user state
  // So, we just need to ensure children are rendered within AppShell when user is authenticated.
  // The loading state and redirection are handled by AuthProvider's useEffect.
  // If isLoading, AuthProvider shows a loading indicator.
  // If !isLoading and !user, AuthProvider redirects.
  // If !isLoading and user, this layout is rendered.

  if (isLoading) { 
    // AuthProvider will show a global loader if this page is accessed during loading
    // and it's not a public page. So we can return null or a minimal loader here too if needed.
    return null; 
  }

  if (!user) {
    // Should be redirected by AuthProvider, but as a safeguard.
    return null; 
  }

  return <AppShell>{children}</AppShell>;
}
