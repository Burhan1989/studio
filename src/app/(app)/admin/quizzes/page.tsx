
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { FileQuestion, PlusCircle, Edit, Trash2, ListChecks } from "lucide-react";
import Link from "next/link";
import { getQuizzes, deleteQuizById } from "@/lib/mockData"; // Updated imports
import type { Quiz } from "@/lib/types";
import { useEffect, useState } from "react";
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

export default function AdminQuizzesPage() {
  const { toast } = useToast();
  const [adminQuizzes, setAdminQuizzes] = useState<Quiz[]>([]);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);

  const fetchQuizzes = () => {
    setAdminQuizzes(getQuizzes()); // Admin sees all quizzes
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDeleteQuiz = () => {
    if (quizToDelete) {
      const success = deleteQuizById(quizToDelete.id);
      if (success) {
        toast({
          title: "Kuis Dihapus",
          description: `Kuis "${quizToDelete.title}" telah berhasil dihapus.`,
        });
        fetchQuizzes(); 
      } else {
        toast({
          title: "Gagal Menghapus",
          description: `Kuis "${quizToDelete.title}" tidak ditemukan atau gagal dihapus.`,
          variant: "destructive",
        });
      }
      setQuizToDelete(null);
    }
  };

  const handleActionPlaceholder = (action: string, item: string) => {
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas "${action} untuk ${item}" akan segera hadir.`,
    });
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <FileQuestion className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold">Kelola Kuis (Admin)</h1>
        </div>
        <Button asChild>
          <Link href="/admin/quizzes/new">
            <PlusCircle className="w-4 h-4 mr-2" /> Tambah Kuis Baru
          </Link>
        </Button>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Semua Kuis</CardTitle>
          <CardDescription>Kelola semua kuis yang tersedia di platform AdeptLearn.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Kuis</TableHead>
                <TableHead>Pelajaran Terkait (ID)</TableHead>
                <TableHead>Guru Pembuat (ID)</TableHead>
                <TableHead>Jumlah Pertanyaan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminQuizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell className="font-medium">{quiz.title}</TableCell>
                  <TableCell>
                     {quiz.lessonId || '-'}
                  </TableCell>
                  <TableCell>{quiz.teacherId || 'Admin'}</TableCell>
                  <TableCell>{quiz.questions.length}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleActionPlaceholder("Lihat Pertanyaan", quiz.title)}>
                      <ListChecks className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/quizzes/${quiz.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => setQuizToDelete(quiz)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus kuis "{quizToDelete?.title}"? Tindakan ini tidak dapat diurungkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setQuizToDelete(null)}>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteQuiz}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
              {adminQuizzes.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">Belum ada data kuis.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    