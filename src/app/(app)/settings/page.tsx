"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings as SettingsIcon, Bell, Smartphone, Palette } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from 'react';

const THEME_STORAGE_KEY = "adeptlearn-theme";

type Theme = "default" | "ocean" | "forest";

export default function SettingsPage() {
  const { toast } = useToast();
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentTheme, setCurrentTheme] = useState<Theme>("default");

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (storedTheme) {
      applyTheme(storedTheme);
    }
  }, []);

  const applyTheme = (themeName: Theme) => {
    document.documentElement.classList.remove("theme-ocean", "theme-forest");
    if (themeName !== "default") {
      document.documentElement.classList.add(`theme-${themeName}`);
    }
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
    setCurrentTheme(themeName);
  };

  const handleSaveNotificationPreferences = () => {
    console.log("Preferensi notifikasi disimpan:", { whatsappNotifications, phoneNumber });
    toast({
      title: "Preferensi Disimpan",
      description: "Pengaturan notifikasi Anda telah diperbarui.",
    });
  };
  
  const handleThemeChange = (themeName: Theme) => {
    applyTheme(themeName);
    toast({
      title: "Tema Diubah",
      description: `Tema aplikasi diubah menjadi ${themeName.charAt(0).toUpperCase() + themeName.slice(1)}.`,
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
            <Palette className="w-5 h-5" /> Preferensi Tampilan
          </CardTitle>
          <CardDescription>Pilih tema visual untuk aplikasi AdeptLearn.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Pilih tema favorit Anda:</p>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant={currentTheme === "default" ? "default" : "outline"} 
              onClick={() => handleThemeChange("default")}
            >
              Bawaan (Biru Muda)
            </Button>
            <Button 
              variant={currentTheme === "ocean" ? "default" : "outline"} 
              onClick={() => handleThemeChange("ocean")}
               className="bg-[hsl(190,70%,55%)] hover:bg-[hsl(190,70%,60%)] text-white"
               style={currentTheme === "ocean" ? {} : {backgroundColor: 'hsl(200 100% 92%)', color: 'hsl(190 70% 55%)', borderColor: 'hsl(190 70% 55%)'} }
            >
              Samudra (Teal)
            </Button>
            <Button 
              variant={currentTheme === "forest" ? "default" : "outline"} 
              onClick={() => handleThemeChange("forest")}
              className="bg-[hsl(130,45%,40%)] hover:bg-[hsl(130,45%,45%)] text-white"
              style={currentTheme === "forest" ? {} : {backgroundColor: 'hsl(100 20% 95%)', color: 'hsl(130 45% 40%)', borderColor: 'hsl(130 45% 40%)'} }
            >
              Hutan (Hijau)
            </Button>
          </div>
           <p className="text-xs text-muted-foreground mt-2">
            Perubahan tema akan disimpan untuk sesi Anda berikutnya.
          </p>
        </CardContent>
      </Card>
      
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
