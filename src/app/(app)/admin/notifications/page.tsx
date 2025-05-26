
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Send, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


export default function AdminNotificationsPage() {
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
    // Kosongkan form setelah mengirim (opsional)
    // setWhatsappApiKey('');
    // setTeacherPhoneNumber('');
    // setNotificationMessage('');
  };

  if (authIsLoading || !user || !user.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center bg-background">
        <svg className="w-16 h-16 mb-4 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Memeriksa Akses Admin...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-10 h-10 text-primary" />
        <h1 className="text-3xl font-bold">Pengaturan Notifikasi Guru</h1>
      </div>
      <CardDescription>
        Kirim notifikasi atau pengumuman penting ke guru melalui WhatsApp. Fitur ini memerlukan API Key dari penyedia layanan WhatsApp.
      </CardDescription>

      <Alert className="border-destructive/50 text-destructive bg-destructive/10">
        <Info className="w-5 h-5 text-destructive" />
        <AlertTitle className="font-semibold">Simulasi Fitur</AlertTitle>
        <AlertDescription>
          Pengiriman notifikasi WhatsApp yang sebenarnya memerlukan integrasi dengan API pihak ketiga (misalnya, Twilio, Vonage, atau API WhatsApp Business resmi).
          Formulir di bawah ini adalah untuk demonstrasi antarmuka. Data tidak akan benar-benar terkirim.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Kirim Notifikasi WhatsApp ke Guru</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <Label htmlFor="teacher-phone">Nomor HP Guru Tujuan</Label>
            <Input
              id="teacher-phone"
              type="tel"
              placeholder="cth. 081234567890 (diawali kode negara jika perlu)"
              value={teacherPhoneNumber}
              onChange={(e) => setTeacherPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="notification-message">Isi Pesan Notifikasi</Label>
            <Textarea
              id="notification-message"
              placeholder="Tulis pesan notifikasi Anda di sini..."
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSendNotification} className="w-full md:w-auto" size="lg">
            <Send className="w-4 h-4 mr-2" />
            Kirim Notifikasi (Simulasi)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    