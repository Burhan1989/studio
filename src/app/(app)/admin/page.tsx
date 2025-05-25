
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookCopy, FileQuestion, LineChart, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const adminSections = [
    {
      title: "Kelola Pengguna",
      description: "Lihat, edit, atau hapus data pengguna.",
      icon: <Users className="w-8 h-8 text-primary" />,
      href: "/admin/users", // Placeholder link
      cta: "Buka Manajemen Pengguna"
    },
    {
      title: "Kelola Kursus & Pelajaran",
      description: "Tambah, edit, atau hapus kursus dan pelajaran.",
      icon: <BookCopy className="w-8 h-8 text-primary" />,
      href: "/admin/courses", // Placeholder link
      cta: "Buka Manajemen Kursus"
    },
    {
      title: "Kelola Kuis",
      description: "Buat, edit, atau tinjau kuis dan pertanyaan.",
      icon: <FileQuestion className="w-8 h-8 text-primary" />,
      href: "/admin/quizzes", // Placeholder link
      cta: "Buka Manajemen Kuis"
    },
    {
      title: "Statistik Situs",
      description: "Lihat analitik dan laporan penggunaan situs.",
      icon: <LineChart className="w-8 h-8 text-primary" />,
      href: "/admin/stats", // Placeholder link
      cta: "Lihat Statistik"
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 p-6 mb-8 rounded-lg shadow bg-gradient-to-r from-primary to-blue-400 text-primary-foreground">
        <Shield className="w-10 h-10" />
        <div>
          <h1 className="text-3xl font-bold">Dasbor Admin</h1>
          <p className="mt-1 text-lg opacity-90">Selamat datang di pusat kontrol AdeptLearn.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => (
          <Card key={section.title} className="shadow-lg flex flex-col">
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
