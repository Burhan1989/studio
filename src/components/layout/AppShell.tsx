
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
import { GraduationCap, LayoutDashboard, BrainCircuit, BookOpen, ClipboardCheck, BarChart3, LogOut, Settings, UserCircle, Shield, Users, BookCopy, FileQuestion, LineChart, UserCog, School, Users2 as ParentIcon, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/lib/types';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  parentOnly?: boolean;
  teacherOnly?: boolean; // Item ini hanya untuk guru
  studentOnly?: boolean; // Item ini hanya untuk siswa
}

const baseNavItems: NavItem[] = [
  // Item Umum untuk Siswa, Guru, Admin (kecuali ditandai khusus)
  { href: '/dashboard', label: 'Dasbor', icon: LayoutDashboard },
  { href: '/lessons', label: 'Pelajaran', icon: BookOpen },
  { href: '/quizzes', label: 'Kuis', icon: ClipboardCheck },
  { href: '/reports', label: 'Laporan', icon: BarChart3 },

  // Item Khusus Siswa
  { href: '/learning-path', label: 'Sesuaikan Jalur', icon: BrainCircuit, studentOnly: true },

  // Item Khusus Guru (Placeholder)
  { href: '/teacher/materials', label: 'Materi Saya', icon: BookCopy, teacherOnly: true },

  // Item Umum untuk Semua Peran Terautentikasi
  { href: '/profile', label: 'Profil', icon: UserCircle },
  { href: '/settings', label: 'Pengaturan', icon: Settings },

  // Item Khusus Orang Tua
  { href: '/parent/dashboard', label: 'Dasbor Anak', icon: Users, parentOnly: true },

  // Item Khusus Admin
  { href: '/admin', label: 'Dasbor Admin', icon: Shield, adminOnly: true },
  { href: '/admin/school-profile', label: 'Profil Sekolah', icon: Building, adminOnly: true },
  { href: '/admin/teachers', label: 'Kelola Guru', icon: UserCog, adminOnly: true },
  { href: '/admin/students', label: 'Kelola Siswa', icon: Users, adminOnly: true },
  { href: '/admin/parents', label: 'Kelola Orang Tua', icon: ParentIcon, adminOnly: true },
  { href: '/admin/classes', label: 'Manajemen Kelas', icon: School, adminOnly: true },
  { href: '/admin/courses', label: 'Kelola Pelajaran', icon: BookCopy, adminOnly: true },
  { href: '/admin/quizzes', label: 'Kelola Kuis', icon: FileQuestion, adminOnly: true },
  { href: '/admin/stats', label: 'Statistik Situs', icon: LineChart, adminOnly: true },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Mengarahkan ke halaman masuk...</div>;
  }

  let filteredNavItems: NavItem[];
  const userRole = user?.role;

  if (user?.isAdmin) {
    filteredNavItems = baseNavItems.filter(item =>
      item.adminOnly || // Tampilkan semua item admin
      (!item.parentOnly && !item.teacherOnly && !item.studentOnly) // Tampilkan item umum (bukan khusus peran lain)
    );
  } else if (userRole === 'parent') {
    filteredNavItems = baseNavItems.filter(item =>
      item.parentOnly || // Tampilkan dasbor khusus orang tua
      item.href === '/profile' || // Tampilkan profil
      item.href === '/settings'    // Tampilkan pengaturan
    );
  } else if (userRole === 'teacher') {
    filteredNavItems = baseNavItems.filter(item => {
      if (item.adminOnly || item.parentOnly || item.studentOnly) return false; // Sembunyikan item khusus admin, orang tua, siswa
      if (item.teacherOnly) return true; // Tampilkan item khusus guru
      if (item.href === '/learning-path') return false; // Guru tidak melihat "Sesuaikan Jalur"
      // Tampilkan item umum lainnya (Dasbor, Pelajaran, Kuis, Laporan, Profil, Pengaturan)
      return !item.adminOnly && !item.parentOnly && !item.studentOnly && !item.teacherOnly;
    });
  } else if (userRole === 'student') {
    filteredNavItems = baseNavItems.filter(item => {
      if (item.adminOnly || item.parentOnly || item.teacherOnly) return false; // Sembunyikan item khusus admin, orang tua, guru
      // Tampilkan item khusus siswa ATAU item umum
      return item.studentOnly || (!item.adminOnly && !item.parentOnly && !item.teacherOnly);
    });
  } else {
    // Fallback untuk peran tidak dikenal: hanya tampilkan profil & pengaturan
    filteredNavItems = baseNavItems.filter(item => item.href === '/profile' || item.href === '/settings');
  }


  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="bg-card border-r" collapsible="icon">
        <SidebarHeader className="p-4 border-b">
          <Link href={user?.role === 'parent' ? "/parent/dashboard" : "/dashboard"} className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground group-data-[collapsible=icon]:hidden">AdeptLearn</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href ||
                                (item.href !== '/dashboard' &&
                                 item.href !== '/parent/dashboard' &&
                                 !item.href.startsWith('/admin/') && // Generic admin/* should not make admin/dashboard active unless exact match
                                 pathname.startsWith(item.href)) ||
                                 (item.href === '/admin' && pathname.startsWith('/admin/')) // Special case for Admin Dashboard
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
        <SidebarFooter className="p-4 mt-auto border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="flex items-center justify-start w-full gap-2 group-data-[collapsible=icon]:justify-center">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.name ? `https://avatar.vercel.sh/${user.name}.png` : undefined} alt={user.name || "Pengguna"} />
                  <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-col items-start hidden group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium">{user.name || "Pengguna"}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-56 mb-2">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name || "Pengguna"}</p>
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
                Keluar
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
