
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Film, Link2, FileUp, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea"; // Tambahkan jika perlu deskripsi materi

export default function TeacherMaterialsPage() {
  const { toast } = useToast();

  const handleSaveMaterials = () => {
    // Implementasi penyimpanan data akan dilakukan pada iterasi berikutnya
    toast({
        title: "Simulasi Penyimpanan Materi",
        description: "Materi pelajaran (contoh) telah 'disimpan'. Implementasi backend diperlukan.",
        variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <UploadCloud className="w-10 h-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Materi Saya</h1>
          <p className="text-muted-foreground">
            Kelola dan tambahkan materi pelajaran Anda di sini.
          </p>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
                <FileUp className="w-6 h-6 text-primary" /> Tambah atau Edit Materi Pelajaran
            </CardTitle>
            <CardDescription>
                Gunakan formulir di bawah ini untuk mengunggah file, menambahkan video, atau menautkan sumber daya eksternal.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="materialTitle">Judul Materi</Label>
                <Input id="materialTitle" placeholder="cth., Pengenalan Aljabar Bab 1" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="materialDescription">Deskripsi Materi</Label>
                <Textarea id="materialDescription" placeholder="Deskripsi singkat tentang materi ini..." className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="videoUrl" className="flex items-center gap-1">
                    <Film className="w-4 h-4" /> URL Video Eksternal (Misalnya Vimeo, Google Drive)
                </Label>
                <Input id="videoUrl" placeholder="https://contoh.com/video-pelajaran.mp4" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="youtubeLink" className="flex items-center gap-1">
                    <Link2 className="w-4 h-4" /> Link Video YouTube
                </Label>
                <Input id="youtubeLink" placeholder="https://www.youtube.com/watch?v=kodeVideoAnda" />
                <p className="text-xs text-muted-foreground">Sistem dapat menyematkan video YouTube dari link ini.</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="materialFile" className="flex items-center gap-1">
                    <FileUp className="w-4 h-4" /> Unggah File Materi (PDF, DOCX, PPTX, dll.)
                </Label>
                <Input id="materialFile" type="file" />
                <p className="text-xs text-muted-foreground">Maksimal ukuran file: 5MB (Contoh). Implementasi backend diperlukan.</p>
            </div>
            <Button onClick={handleSaveMaterials}>
                <Save className="w-4 h-4 mr-2" /> Simpan Materi
            </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Materi yang Sudah Diunggah</CardTitle>
          <CardDescription>
            Lihat dan kelola materi yang telah Anda tambahkan. (Fitur dalam pengembangan)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Placeholder untuk tabel daftar materi nantinya */}
          <p className="text-center text-muted-foreground">
            Belum ada materi yang diunggah.
          </p>
          {/* 
            Contoh bagaimana tabel bisa terlihat (komentari dulu):
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Materi</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Tanggal Unggah</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Pengenalan Aljabar Bab 1</TableCell>
                  <TableCell>PDF</TableCell>
                  <TableCell>10 Juli 2024</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                    <Button variant="destructive" size="sm">Hapus</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table> 
          */}
        </CardContent>
      </Card>

    </div>
  );
}
