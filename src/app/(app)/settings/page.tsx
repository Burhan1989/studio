
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings as SettingsIcon, Bell, Smartphone } from 'lucide-react'; // Palette, Moon, Sun dihapus karena tema dipindah
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from 'react';

// Logika tema telah dipindahkan ke Header.tsx

export default function SettingsPage() {
  const { toast } = useToast();
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSaveNotificationPreferences = () => {
    console.log("Preferensi notifikasi disimpan:", { whatsappNotifications, phoneNumber });
    toast({
      title: "Preferensi Disimpan",
      description: "Pengaturan notifikasi Anda telah diperbarui.",
    });
  };
  

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <SettingsIcon className="w-12 h-12 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Pengaturan Aplikasi</h1>
          <p className="text-muted-foreground">
            Sesuaikan preferensi aplikasi, notifikasi, dan tampilan Anda di sini.
          </p>
        </div>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" /> Notifikasi
          </CardTitle>
          <CardDescription>Kelola preferensi notifikasi Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg bg-background">
            <h3 className="mb-3 text-lg font-medium flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" /> Notifikasi Jadwal Pelajaran WhatsApp
            </h3>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="whatsapp-notifications" className="flex flex-col space-y-1">
                <span>Aktifkan Notifikasi WhatsApp</span>
                <span className="text-xs font-normal leading-snug text-muted-foreground">
                  Dapatkan pengingat jadwal pelajaran langsung ke WhatsApp Anda.
                </span>
              </Label>
              <Switch
                id="whatsapp-notifications"
                checked={whatsappNotifications}
                onCheckedChange={setWhatsappNotifications}
              />
            </div>
            {whatsappNotifications && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="whatsapp-number">Nomor WhatsApp</Label>
                <Input 
                  id="whatsapp-number" 
                  type="tel" 
                  placeholder="cth. 081234567890" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Pastikan nomor telepon aktif dan terhubung dengan WhatsApp. Fitur ini memerlukan integrasi lebih lanjut.
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveNotificationPreferences}>Simpan Preferensi Notifikasi</Button>
          </div>
          <p className="text-sm text-muted-foreground">Pengaturan notifikasi lainnya akan segera hadir...</p>
        </CardContent>
      </Card>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Preferensi Umum Lainnya</CardTitle>
          <CardDescription>Atur preferensi umum aplikasi lainnya.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Opsi pengaturan umum lainnya akan segera hadir...</p>
        </CardContent>
      </Card>
    </div>
  );
}
