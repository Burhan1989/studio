
"use client"; // Jadikan ini komponen klien

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, BookCopy, FileQuestion, LineChart, Shield, ArrowRight, Loader2, Upload, Download, MessageSquare, UsersRound, School } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext'; // Impor useAuth
import { useRouter } from 'next/navigation'; // Impor useRouter
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { ClassData } from '@/lib/types'; // Import ClassData

// Mock data untuk tabel kelas & wali kelas
const mockClasses: ClassData[] = [
  { ID_Kelas: 'kelasA', Nama_Kelas: 'Kelas 10A', ID_Guru: 'Budi Santoso', jumlahSiswa: 30, jurusan: "IPA" },
  { ID_Kelas: 'kelasB', Nama_Kelas: 'Kelas 11B', ID_Guru: 'Siti Aminah', jumlahSiswa: 28, jurusan: "IPS" },
  { ID_Kelas: 'kelasC', Nama_Kelas: 'Kelas 12C', ID_Guru: 'Agus Setiawan', jumlahSiswa: 32, jurusan: "Bahasa" },
];

export default function AdminPage() {
  const { user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [whatsappApiKey, setWhatsappApiKey] = useState('');
  const [teacherPhoneNumber, setTeacherPhoneNumber] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  const adminSections = [
    {
      title: "Kelola Pengguna",
      description: "Lihat, edit, atau hapus data pengguna (guru & siswa).",
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

  const handleSendNotification = () => {
    if (!whatsappApiKey || !teacherPhoneNumber || !notificationMessage) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Mohon isi API Key, nomor HP guru, dan pesan notifikasi.",
        variant: "destructive",
      });
      return;
    }
    // Placeholder: Logika pengiriman notifikasi WhatsApp akan ada di sini
    console.log("Mengirim notifikasi:", { whatsappApiKey, teacherPhoneNumber, notificationMessage });
    toast({
      title: "Notifikasi Terkirim (Simulasi)",
      description: `Pesan ke ${teacherPhoneNumber}: ${notificationMessage}`,
    });
    // Kosongkan field setelah "terkirim"
    // setTeacherPhoneNumber('');
    // setNotificationMessage('');
  };

  const handleExcelAction = (actionType: string) => {
    // Placeholder: Logika untuk import/export Excel akan ada di sini
    console.log(`Aksi Excel: ${actionType}`);
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas ${actionType} menggunakan file Excel akan segera hadir. Ini adalah placeholder.`,
      variant: "default",
    });
  };

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

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Manajemen Data Guru & Siswa */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <UsersRound className="w-8 h-8 text-primary" />
              <CardTitle className="text-xl">Manajemen Data Guru & Siswa (Excel)</CardTitle>
            </div>
            <CardDescription>Import dan export data guru serta siswa menggunakan file Excel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Data Guru</h4>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button onClick={() => handleExcelAction("Import Guru")} variant="outline" className="flex-1">
                  <Upload className="w-4 h-4 mr-2" /> Import Guru
                </Button>
                <Button onClick={() => handleExcelAction("Export Guru")} variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" /> Export Guru
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Data Siswa</h4>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button onClick={() => handleExcelAction("Import Siswa")} variant="outline" className="flex-1">
                  <Upload className="w-4 h-4 mr-2" /> Import Siswa
                </Button>
                <Button onClick={() => handleExcelAction("Export Siswa")} variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" /> Export Siswa
                </Button>
              </div>
            </div>
             <p className="text-xs text-muted-foreground">Catatan: Fitur import/export Excel saat ini adalah placeholder UI. Implementasi backend diperlukan.</p>
          </CardContent>
        </Card>

        {/* Manajemen Jadwal Pelajaran */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <BookCopy className="w-8 h-8 text-primary" />
              <CardTitle className="text-xl">Manajemen Jadwal Pelajaran (Excel)</CardTitle>
            </div>
            <CardDescription>Import dan export jadwal pelajaran menggunakan file Excel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={() => handleExcelAction("Import Jadwal")} variant="outline" className="flex-1">
                <Upload className="w-4 h-4 mr-2" /> Import Jadwal
              </Button>
              <Button onClick={() => handleExcelAction("Export Jadwal")} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" /> Export Jadwal
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Catatan: Fitur import/export Excel saat ini adalah placeholder UI. Implementasi backend diperlukan.</p>
          </CardContent>
        </Card>
      </div>

      {/* Notifikasi Guru via WhatsApp */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-primary" />
            <CardTitle className="text-xl">Notifikasi Guru (WhatsApp)</CardTitle>
          </div>
          <CardDescription>Kirim notifikasi ke guru melalui WhatsApp (memerlukan API Key).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="whatsapp-api-key">API Key WhatsApp</Label>
            <Input
              id="whatsapp-api-key"
              placeholder="Masukkan API Key WhatsApp Anda"
              value={whatsappApiKey}
              onChange={(e) => setWhatsappApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">API Key ini bersifat rahasia dan digunakan untuk otentikasi.</p>
          </div>
          <div>
            <Label htmlFor="teacher-phone">Nomor HP Guru</Label>
            <Input
              id="teacher-phone"
              type="tel"
              placeholder="cth. 081234567890"
              value={teacherPhoneNumber}
              onChange={(e) => setTeacherPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="notification-message">Pesan Notifikasi</Label>
            <Textarea
              id="notification-message"
              placeholder="Tulis pesan notifikasi Anda di sini..."
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
           <p className="text-xs text-muted-foreground">Catatan: Fitur pengiriman WhatsApp saat ini adalah placeholder UI. Integrasi dengan penyedia layanan WhatsApp diperlukan.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSendNotification} className="w-full md:w-auto">
            Kirim Notifikasi
          </Button>
        </CardFooter>
      </Card>

      {/* Manajemen Kelas & Wali Kelas */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
             <School className="w-8 h-8 text-primary" />
            <CardTitle className="text-xl">Manajemen Kelas & Wali Kelas</CardTitle>
          </div>
          <CardDescription>Kelola data kelas, jurusan, dan penetapan wali kelas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
             <Button onClick={() => toast({ title: "Fitur Dalam Pengembangan", description: "Form tambah kelas baru akan segera hadir."})}>
              Tambah Kelas Baru
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kelas</TableHead>
                <TableHead>Jurusan</TableHead>
                <TableHead>Wali Kelas (ID Guru)</TableHead>
                <TableHead>Jumlah Siswa (Contoh)</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockClasses.map((kelas) => (
                <TableRow key={kelas.ID_Kelas}>
                  <TableCell>{kelas.Nama_Kelas}</TableCell>
                  <TableCell>{kelas.jurusan || '-'}</TableCell>
                  <TableCell>{kelas.ID_Guru}</TableCell> {/* Displaying ID_Guru as Wali Kelas for now */}
                  <TableCell>{(kelas as any).jumlahSiswa || 0}</TableCell> {/* Accessing mock-specific prop */}
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => toast({ title: "Fitur Dalam Pengembangan", description: `Opsi edit/hapus untuk ${kelas.Nama_Kelas} akan segera hadir.`})}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {mockClasses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Belum ada data kelas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
           <p className="mt-4 text-xs text-muted-foreground">Catatan: Fitur ini adalah placeholder UI. Implementasi CRUD (Create, Read, Update, Delete) penuh diperlukan.</p>
        </CardContent>
      </Card>
    </div>
  );
}
