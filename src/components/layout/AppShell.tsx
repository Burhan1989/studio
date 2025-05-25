
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GraduationCap, LayoutDashboard, BrainCircuit, BookOpen, ClipboardCheck, BarChart3, LogOut, Settings, UserCircle } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/learning-path', label: 'Customize Path', icon: BrainCircuit },
  { href: '/lessons', label: 'Lessons', icon: BookOpen },
  { href: '/quizzes', label: 'Quizzes', icon: ClipboardCheck },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/profile', label: 'Profil', icon: UserCircle },
  { href: '/settings', label: 'Pengaturan', icon: Settings },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) {
    // This should ideally be handled by AuthContext redirects, but as a fallback:
    return <div className="flex items-center justify-center h-screen">Redirecting to login...</div>;
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="bg-card border-r" collapsible="icon">
        <SidebarHeader className="p-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground group-data-[collapsible=icon]:hidden">AdeptLearn</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                    tooltip={{ children: item.label, className:"bg-primary text-primary-foreground" }}
                    className="justify-start"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="flex items-center justify-start w-full gap-2 group-data-[collapsible=icon]:justify-center">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.name ? `https://avatar.vercel.sh/${user.name}.png` : undefined} alt={user.name || "User"} />
                  <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-col items-start hidden group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium">{user.name || "User"}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-56 mb-2">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Pengaturan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <UserCircle className="w-4 h-4 mr-2" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-40 flex items-center h-16 gap-4 px-4 bg-background/80 backdrop-blur md:px-6">
            <div className="md:hidden">
                 <SidebarTrigger />
            </div>
            <div className="flex-1">
                {/* Can add breadcrumbs or page title here */}
            </div>
        </header>
        <main className="flex-1 p-4 overflow-auto md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Minimal DropdownMenu for AppShell, can be expanded
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation'; // Added for programmatic navigation

