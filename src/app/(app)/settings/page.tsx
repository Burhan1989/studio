
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings as SettingsIcon, Bell, Smartphone, Palette, Moon, Sun } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from 'react';

const THEME_STORAGE_KEY = "adeptlearn-theme";

type Theme = "default" | "ocean" | "forest" | "dark";

export default function SettingsPage() {
  const { toast } = useToast();
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentTheme, setCurrentTheme] = useState<Theme>("default");

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (storedTheme) {
      applyThemeClasses(storedTheme);
      setCurrentTheme(storedTheme);
    }
  }, []);

  const applyThemeClasses = (themeName: Theme) => {
    const htmlEl = document.documentElement;
    htmlEl.classList.remove("dark", "theme-ocean", "theme-forest");

    if (themeName === "dark") {
      htmlEl.classList.add("dark");
    } else if (themeName === "ocean") {
      htmlEl.classList.add("theme-ocean");
    } else if (themeName === "forest") {
      htmlEl.classList.add("theme-forest");
    }
    // "default" theme means no extra classes beyond potentially "dark" if that's a separate toggle in future
  };

  const handleThemeChange = (themeName: Theme) => {
    applyThemeClasses(themeName);
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
    setCurrentTheme(themeName);
    toast({
      title: "Tema Diubah",
      description: `Tema aplikasi diubah menjadi ${themeName.charAt(0).toUpperCase() + themeName.slice(1)}.`,
    });
  };

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
              className="flex items-center gap-2"
            >
              <Sun className="w-4 h-4" /> Bawaan (Biru Muda)
            </Button>
            <Button 
              variant={currentTheme === "ocean" ? "default" : "outline"} 
              onClick={() => handleThemeChange("ocean")}
               className="flex items-center gap-2 bg-[hsl(190,70%,55%)] hover:bg-[hsl(190,70%,60%)] text-white"
               style={currentTheme === "ocean" ? {} : {backgroundColor: 'hsl(200 100% 92%)', color: 'hsl(190 70% 55%)', borderColor: 'hsl(190 70% 55%)'} }
            >
              <Sun className="w-4 h-4" /> Samudra (Teal)
            </Button>
            <Button 
              variant={currentTheme === "forest" ? "default" : "outline"} 
              onClick={() => handleThemeChange("forest")}
              className="flex items-center gap-2 bg-[hsl(130,45%,40%)] hover:bg-[hsl(130,45%,45%)] text-white"
              style={currentTheme === "forest" ? {} : {backgroundColor: 'hsl(100 20% 95%)', color: 'hsl(130 45% 40%)', borderColor: 'hsl(130 45% 40%)'} }
            >
              <Sun className="w-4 h-4" /> Hutan (Hijau)
            </Button>
            <Button
              variant={currentTheme === "dark" ? "default" : "outline"}
              onClick={() => handleThemeChange("dark")}
              className="flex items-center gap-2"
            >
              <Moon className="w-4 h-4" /> Mode Gelap
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
