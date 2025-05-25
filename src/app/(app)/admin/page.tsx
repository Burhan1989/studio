
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Shield, MessageSquare, Users, BookCopy, FileQuestion, LineChart, UserCog, School, Users2 as ParentIcon, Building, Network, ShieldCheck, CalendarDays, Edit, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockSchedules, mockClasses, getTeachers } from "@/lib/mockData"; // Import getTeachers instead of mockTeachers
import type { ScheduleItem } from "@/lib/types";
import { format, parseISO } from 'date-fns';
import { id as LocaleID } from 'date-fns/locale';

export const dynamic = 'force-dynamic'; // Ensure admin dashboard always gets fresh schedule data

export default function AdminPage() {
  const { user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [whatsappApiKey, setWhatsappApiKey] = useState('');
  const [teacherPhoneNumber, setTeacherPhoneNumber] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [recentSchedules, setRecentSchedules] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    if (!authIsLoading && (!user || !user.isAdmin)) {
      router.replace('/dashboard');
    }
  }, [user, authIsLoading, router]);

  useEffect(() => {
    const teachers = getTeachers(); // Call getTeachers to fetch teacher data
    // Enrich schedules with class names and teacher names for display
    const enrichedSchedules = mockSchedules.map(schedule => {
      const classInfo = schedule.classId ? mockClasses.find(c => c.ID_Kelas === schedule.classId) : null;
      const teacherInfo = schedule.teacherId ? teachers.find(t => t.ID_Guru === schedule.teacherId) : null;
      return {
        ...schedule,
        className: classInfo ? `${classInfo.Nama_Kelas} - ${classInfo.jurusan}` : (schedule.classId ? schedule.className : 'Umum (Semua Kelas)'),
        teacherName: teacherInfo ? teacherInfo.Nama_Lengkap : (schedule.teacherId ? schedule.teacherName : 'Tidak Ditentukan'),
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by most recent
      .slice(0, 5); // Display latest 5 schedules
    setRecentSchedules(enrichedSchedules);
  }, []);


  const handleSendNotification = () => {
    if (!whatsappApiKey || !teacherPhoneNumber || !notificationMessage) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Mohon isi API Key, nomor HP guru, dan pesan notifikasi.",
        variant: "destructive",
      });
      return;
    }
    console.log("Mengirim notifikasi:", { whatsappApiKey, teacherPhoneNumber, notificationMessage });
    toast({
      title: "Notifikasi Terkirim (Simulasi)",
      description: `Pesan ke ${teacherPhoneNumber}: ${notificationMessage}`,
    });
  };


  if (authIsLoading || !user || !user.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center bg-background">
        <svg className="w-16 h-16 mb-4 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
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

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-primary" />
                Jadwal Pembelajaran Terbaru
            </CardTitle>
            <Button asChild size="sm">
                <Link href="/admin/schedules/new">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Tambah Jadwal Baru
                </Link>
            </Button>
          </div>
          <CardDescription>Lihat dan kelola jadwal pembelajaran. Klik "Edit" untuk mengubah detail.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentSchedules.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Guru</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.title}</TableCell>
                    <TableCell>{format(parseISO(schedule.date), 'dd MMM yyyy', { locale: LocaleID })}</TableCell>
                    <TableCell>{schedule.time}</TableCell>
                    <TableCell>{schedule.className || '-'}</TableCell>
                    <TableCell>{schedule.teacherName || '-'}</TableCell>
                    <TableCell>{schedule.category}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/schedules/${schedule.id}/edit`}>
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">Tidak ada jadwal untuk ditampilkan.</p>
          )}
           <div className="mt-4 text-right">
             <Button variant="outline" asChild>
                <Link href="/schedule"> {/* Assuming /schedule shows all schedules */}
                    Lihat Semua Jadwal
                </Link>
            </Button>
           </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Ringkasan Cepat</CardTitle>
            <CardDescription>Akses cepat ke berbagai modul manajemen.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button asChild variant="outline">
                <Link href="/admin/school-profile" className="flex items-center justify-center gap-2">
                    <Building className="w-5 h-5" /> Profil Sekolah
                </Link>
            </Button>
             <Button asChild variant="outline">
                <Link href="/admin/admins" className="flex items-center justify-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> Kelola Admin
                </Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/admin/teachers" className="flex items-center justify-center gap-2">
                    <UserCog className="w-5 h-5" /> Kelola Guru
                </Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/admin/students" className="flex items-center justify-center gap-2">
                    <Users className="w-5 h-5" /> Kelola Siswa
                </Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/admin/parents" className="flex items-center justify-center gap-2">
                    <ParentIcon className="w-5 h-5" /> Kelola Orang Tua
                </Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/admin/classes" className="flex items-center justify-center gap-2">
                    <School className="w-5 h-5" /> Kelola Kelas
                </Link>
            </Button>
             <Button asChild variant="outline">
                <Link href="/admin/majors" className="flex items-center justify-center gap-2">
                    <Network className="w-5 h-5" /> Manajemen Jurusan
                </Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/admin/courses" className="flex items-center justify-center gap-2">
                    <BookCopy className="w-5 h-5" /> Kelola Pelajaran
                </Link>
            </Button>
             <Button asChild variant="outline">
                <Link href="/admin/quizzes" className="flex items-center justify-center gap-2">
                    <FileQuestion className="w-5 h-5" /> Kelola Kuis
                </Link>
            </Button>
             <Button asChild variant="outline">
                <Link href="/admin/stats" className="flex items-center justify-center gap-2">
                    <LineChart className="w-5 h-5" /> Statistik Situs
                </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
