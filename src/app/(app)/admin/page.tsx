
"use client"; 

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Users, BookCopy, FileQuestion, LineChart, Shield, ArrowRight, Loader2, MessageSquare, School, UserCog } from 'lucide-react'; // Added UserCog
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";


export default function AdminPage() {
  const { user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [whatsappApiKey, setWhatsappApiKey] = useState('');
  const [teacherPhoneNumber, setTeacherPhoneNumber] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

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
    console.log("Mengirim notifikasi:", { whatsappApiKey, teacherPhoneNumber, notificationMessage });
    toast({
      title: "Notifikasi Terkirim (Simulasi)",
      description: `Pesan ke ${teacherPhoneNumber}: ${notificationMessage}`,
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

      {/* Card ringkasan atau tautan cepat lainnya bisa ditambahkan di sini jika perlu */}
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Ringkasan Cepat</CardTitle>
            <CardDescription>Akses cepat ke berbagai modul manajemen.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
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
                <Link href="/admin/classes" className="flex items-center justify-center gap-2">
                    <School className="w-5 h-5" /> Kelola Kelas
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
