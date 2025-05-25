"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { FileQuestion, PlusCircle, Edit, Trash2, ListChecks } from "lucide-react";
import Link from "next/link"; // Import Link

// Mock Data (Sementara)
const mockAdminQuizzes = [
  { id: "quizA", title: "Kuis Pemahaman Algoritma Dasar", relatedLesson: "Pengantar Algoritma", questionsCount: 10 },
  { id: "quizB", title: "Kuis Struktur Data Esensial", relatedLesson: "Struktur Data Lanjutan", questionsCount: 15 },
  { id: "quizC", title: "Kuis Konsep OOP", relatedLesson: "Pemrograman Berorientasi Objek", questionsCount: 12 },
];

export default function AdminQuizzesPage() {
  const { toast } = useToast();

  const handleActionPlaceholder = (action: string, item: string) => {
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas "${action} ${item}" akan segera hadir.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <FileQuestion className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold">Kelola Kuis</h1>
        </div>
        <Button onClick={() => handleActionPlaceholder("Tambah", "Kuis Baru")}>
          <PlusCircle className="w-4 h-4 mr-2" /> Tambah Kuis Baru
        </Button>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Kuis</CardTitle>
          <CardDescription>Kelola semua kuis yang tersedia di platform AdeptLearn.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Kuis</TableHead>
                <TableHead>Pelajaran Terkait</TableHead>
                <TableHead>Jumlah Pertanyaan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAdminQuizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell className="font-medium">{quiz.title}</TableCell>
                  <TableCell>
                     {/* Ganti dengan Link jika ada halaman detail pelajaran admin */}
                    {quiz.relatedLesson}
                  </TableCell>
                  <TableCell>{quiz.questionsCount}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleActionPlaceholder("Lihat Pertanyaan", quiz.title)}>
                      <ListChecks className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleActionPlaceholder("Edit", quiz.title)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleActionPlaceholder("Hapus", quiz.title)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {mockAdminQuizzes.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">Belum ada data kuis.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
