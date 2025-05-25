
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
import { GraduationCap, LayoutDashboard, BrainCircuit, BookOpen, ClipboardCheck, BarChart3, LogOut, Settings, UserCircle, Shield, Users, BookCopy, FileQuestion, LineChart, UserCog, School, Users2 as ParentIcon, Building, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/lib/types';
import { mockSchoolProfile } from '@/lib/mockData';
import Image from 'next/image';

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
  { href: '/lessons', label: 'Pelajaran', icon: BookOpen },
  { href: '/quizzes', label: 'Kuis', icon: ClipboardCheck },
  { href: '/reports', label: 'Laporan', icon: BarChart3 },
  { href: '/learning-path', label: 'Sesuaikan Jalur', icon: BrainCircuit, studentOnly: true },
  { href: '/teacher/materials', label: 'Materi Saya', icon: UploadCloud, teacherOnly: true },
  { href: '/profile', label: 'Profil', icon: UserCircle },
  { href: '/settings', label: 'Pengaturan', icon: Settings },
  { href: '/parent/dashboard', label: 'Dasbor Anak', icon: Users, parentOnly: true },
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
  const schoolLogoUrl = (typeof mockSchoolProfile.logo === 'string' && mockSchoolProfile.logo.trim() !== '') ? mockSchoolProfile.logo : null;


  if (!user) {
    return <div className="flex items-center justify-center h-screen">Mengarahkan ke halaman masuk...</div>;
  }

  let filteredNavItems: NavItem[];
  const userRole = user?.role;

  if (user?.isAdmin) {
    filteredNavItems = baseNavItems.filter(item =>
      item.adminOnly || 
      (!item.parentOnly && !item.teacherOnly && !item.studentOnly && 
        (item.href === '/dashboard' || item.href === '/profile' || item.href === '/settings' || item.href === '/lessons' || item.href === '/quizzes' || item.href === '/reports'))
    );
  } else if (userRole === 'parent') {
    filteredNavItems = baseNavItems.filter(item =>
      item.parentOnly || 
      item.href === '/profile' || 
      item.href === '/settings'    
    );
  } else if (userRole === 'teacher') {
     filteredNavItems = baseNavItems.filter(item => {
      if (item.adminOnly || item.parentOnly || item.studentOnly) return false; 
      if (item.teacherOnly) return true; 
      return !item.adminOnly && !item.parentOnly && !item.studentOnly && !item.teacherOnly;
    });
  } else if (userRole === 'student') {
     filteredNavItems = baseNavItems.filter(item => {
      if (item.adminOnly || item.parentOnly || item.teacherOnly) return false; 
      return item.studentOnly || (!item.adminOnly && !item.parentOnly && !item.teacherOnly && !item.studentOnly);
    });
  } else {
    filteredNavItems = baseNavItems.filter(item => 
        !item.adminOnly && 
        !item.parentOnly && 
        !item.teacherOnly &&
        !item.studentOnly);
  }


  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="bg-card border-r" collapsible="icon">
        <SidebarHeader className="p-2 border-b min-h-[6rem] flex items-center justify-center group-data-[collapsible=icon]:min-h-0">
          <Link
            href={user?.role === 'parent' ? "/parent/dashboard" : (user?.isAdmin ? "/admin" : "/dashboard")}
            className="flex flex-col items-center w-full gap-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
          >
            {schoolLogoUrl ? (
              <Image
                src={schoolLogoUrl}
                alt={`${mockSchoolProfile.namaSekolah || 'AdeptLearn'} Logo`}
                width={120} // Aspect ratio base
                height={30}  // Aspect ratio base
                className="h-8 w-auto object-contain group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7"
                data-ai-hint="school logo"
              />
            ) : (
              <GraduationCap className="w-8 h-8 text-primary group-data-[collapsible=icon]:w-7 group-data-[collapsible=icon]:h-7" />
            )}
            <span className="text-xs font-medium text-center text-foreground px-1 group-data-[collapsible=icon]:hidden w-full truncate">
              {mockSchoolProfile.namaSekolah || 'AdeptLearn'}
            </span>
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
                                 item.href !== '/admin' && 
                                 pathname.startsWith(item.href) && item.href.length > 1 && !item.href.startsWith('/admin/')) || 
                                 (item.href.startsWith('/admin/') && pathname.startsWith(item.href)) || 
                                 (item.href === '/admin' && pathname === '/admin') 
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
