
"use client";

import type { ReactNode } from 'react';
import React, { useMemo, useEffect, useState } from 'react'; // Ditambahkan useEffect dan useState
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
import { GraduationCap, LayoutDashboard, BrainCircuit, BookOpen, ClipboardCheck, BarChart3, LogOut, Settings, UserCircle, Shield, Users, BookCopy, FileQuestion, LineChart, UserCog, School, Users2 as ParentIcon, Building, UploadCloud, Network, ShieldCheck, CalendarDays } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { UserRole, SchoolProfileData } from '@/lib/types'; // Ditambahkan SchoolProfileData
import { getSchoolProfile } from '@/lib/mockData'; // Ditambahkan getSchoolProfile
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
  general?: boolean; 
}

const baseNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dasbor', icon: LayoutDashboard, general: true },
  { href: '/lessons', label: 'Pelajaran', icon: BookOpen, general: true },
  { href: '/quizzes', label: 'Kuis', icon: ClipboardCheck, general: true },
  { href: '/schedule', label: 'Jadwal Pembelajaran', icon: CalendarDays, general: true },
  { href: '/reports', label: 'Laporan', icon: BarChart3, general: true },
  { href: '/profile', label: 'Profil', icon: UserCircle, general: true },
  { href: '/settings', label: 'Pengaturan', icon: Settings, general: true },
  { href: '/learning-path', label: 'Sesuaikan Jalur', icon: BrainCircuit, studentOnly: true },
  { href: '/teacher/materials', label: 'Materi Saya', icon: UploadCloud, teacherOnly: true },
  { href: '/teacher/quizzes', label: 'Kuis Saya', icon: FileQuestion, teacherOnly: true },
  { href: '/parent/dashboard', label: 'Dasbor Anak', icon: ParentIcon, parentOnly: true },
  { href: '/admin', label: 'Dasbor Admin', icon: Shield, adminOnly: true },
  { href: '/admin/school-profile', label: 'Profil Sekolah', icon: Building, adminOnly: true },
  { href: '/admin/admins', label: 'Kelola Admin', icon: ShieldCheck, adminOnly: true },
  { href: '/admin/teachers', label: 'Kelola Guru', icon: UserCog, adminOnly: true },
  { href: '/admin/students', label: 'Kelola Siswa', icon: Users, adminOnly: true },
  { href: '/admin/parents', label: 'Kelola Orang Tua', icon: ParentIcon, adminOnly: true },
  { href: '/admin/classes', label: 'Manajemen Kelas', icon: School, adminOnly: true },
  { href: '/admin/majors', label: 'Manajemen Jurusan', icon: Network, adminOnly: true },
  { href: '/admin/courses', label: 'Kelola Pelajaran', icon: BookCopy, adminOnly: true },
  { href: '/admin/quizzes', label: 'Kelola Kuis Admin', icon: FileQuestion, adminOnly: true },
  { href: '/admin/stats', label: 'Statistik Situs', icon: LineChart, adminOnly: true },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [currentSchoolProfile, setCurrentSchoolProfile] = useState<SchoolProfileData | null>(null);

  useEffect(() => {
    setCurrentSchoolProfile(getSchoolProfile());
  }, []);

  const schoolLogoUrl = (typeof currentSchoolProfile?.logo === 'string' && currentSchoolProfile.logo.trim() !== '') ? currentSchoolProfile.logo : null;
  const schoolName = currentSchoolProfile?.namaSekolah || 'AdeptLearn';


  const filteredNavItems = useMemo(() => {
    if (!user) return [];
    const userRole = user.role;

    let items = baseNavItems.filter(item => {
      const isGeneralItem = !item.adminOnly && !item.parentOnly && !item.teacherOnly && !item.studentOnly;

      if (user.isAdmin) {
        return item.adminOnly || isGeneralItem;
      }
      if (userRole === 'teacher') {
        return (item.teacherOnly || isGeneralItem) && !item.adminOnly && !item.parentOnly && !item.studentOnly;
      }
      if (userRole === 'student') {
        return (item.studentOnly || isGeneralItem) && !item.adminOnly && !item.parentOnly && !item.teacherOnly;
      }
      if (userRole === 'parent') {
        if (item.parentOnly) return true;
        return isGeneralItem && (item.href === '/profile' || item.href === '/settings');
      }
      return isGeneralItem;
    });

     items.sort((a, b) => {
        const roleSpecificOrder = (item: NavItem) => {
            if (user.isAdmin) {
                if (item.href === '/admin') return -200; 
                if (item.adminOnly) return -100 + item.label.localeCompare(b.label); 
            }
            if (userRole === 'teacher') {
                if (item.href === '/dashboard') return -200; 
                if (item.teacherOnly) return -100; 
            }
            if (userRole === 'student') {
                if (item.href === '/dashboard') return -200; 
                if (item.studentOnly) return -100; 
            }
            if (userRole === 'parent') {
                if (item.href === '/parent/dashboard') return -200; 
            }
            return 0; 
        };

        const orderA = roleSpecificOrder(a);
        const orderB = roleSpecificOrder(b);

        if (orderA !== orderB) return orderA - orderB;

        const generalOrder = ['/dashboard', '/schedule', '/lessons', '/quizzes', '/reports', '/learning-path', '/teacher/materials', '/teacher/quizzes'];
        const indexA = generalOrder.indexOf(a.href);
        const indexB = generalOrder.indexOf(b.href);

        if (indexA !== -1 && indexB !== -1) {
            if (indexA !== indexB) return indexA - indexB;
        } else if (indexA !== -1) {
            return -1;
        } else if (indexB !== -1) {
            return 1;
        }
        const settingsProfileOrder = (item: NavItem) => {
            if (item.href === '/profile') return 100;
            if (item.href === '/settings') return 200;
            return 0;
        };
        const settingsOrderA = settingsProfileOrder(a);
        const settingsOrderB = settingsProfileOrder(b);
        if (settingsOrderA !== settingsOrderB) return settingsOrderA - settingsOrderB;

        return a.label.localeCompare(b.label); 
    });
    return items;
  }, [user]);

  if (!user) {
    return null; 
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="bg-card border-r" collapsible="icon">
        <SidebarHeader className="p-2 border-b flex flex-col items-center group-data-[collapsible=icon]:min-h-0 group-data-[collapsible=icon]:justify-center">
          <Link
            href={user?.isAdmin ? "/admin" : (user?.role === 'parent' ? "/parent/dashboard" : "/dashboard")}
            className="flex flex-col items-center gap-1 text-center mb-2 group-data-[collapsible=icon]:hidden"
          >
            {schoolLogoUrl ? (
              <Image
                src={schoolLogoUrl}
                alt={`${schoolName} Logo`}
                width={80} 
                height={20} 
                className="h-7 w-auto object-contain mb-1"
                data-ai-hint="school logo"
                priority
              />
            ) : (
              <GraduationCap className="w-8 h-8 text-primary mb-1" />
            )}
            <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
              {schoolName}
            </span>
          </Link>
          <Link
            href={user?.isAdmin ? "/admin" : (user?.role === 'parent' ? "/parent/dashboard" : "/dashboard")}
            className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10"
          >
             {schoolLogoUrl ? (
              <Image
                src={schoolLogoUrl}
                alt={`${schoolName} Logo`}
                width={32}
                height={32}
                className="h-7 w-7 object-contain"
                data-ai-hint="school logo"
                priority
              />
            ) : (
              <GraduationCap className="w-7 h-7 text-primary" />
            )}
          </Link>
        </SidebarHeader>
        <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
        <SidebarContent className="p-2">
          <SidebarMenu>
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={
                      pathname === item.href ||
                      (pathname.startsWith(item.href) && item.href !== '/' && item.href.length > 1 && !item.general) ||
                      (item.href === '/admin' && pathname.startsWith('/admin')) ||
                      (item.href === '/teacher/quizzes' && pathname.startsWith('/teacher/quizzes')) ||
                      (item.href === '/teacher/materials' && pathname.startsWith('/teacher/materials'))
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
