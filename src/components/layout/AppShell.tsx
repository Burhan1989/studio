
"use client";

import type { ReactNode } from 'react';
import React, { useMemo, useEffect, useState } from 'react';
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  GraduationCap, LayoutDashboard, BrainCircuit, BookOpen, ClipboardCheck, 
  BarChart3, LogOut, Settings, UserCircle, Shield, Users, BookCopy, 
  FileQuestion, LineChart, UserCog, School, Users2 as ParentIcon, Building, 
  UploadCloud, Network, ShieldCheck, CalendarDays, MessageSquare, Contact,
  ChevronDown, Megaphone, DatabaseBackup
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { SchoolProfileData } from '@/lib/types';
import { getSchoolProfile } from '@/lib/mockData';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  parentOnly?: boolean;
  teacherOnly?: boolean;
  studentOnly?: boolean;
  general?: boolean; // General items visible to student, teacher, admin (if not adminOnly)
}


const baseNavItems: NavItem[] = [
  // General items (order matters for display)
  { href: '/dashboard', label: 'Dasbor', icon: LayoutDashboard, general: true },
  { href: '/schedule', label: 'Jadwal Pembelajaran', icon: CalendarDays, general: true },
  { href: '/lessons', label: 'Pelajaran', icon: BookOpen, general: true },
  { href: '/quizzes', label: 'Kuis', icon: ClipboardCheck, general: true },
  { href: '/reports', label: 'Laporan', icon: BarChart3, general: true },
  { href: '/profile', label: 'Profil', icon: UserCircle, general: true },
  { href: '/settings', label: 'Pengaturan', icon: Settings, general: true },

  // Student specific
  { href: '/learning-path', label: 'Sesuaikan Jalur', icon: BrainCircuit, studentOnly: true },

  // Teacher specific
  { href: '/teacher/materials', label: 'Materi Saya', icon: UploadCloud, teacherOnly: true },
  { href: '/teacher/quizzes', label: 'Kuis Saya', icon: FileQuestion, teacherOnly: true },
  
  // Parent specific
  { href: '/parent/dashboard', label: 'Dasbor Anak', icon: ParentIcon, parentOnly: true },

  // Admin Specific - Top Level (Order here defines their appearance)
  { href: '/admin', label: 'Dasbor Admin', icon: Shield, adminOnly: true },
  { href: '/admin/school-profile', label: 'Profil Sekolah', icon: Building, adminOnly: true },
  { href: '/admin/announcements', label: 'Pengumuman', icon: Megaphone, adminOnly: true },

  // Admin Specific - Items for Accordion (will be filtered out if not in adminMenuGroups)
  { href: '/admin/admins', label: 'Kelola Admin', icon: ShieldCheck, adminOnly: true },
  { href: '/admin/teachers', label: 'Kelola Guru', icon: UserCog, adminOnly: true },
  { href: '/admin/students', label: 'Kelola Siswa', icon: Users, adminOnly: true },
  { href: '/admin/parents', label: 'Kelola Orang Tua', icon: ParentIcon, adminOnly: true },
  { href: '/admin/classes', label: 'Manajemen Kelas', icon: School, adminOnly: true },
  { href: '/admin/majors', label: 'Manajemen Jurusan', icon: Network, adminOnly: true },
  { href: '/admin/courses', label: 'Kelola Pelajaran', icon: BookCopy, adminOnly: true },
  { href: '/admin/quizzes', label: 'Kelola Kuis Admin', icon: FileQuestion, adminOnly: true },
  { href: '/admin/stats', label: 'Statistik Situs', icon: LineChart, adminOnly: true },
  { href: '/admin/notifications', label: 'Notifikasi Guru', icon: MessageSquare, adminOnly: true },
  { href: '/admin/contacts/class-contacts', label: 'Kontak Siswa', icon: Contact, adminOnly: true },
  { href: '/admin/backup-restore', label: 'Backup & Restore', icon: DatabaseBackup, adminOnly: true },
];

const adminMenuGroups = {
  userManagement: {
    label: "Manajemen Pengguna",
    icon: Users,
    items: [
      { href: '/admin/admins', label: 'Kelola Admin', icon: ShieldCheck },
      { href: '/admin/teachers', label: 'Kelola Guru', icon: UserCog },
      { href: '/admin/students', label: 'Kelola Siswa', icon: Users },
      { href: '/admin/parents', label: 'Kelola Orang Tua', icon: ParentIcon },
    ]
  },
  academicManagement: {
    label: "Manajemen Akademik",
    icon: BookCopy,
    items: [
      { href: '/admin/classes', label: 'Manajemen Kelas', icon: School },
      { href: '/admin/majors', label: 'Manajemen Jurusan', icon: Network },
      { href: '/admin/courses', label: 'Kelola Pelajaran', icon: BookCopy },
      { href: '/admin/quizzes', label: 'Kelola Kuis Admin', icon: FileQuestion },
    ]
  },
  toolsAndReports: { // "Profil Sekolah" telah dipindahkan ke level atas
    label: "Alat & Lainnya", 
    icon: Settings,
    items: [
      { href: '/admin/stats', label: 'Statistik Situs', icon: LineChart },
      { href: '/admin/notifications', label: 'Notifikasi Guru', icon: MessageSquare },
      { href: '/admin/contacts/class-contacts', label: 'Kontak Siswa', icon: Contact },
      { href: '/admin/backup-restore', label: 'Backup & Restore', icon: DatabaseBackup },
    ]
  }
};


