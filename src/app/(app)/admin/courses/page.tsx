
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { BookCopy, PlusCircle, Edit, Trash2, Eye, Upload, Download, Link2, FileUp, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, type ChangeEvent, useState, useEffect } from "react";
import { getSchedules, getLessons, deleteLesson } from "@/lib/mockData"; // Updated to getLessons
import type { Lesson } from "@/lib/types"; // Import Lesson type
import { format, parseISO } from 'date-fns';
import Link from "next/link"; // Import Link
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function escapeCsvField(field: any): string {
  const fieldStr = String(field === null || field === undefined ? '' : field);
  return `"${fieldStr.replace(/"/g, '""')}"`;
}

export default function AdminCoursesPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);

  const fetchLessons = () => {
    setLessons(getLessons());
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleEditAction = (lessonId: string, lessonTitle: string) => {
    toast({
      title: `Edit Pelajaran ${lessonTitle}`,
      description: `Membuka form edit untuk pelajaran (ID: ${lessonId}). Implementasi form akan dilakukan pada iterasi berikutnya.`,
    });
    // router.push(`/admin/courses/${lessonId}/edit`); // Uncomment when edit page is ready
  };
  
  const handleDeleteLesson = () => {
    if (lessonToDelete) {
      const success = deleteLesson(lessonToDelete.id);
      if (success) {
        toast({ title: "Pelajaran Dihapus", description: `Pelajaran "${lessonToDelete.title}" telah berhasil dihapus.` });
        fetchLessons();
      } else {
        toast({ title: "Gagal Menghapus", description: `Pelajaran "${lessonToDelete.title}" tidak ditemukan.`, variant: "destructive" });
      }
      setLessonToDelete(null);
    }
  };


  const handleExportJadwal = () => {
    toast({
      title: "Memulai Ekspor Jadwal Pelajaran",
      description: "Sedang mempersiapkan file CSV (dipisahkan titik koma)...",
    });
    const dataToExport = getSchedules();
    if (dataToExport.length === 0) {
      toast({
        title: "Ekspor Dibatalkan",
        description: "Tidak ada data jadwal untuk diekspor.",
        variant: "destructive"
      });
      return;
    }
    const header = [
        "ID", "Judul", "Tanggal", "Waktu", "ID_Kelas", "Nama_Kelas",
        "ID_Guru", "Nama_Guru", "ID_Pelajaran", "ID_Kuis", "Deskripsi", "Kategori"
    ];
    
    const csvHeaderString = header.map(escapeCsvField).join(";") + "\r\n";

    const csvRows = dataToExport.map(schedule =>
      [
        schedule.id,
        schedule.title,
        schedule.date ? format(parseISO(schedule.date), 'yyyy-MM-dd') : '',
        schedule.time,
        schedule.classId || '',
        schedule.className || '',
        schedule.teacherId || '',
        schedule.teacherName || '',
        schedule.lessonId || '',
        schedule.quizId || '',
        schedule.description || '',
        schedule.category
      ].map(escapeCsvField).join(";")
    ).join("\r\n");
    const csvString = "\uFEFF" + csvHeaderString + csvRows; 

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "jadwal_pelajaran.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Ekspor Berhasil (CSV)",
      description: "Jadwal pelajaran telah berhasil diekspor sebagai jadwal_pelajaran.csv.",
    });
  };

  const handleImportJadwalClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelectedJadwal = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "File Dipilih",
        description: `File "${file.name}" dipilih untuk impor jadwal. Memproses (simulasi)...`,
      });
      setTimeout(() => {
        toast({
          title: "Impor Jadwal Selesai (Simulasi)",
          description: `Impor jadwal dari "${file.name}" telah selesai. Data tidak benar-benar diperbarui.`,
        });
      }, 2000);
    }
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSaveMaterials = () => {
    toast({
        title: "Simulasi Penyimpanan Materi",
        description: "Perubahan materi pelajaran (contoh) telah 'disimpan'. Implementasi backend diperlukan.",
    });
  };

  return (
    <div className="space-y-8">
       <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelectedJadwal}
        accept=".csv,.xlsx,.xls"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <BookCopy className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold">Kelola Pelajaran</h1>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <PlusCircle className="w-4 h-4 mr-2" /> Tambah Pelajaran Baru
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <BookCopy className="w-8 h-8 text-primary" />
            <CardTitle className="text-xl">Manajemen Jadwal Pelajaran (CSV)</CardTitle>
          </div>
          <CardDescription>Impor dan ekspor jadwal pelajaran menggunakan file CSV (dipisahkan titik koma untuk kompatibilitas Excel).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={handleImportJadwalClick} variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" /> Import Jadwal
            </Button>
            <Button onClick={handleExportJadwal} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" /> Export Jadwal (CSV)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Catatan: Fitur impor saat ini adalah simulasi. Ekspor menghasilkan file .csv yang dipisahkan titik koma.</p>
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
                <TableHead>Perkiraan Waktu</TableHead>
                <TableHead>Kesulitan</TableHead>
                <TableHead>ID Kuis Terkait</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell>{lesson.estimatedTime}</TableCell>
                  <TableCell>
                    <Badge variant={lesson.difficulty === "Pemula" ? "secondary" : lesson.difficulty === "Menengah" ? "default" : "outline"}>
                        {lesson.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>{lesson.quizId || "-"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/lessons/${lesson.id}`} target="_blank">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                       <Link href={`/admin/courses/${lesson.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => setLessonToDelete(lesson)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus pelajaran "{lessonToDelete?.title}"? Tindakan ini tidak dapat diurungkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setLessonToDelete(null)}>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteLesson}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
              {lessons.length === 0 && (
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
                <FileUp className="w-6 h-6 text-primary" /> Pengelolaan Materi untuk Pelajaran (Contoh)
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

    