
"use client"; // Jadikan ini komponen klien

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookCopy, FileQuestion, LineChart, Shield, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext'; // Impor useAuth
import { useRouter } from 'next/navigation'; // Impor useRouter
import { useEffect } from 'react';

export default function AdminPage() {
  const { user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  const adminSections = [
    {
      title: "Kelola Pengguna",
      description: "Lihat, edit, atau hapus data pengguna.",
      icon: <Users className="w-8 h-8 text-primary" />,
      href: "/admin/users", 
      cta: "Buka Manajemen Pengguna"
    },
    {
      title: "Kelola Kursus & Pelajaran",
      description: "Tambah, edit, atau hapus kursus dan pelajaran.",
      icon: <BookCopy className="w-8 h-8 text-primary" />,
      href: "/admin/courses", 
      cta: "Buka Manajemen Kursus"
    },
    {
      title: "Kelola Kuis",
      description: "Buat, edit, atau tinjau kuis dan pertanyaan.",
      icon: <FileQuestion className="w-8 h-8 text-primary" />,
      href: "/admin/quizzes", 
      cta: "Buka Manajemen Kuis"
    },
    {
      title: "Statistik Situs",
      description: "Lihat analitik dan laporan penggunaan situs.",
      icon: <LineChart className="w-8 h-8 text-primary" />,
      href: "/admin/stats", 
      cta: "Lihat Statistik"
    },
  ];

  useEffect(() => {
    if (!authIsLoading && (!user || !user.isAdmin)) {
      router.replace('/dashboard');
    }
  }, [user, authIsLoading, router]);

  if (authIsLoading || !user || !user.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center bg-background">
        <Loader2 className="w-16 h-16 mb-4 text-primary animate-spin" />
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Memeriksa Akses Admin...</h2>
        <p className="text-muted-foreground">
          Jika Anda bukan admin, Anda akan dialihkan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 p-6 mb-8 rounded-lg shadow bg-gradient-to-r from-primary to-blue-400 text-primary-foreground">
        <Shield className="w-10 h-10" />
        <div>
          <h1 className="text-3xl font-bold">Dasbor Admin</h1>
          <p className="mt-1 text-lg opacity-90">Selamat datang di pusat kontrol AdeptLearn, {user.name}.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => (
          <Card key={section.title} className="flex flex-col shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                {section.icon}
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </div>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Placeholder content if needed */}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={section.href}>
                  {section.cta} <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
