
"use client";

import type { ReactNode } from 'react';
import React, { useMemo } from 'react'; // Ditambahkan useMemo
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GraduationCap, LayoutDashboard, BrainCircuit, BookOpen, ClipboardCheck, BarChart3, LogOut, Settings, UserCircle, Shield, Users, BookCopy, FileQuestion, LineChart, UserCog, School, Users2 as ParentIcon, Building, UploadCloud, Network, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/lib/types';
import { mockSchoolProfile } from '@/lib/mockData';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  parentOnly?: boolean;
  teacherOnly?: boolean;
  studentOnly?: boolean;
}

const baseNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dasbor', icon: LayoutDashboard },
  { href: '/lessons', label: 'Pelajaran', icon: BookOpen, studentOnly: true, teacherOnly: true },
  { href: '/quizzes', label: 'Kuis', icon: ClipboardCheck, studentOnly: true, teacherOnly: true },
  { href: '/reports', label: 'Laporan', icon: BarChart3, studentOnly: true, teacherOnly: true },
  { href: '/learning-path', label: 'Sesuaikan Jalur', icon: BrainCircuit, studentOnly: true },
  { href: '/teacher/materials', label: 'Materi Saya', icon: UploadCloud, teacherOnly: true },
  { href: '/profile', label: 'Profil', icon: UserCircle },
  { href: '/settings', label: 'Pengaturan', icon: Settings },
  { href: '/parent/dashboard', label: 'Dasbor Anak', icon: ParentIcon, parentOnly: true },
  // Admin Menu
  { href: '/admin', label: 'Dasbor Admin', icon: Shield, adminOnly: true },
  { href: '/admin/school-profile', label: 'Profil Sekolah', icon: Building, adminOnly: true },
  { href: '/admin/admins', label: 'Kelola Admin', icon: ShieldCheck, adminOnly: true },
  { href: '/admin/teachers', label: 'Kelola Guru', icon: UserCog, adminOnly: true },
  { href: '/admin/students', label: 'Kelola Siswa', icon: Users, adminOnly: true },
  { href: '/admin/parents', label: 'Kelola Orang Tua', icon: ParentIcon, adminOnly: true },
  { href: '/admin/classes', label: 'Manajemen Kelas', icon: School, adminOnly: true },
  { href: '/admin/majors', label: 'Manajemen Jurusan', icon: Network, adminOnly: true },
  { href: '/admin/courses', label: 'Kelola Pelajaran', icon: BookCopy, adminOnly: true },
  { href: '/admin/quizzes', label: 'Kelola Kuis', icon: FileQuestion, adminOnly: true },
  { href: '/admin/stats', label: 'Statistik Situs', icon: LineChart, adminOnly: true },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const schoolLogoUrl = (typeof mockSchoolProfile.logo === 'string' && mockSchoolProfile.logo.trim() !== '') ? mockSchoolProfile.logo : null;

  const filteredNavItems = useMemo(() => {
    if (!user) return []; 

    let items: NavItem[];
    const userRole = user?.role;

    if (user?.isAdmin) {
      items = baseNavItems.filter(item =>
        item.adminOnly ||
        (!item.parentOnly && !item.teacherOnly && !item.studentOnly &&
          (item.href === '/profile' || item.href === '/settings' || item.href === '/lessons' || item.href === '/quizzes' || item.href === '/reports'))
      );
      const adminDashboard = items.find(item => item.href === '/admin');
      const commonDashboard = baseNavItems.find(item => item.href === '/dashboard'); // Dasbor umum
      const adminSpecificItems = items.filter(item => item.adminOnly && item.href !== '/admin');
      const commonItems = items.filter(item => 
        !item.adminOnly && 
        (item.href === '/profile' || item.href === '/settings' || item.href === '/lessons' || item.href === '/quizzes' || item.href === '/reports')
      );
      
      items = [
          ...(commonDashboard ? [commonDashboard] : []), // Dasbor umum dulu
          ...(adminDashboard ? [adminDashboard] : []), // Lalu Dasbor Admin
          ...adminSpecificItems.sort((a, b) => a.label.localeCompare(b.label)), // Sisa menu admin
          ...commonItems.sort((a,b) => (a.href === '/profile' || a.href === '/settings') ? 1 : (b.href === '/profile' || b.href === '/settings') ? -1 : a.label.localeCompare(b.label)), 
      ];
    } else if (userRole === 'parent') {
      items = baseNavItems.filter(item =>
        item.parentOnly ||
        item.href === '/profile' ||
        item.href === '/settings' 
      );
     if (!items.find(i => i.href === '/parent/dashboard')) {
        const parentDashboardItem = baseNavItems.find(i => i.href === '/parent/dashboard');
        if(parentDashboardItem) items.unshift(parentDashboardItem);
     }
      items.sort((a, b) => {
        if (a.href === '/parent/dashboard') return -1;
        if (b.href === '/parent/dashboard') return 1;
        if (a.href === '/profile' || a.href === '/settings') return 1;
        if (b.href === '/profile' || b.href === '/settings') return -1;
        return 0;
      });
    } else if (userRole === 'teacher') {
     items = baseNavItems.filter(item => {
      if (item.adminOnly || item.parentOnly || item.studentOnly) return false;
      return item.teacherOnly || (!item.adminOnly && !item.parentOnly && !item.studentOnly && !item.teacherOnly);
    });
    } else if (userRole === 'student') {
     items = baseNavItems.filter(item => {
      if (item.adminOnly || item.parentOnly || item.teacherOnly) return false;
      return item.studentOnly || (!item.adminOnly && !item.parentOnly && !item.teacherOnly && !item.studentOnly);
    });
    } else { 
      items = baseNavItems.filter(item =>
          !item.adminOnly &&
          !item.parentOnly &&
          !item.teacherOnly &&
          !item.studentOnly &&
          (item.href === '/dashboard' || item.href === '/profile' || item.href === '/settings' || item.href === '/lessons' || item.href === '/quizzes' || item.href === '/reports')
          );
    }
    return items;
  }, [user]);

  if (!user) {
    console.log("AppShell: No user, rendering null (AuthProvider should have redirected).");
    return null; 
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="bg-card border-r" collapsible="icon">
        <SidebarHeader className="p-2 border-b flex items-center group-data-[collapsible=icon]:min-h-0 group-data-[collapsible=icon]:justify-center">
          <Link
            href={user?.role === 'parent' ? "/parent/dashboard" : (user?.isAdmin ? "/admin" : "/dashboard")}
            className="flex flex-row items-center gap-2 group-data-[collapsible=icon]:justify-center"
          >
            {schoolLogoUrl ? (
              <Image
                src={schoolLogoUrl}
                alt={`${mockSchoolProfile.namaSekolah || 'AdeptLearn'} Logo`}
                width={120} // Width for aspect ratio calculation
                height={30} // Height for aspect ratio calculation
                className="h-8 w-auto object-contain group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:mx-auto" 
                data-ai-hint="school logo"
              />
            ) : (
              <GraduationCap className="w-8 h-8 text-primary group-data-[collapsible=icon]:w-7 group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:mx-auto" />
            )}
            <span className="text-sm font-semibold text-foreground group-data-[collapsible=icon]:hidden truncate">
              {mockSchoolProfile.namaSekolah || 'AdeptLearn'}
            </span>
          </Link>
        </SidebarHeader>
        <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
        <SidebarContent className="p-2">
          <SidebarMenu>
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href ||
                                (item.href !== '/dashboard' &&
                                 item.href !== '/parent/dashboard' &&
                                 item.href !== '/admin' &&
                                 pathname.startsWith(item.href) && item.href.length > 1 && !item.href.startsWith('/admin/')) ||
                                 (item.href.startsWith('/admin/') && pathname.startsWith(item.href)) || 
                                 (item.href === '/admin' && pathname === '/admin') ||
                                 (item.href === '/parent/dashboard' && pathname === '/parent/dashboard')
                              }
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
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 gap-4 px-4 border-b bg-background/80 backdrop-blur md:px-6">
            <div className="flex items-center"> 
                <SidebarTrigger className="md:hidden" /> 
            </div>
            {user && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center justify-start gap-2 p-1.5 h-auto rounded-full">
                        <Avatar className="w-8 h-8">
                        <AvatarImage src={user.Profil_Foto || `https://avatar.vercel.sh/${user.name || user.email}.png`} alt={user.name || "Pengguna"} />
                        <AvatarFallback>{user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-col items-start hidden sm:flex">
                            <span className="text-sm font-medium truncate max-w-[120px]">{user.name || "Pengguna"}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[120px]">{user.email}</span>
                        </div>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="end" className="w-56 mt-2">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name || "Pengguna"}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                        <UserCircle className="w-4 h-4 mr-2" />
                        Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/settings')}>
                        <Settings className="w-4 h-4 mr-2" />
                        Pengaturan
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Keluar
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </header>
        <main className="flex-1 p-4 overflow-auto md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
