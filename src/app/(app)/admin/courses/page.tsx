
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { BookCopy, PlusCircle, Edit, Trash2, Eye, Upload, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  const handleExcelAction = (actionType: string) => {
    console.log(`Aksi Excel: ${actionType}`);
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas ${actionType} menggunakan file Excel akan segera hadir. Ini adalah placeholder.`,
      variant: "default",
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
            <Button onClick={() => handleExcelAction("Import Jadwal")} variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" /> Import Jadwal
            </Button>
            <Button onClick={() => handleExcelAction("Export Jadwal")} variant="outline" className="flex-1">
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
                    <Button variant="outline" size="sm" onClick={() => handleActionPlaceholder("Edit", course.title)}>
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
    </div>
  );
}
