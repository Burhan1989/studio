
"use client";

import type { ReactNode } from 'react';
import React, { useMemo } from 'react';
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
  // General items
  { href: '/dashboard', label: 'Dasbor', icon: LayoutDashboard },
  { href: '/lessons', label: 'Pelajaran', icon: BookOpen },
  { href: '/quizzes', label: 'Kuis', icon: ClipboardCheck },
  { href: '/reports', label: 'Laporan', icon: BarChart3 },
  { href: '/profile', label: 'Profil', icon: UserCircle },
  { href: '/settings', label: 'Pengaturan', icon: Settings },

  // Student Specific
  { href: '/learning-path', label: 'Sesuaikan Jalur', icon: BrainCircuit, studentOnly: true },

  // Teacher Specific
  { href: '/teacher/materials', label: 'Materi Saya', icon: UploadCloud, teacherOnly: true },
  { href: '/teacher/quizzes', label: 'Kuis Saya', icon: FileQuestion, teacherOnly: true },
  
  // Parent Specific
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
    const userRole = user.role;

    let items = baseNavItems.filter(item => {
      const isGeneralItem = !item.adminOnly && !item.parentOnly && !item.teacherOnly && !item.studentOnly;

      if (user.isAdmin) { // Admin melihat semua item admin dan general. Sembunyikan item khusus peran lain.
        if (item.parentOnly || item.studentOnly || item.teacherOnly) return false;
        return item.adminOnly || isGeneralItem;
      }
      if (userRole === 'teacher') { // Guru melihat item teacher dan general. Sembunyikan item khusus peran lain.
        if (item.adminOnly || item.parentOnly || item.studentOnly) return false;
        return item.teacherOnly || isGeneralItem;
      }
      if (userRole === 'student') { // Siswa melihat item student dan general. Sembunyikan item khusus peran lain.
        if (item.adminOnly || item.parentOnly || item.teacherOnly) return false;
        return item.studentOnly || isGeneralItem;
      }
      if (userRole === 'parent') { // Ortu melihat item parent dan item general tertentu.
        if (item.adminOnly || item.teacherOnly || item.studentOnly) return false;
        if (item.parentOnly) return true;
        return isGeneralItem && (item.href === '/profile' || item.href === '/settings');
      }
      return isGeneralItem; 
    });

    // Sorting logic
     items.sort((a, b) => {
        // Prioritas utama: Dasbor spesifik peran
        const roleDashboardOrder = (href?: string) => {
            if (href === '/admin' && user.isAdmin) return -100;
            if (href === '/parent/dashboard' && userRole === 'parent') return -100;
            if (href === '/dashboard' && (userRole === 'student' || userRole === 'teacher')) return -90; // Dasbor umum untuk siswa/guru
            return 0;
        };

        const orderA = roleDashboardOrder(a.href);
        const orderB = roleDashboardOrder(b.href);
        if (orderA !== orderB) return orderA - orderB;
        
        // Admin-specific items after their dashboard
        if (user.isAdmin) {
            if (a.adminOnly && !b.adminOnly) return -1;
            if (!a.adminOnly && b.adminOnly) return 1;
        }

        // Role-specific items (teacher, student)
        if (userRole === 'teacher') {
            if (a.teacherOnly && !b.teacherOnly) return -1;
            if (!a.teacherOnly && b.teacherOnly) return 1;
        }
        if (userRole === 'student') {
            if (a.studentOnly && !b.studentOnly) return -1;
            if (!a.studentOnly && b.studentOnly) return 1;
        }

        // General items: Profile and Settings last
        const isGeneralSetting = (href?: string) => href === '/profile' || href === '/settings';
        if (isGeneralSetting(a.href) && !isGeneralSetting(b.href)) return 1;
        if (!isGeneralSetting(a.href) && isGeneralSetting(b.href)) return -1;
        
        // Alphabetical for the rest
        return a.label.localeCompare(b.label);
    });
    return items;
  }, [user]);

  if (!user) {
    console.log("AppShell: No user, rendering null (AuthProvider should have redirected).");
    return null; 
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="bg-card border-r" collapsible="icon">
        <SidebarHeader className="p-2 border-b flex flex-col items-center group-data-[collapsible=icon]:min-h-0 group-data-[collapsible=icon]:justify-center">
           {/* Bagian logo dan nama sekolah di atas */}
          <Link
            href={user?.role === 'parent' ? "/parent/dashboard" : (user?.isAdmin ? "/admin" : "/dashboard")}
            className="flex flex-col items-center gap-1 text-center mb-2 group-data-[collapsible=icon]:hidden" // mb-2 untuk spasi
          >
            {schoolLogoUrl ? (
              <Image
                src={schoolLogoUrl}
                alt={`${mockSchoolProfile.namaSekolah || 'AdeptLearn'} Logo`}
                width={100} 
                height={25}  
                className="h-8 w-auto object-contain mb-1" 
                data-ai-hint="school logo"
              />
            ) : (
              <GraduationCap className="w-8 h-8 text-primary mb-1" />
            )}
            <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
              {mockSchoolProfile.namaSekolah || 'AdeptLearn'}
            </span>
          </Link>
          {/* Hanya logo saat diciutkan */}
          <Link
            href={user?.role === 'parent' ? "/parent/dashboard" : (user?.isAdmin ? "/admin" : "/dashboard")}
            className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10"
          >
             {schoolLogoUrl ? (
              <Image
                src={schoolLogoUrl}
                alt={`${mockSchoolProfile.namaSekolah || 'AdeptLearn'} Logo`}
                width={32} 
                height={32}  
                className="h-7 w-7 object-contain"
                data-ai-hint="school logo"
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
                    isActive={pathname === item.href ||
                                (item.href !== '/dashboard' &&
                                 item.href !== '/parent/dashboard' &&
                                 item.href !== '/admin' &&
                                 pathname.startsWith(item.href) && item.href.length > 1 && 
                                 !item.href.startsWith('/admin/') && !item.href.startsWith('/teacher/') 
                                 ) ||
                                 (item.href.startsWith('/admin/') && pathname.startsWith(item.href)) || 
                                 (item.href.startsWith('/teacher/') && pathname.startsWith(item.href)) ||
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
