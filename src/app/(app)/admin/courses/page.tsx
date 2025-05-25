
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { BookCopy, PlusCircle, Edit, Trash2, Eye, Upload, Download, Link2, FileUp, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock Data (Sementara)
const mockCourses = [
  { id: "course1", title: "Dasar-Dasar Pemrograman Python", category: "Pemrograman", modules: 10, status: "Dipublikasikan" },
  { id: "course2", title: "Sejarah Dunia Modern", category: "Sejarah", modules: 8, status: "Dipublikasikan" },
  { id: "course3", title: "Pengantar Desain Grafis", category: "Desain", modules: 12, status: "Draft" },
  { id: "course4", title: "Aljabar Linear untuk Ilmu Data", category: "Matematika", modules: 15, status: "Dipublikasikan" },
];

export default function AdminCoursesPage() {
  const { toast } = useToast();

  const handleActionPlaceholder = (action: string, item: string) => {
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas "${action} ${item}" akan segera hadir.`,
    });
  };

  const handleEditAction = (itemName: string) => {
    toast({
      title: `Edit ${itemName}`,
      description: `Membuka form edit untuk ${itemName}. Implementasi form akan dilakukan pada iterasi berikutnya.`,
    });
  };

  const handleExcelAction = (actionType: "Import" | "Export", dataType: string) => {
    let actionDescription = actionType === "Import" ? "Impor" : "Ekspor";
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas "${actionDescription} ${dataType} dari file Excel" akan segera hadir. Ini adalah placeholder dan memerlukan implementasi backend.`,
      variant: "default",
    });
  };

  const handleSaveMaterials = () => {
    toast({
        title: "Simulasi Penyimpanan Materi",
        description: "Perubahan materi pelajaran (contoh) telah 'disimpan'. Implementasi backend diperlukan.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <BookCopy className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold">Kelola Pelajaran</h1>
        </div>
        <Button onClick={() => handleActionPlaceholder("Tambah", "Pelajaran Baru")}>
          <PlusCircle className="w-4 h-4 mr-2" /> Tambah Pelajaran Baru
        </Button>
      </div>

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
            <Button onClick={() => handleExcelAction("Import", "Jadwal Pelajaran")} variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" /> Import Jadwal
            </Button>
            <Button onClick={() => handleExcelAction("Export", "Jadwal Pelajaran")} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" /> Export Jadwal
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Catatan: Fitur import/export Excel saat ini adalah placeholder UI. Implementasi backend diperlukan.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Pelajaran Tersedia</CardTitle>
          <CardDescription>Kelola semua pelajaran yang ada di platform AdeptLearn.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Pelajaran</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Jumlah Modul</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>{course.modules}</TableCell>
                  <TableCell>
                    <Badge variant={course.status === "Dipublikasikan" ? "default" : "secondary"}>
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleActionPlaceholder("Lihat Modul", course.title)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditAction(`Pelajaran ${course.title}`)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleActionPlaceholder("Hapus", course.title)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {mockCourses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">Belum ada data pelajaran.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
                <Upload className="w-6 h-6 text-primary" /> Pengelolaan Materi untuk Pelajaran (Contoh)
            </CardTitle>
            <CardDescription>
                Ini adalah placeholder UI untuk menunjukkan bagaimana materi pelajaran dapat dikelola. 
                Pilih pelajaran dari tabel di atas untuk "mengedit" materinya di sini (simulasi).
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                Simpan Perubahan Materi
            </Button>
        </CardContent>
      </Card>

    </div>
  );
}