export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [currentSchoolProfile, setCurrentSchoolProfile] = useState<SchoolProfileData | null>(null);

  useEffect(() => {
    setCurrentSchoolProfile(getSchoolProfile());
  }, []);

  const schoolLogoUrl = (currentSchoolProfile?.logo && typeof currentSchoolProfile.logo === 'string' && currentSchoolProfile.logo.trim() !== '') ? currentSchoolProfile.logo : null;
  const schoolName = currentSchoolProfile?.namaSekolah || 'AdeptLearn';


  const filteredNavItems = useMemo(() => {
    if (!user) return [];
    const userRole = user.role;

    const adminGroupHrefs = Object.values(adminMenuGroups).flatMap(group => group.items.map(item => item.href));

    let items = baseNavItems.filter(item => {
      const isGeneralItem = item.general;
      const isProfileOrSettings = item.href === '/profile' || item.href === '/settings';
      
      if (user.isAdmin) {
        // Admin sees adminOnly items (whether in groups or top-level) AND general items.
        return item.adminOnly || isGeneralItem;
      }
      if (userRole === 'teacher') {
        return item.teacherOnly || (isGeneralItem && !item.studentOnly && !item.adminOnly && !item.parentOnly);
      }
      if (userRole === 'student') {
        return item.studentOnly || (isGeneralItem && !item.teacherOnly && !item.adminOnly && !item.parentOnly);
      }
      if (userRole === 'parent') {
         return item.parentOnly || (isGeneralItem && (isProfileOrSettings || item.href === '/dashboard')); // Parent only sees their dashboard, profile, settings from general
      }
      return false; // Default deny if no role matches known logic
    });

    // Filter out items that are meant to be in admin groups from the top-level list for admin
    if (user.isAdmin) {
      items = items.filter(item => !(item.adminOnly && adminGroupHrefs.includes(item.href)));
    }


    items.sort((a, b) => {
        const order = [
          // Admin top-level
          '/admin', 
          '/admin/school-profile',
          '/admin/announcements',
          // General (also for admin if no specific admin dashboard)
          '/dashboard', 
          '/parent/dashboard', 
          '/schedule', 
          '/lessons', 
          '/teacher/materials', 
          '/learning-path', 
          '/quizzes', 
          '/teacher/quizzes', 
          '/reports',
          // Settings & Profile last for non-admins
        ];
        
        let indexA = order.indexOf(a.href);
        let indexB = order.indexOf(b.href);

        // Push profile and settings to the bottom for non-admins, admin can have them ordered by `order`
        if (!user.isAdmin) {
            if (a.href === '/profile') indexA = 100;
            else if (a.href === '/settings') indexA = 101;

            if (b.href === '/profile') indexB = 100;
            else if (b.href === '/settings') indexB = 101;
        }


        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1; 
        if (indexB !== -1) return 1;  
        
        // Fallback for any items not in `order` (e.g., new admin items not yet in accordion but not top-level)
        if (a.adminOnly && !b.adminOnly) return -1;
        if (!a.adminOnly && b.adminOnly) return 1;

        return a.label.localeCompare(b.label);
    });
    return items;
  }, [user]);

  if (!user) {
    if (typeof window !== 'undefined' && !['/login', '/register', '/'].includes(pathname)) {
      router.replace('/login');
    }
    return null; 
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="bg-sidebar border-r" collapsible="icon">
         <SidebarHeader className="p-2 border-b flex flex-col items-center group-data-[collapsible=icon]:min-h-0 group-data-[collapsible=icon]:justify-center">
            <Link
                href={user?.isAdmin ? "/admin" : (user?.role === 'parent' ? "/parent/dashboard" : "/dashboard")}
                className="flex flex-col items-center gap-1 group-data-[collapsible=icon]:hidden"
            >
            {schoolLogoUrl ? (
              <Image
                src={schoolLogoUrl}
                alt={`${schoolName} Logo`}
                width={32} 
                height={32} 
                className="object-contain h-8 w-auto max-w-[100px]"
                data-ai-hint="school logo"
                priority 
              />
            ) : (
              <GraduationCap className="w-8 h-8 text-primary" /> 
            )}
            <span className="text-xs font-semibold text-sidebar-foreground truncate max-w-[130px] text-center">
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
        <SidebarContent className="p-2">
          <SidebarMenu>
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/')}
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

          {user.isAdmin && (
            <Accordion type="multiple" className="w-full group-data-[collapsible=icon]:hidden">
              {Object.entries(adminMenuGroups).map(([key, group]) => (
                 group.items.length > 0 && ( 
                  <AccordionItem value={key} key={key} className="border-b-0">
                    <AccordionTrigger className="px-2 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md hover:no-underline [&[data-state=open]>svg]:text-sidebar-accent-foreground">
                      <div className="flex items-center gap-2">
                          <group.icon className="w-5 h-5" />
                          <span className="font-medium">{group.label}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-0 pl-2">
                      <SidebarMenu className="ml-3 border-l border-sidebar-border pl-3">
                        {group.items.map((item) => (
                          <SidebarMenuItem key={item.href}>
                            <Link href={item.href} legacyBehavior passHref>
                              <SidebarMenuButton
                                isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                                className="justify-start h-8 text-xs"
                                variant="ghost"
                              >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                              </SidebarMenuButton>
                            </Link>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </AccordionContent>
                  </AccordionItem>
                 )
              ))}
            </Accordion>
          )}

        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-background">
         <header className="sticky top-0 z-40 flex items-center justify-between h-16 gap-4 px-4 border-b bg-background/80 backdrop-blur md:px-6">
            <div className="flex items-center">
                <SidebarTrigger className="md:hidden" />
            </div>
             <div className="flex items-center gap-2">
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
                                <ChevronDown className="w-4 h-4 ml-1 text-muted-foreground hidden sm:inline-flex" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
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
             </div>
        </header>
        <main className="flex-1 p-4 overflow-auto md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
