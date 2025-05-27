
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { DatabaseBackup, DatabaseZap, Download, Upload } from 'lucide-react'; // Menggunakan DatabaseZap untuk restore

export default function AdminBackupRestorePage() {
  const { toast } = useToast();

  const handleBackup = () => {
    toast({
      title: "Simulasi Backup Database",
      description: "Proses backup database telah dimulai (simulasi). Di aplikasi nyata, ini akan mengunduh file backup.",
    });
    // Di aplikasi nyata, Anda akan memicu API untuk membuat dan mengunduh backup.
  };

  const handleRestore = () => {
    // Di aplikasi nyata, Anda akan memicu dialog unggah file dan API untuk restore.
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.sql,.bak,.json,.zip'; // Contoh ekstensi file backup
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        toast({
          title: "Simulasi Restore Database",
          description: `File "${file.name}" dipilih untuk restore (simulasi). Proses restore akan berjalan di latar belakang.`,
        });
      }
    };
    fileInput.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <DatabaseBackup className="w-10 h-10 text-primary" />
        <h1 className="text-3xl font-bold">Backup & Restore Database</h1>
      </div>
      <CardDescription>
        Kelola backup data aplikasi Anda dan lakukan restore jika diperlukan.
        Tindakan ini harus dilakukan dengan hati-hati.
      </CardDescription>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Backup Database</CardTitle>
          <CardDescription>
            Buat cadangan data aplikasi Anda saat ini. Proses ini mungkin memerlukan beberapa waktu tergantung ukuran database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleBackup} size="lg">
            <Download className="w-5 h-5 mr-2" />
            Mulai Backup Database (Simulasi)
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Disarankan untuk melakukan backup secara berkala.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Restore Database</CardTitle>
          <CardDescription>
            Pulihkan data aplikasi dari file backup sebelumnya. PERHATIAN: Proses ini akan menimpa data saat ini.
            Pastikan Anda memiliki backup data terbaru sebelum melanjutkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRestore} variant="destructive" size="lg">
            <Upload className="w-5 h-5 mr-2" />
            Pilih File & Restore Database (Simulasi)
          </Button>
           <p className="mt-2 text-xs text-muted-foreground">
            Proses restore tidak dapat diurungkan. Pastikan Anda memilih file backup yang benar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
