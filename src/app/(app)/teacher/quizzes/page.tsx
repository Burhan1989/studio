
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { FileQuestion, PlusCircle, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getQuizzesByTeacherId, getQuizzes, getClasses, deleteQuizById } from "@/lib/mockData"; 
import type { Quiz, ClassData } from "@/lib/types";
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


export default function TeacherQuizzesPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [teacherQuizzes, setTeacherQuizzes] = useState<Quiz[]>([]);
  const [classesMap, setClassesMap] = useState<Record<string, string>>({});
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);

  const fetchQuizzesAndClasses = () => {
    const classData = getClasses(); 
    const classIdToNameMap: Record<string, string> = {};
    classData.forEach(cls => {
      classIdToNameMap[cls.ID_Kelas] = `${cls.Nama_Kelas} (${cls.jurusan})`;
    });
    setClassesMap(classIdToNameMap);

    if (user && user.role === 'teacher') {
      const quizzes = getQuizzesByTeacherId(user.id); 
      setTeacherQuizzes(quizzes);
    } else {
      setTeacherQuizzes(getQuizzes().slice(0,2)); 
    }
  };

  useEffect(() => {
    fetchQuizzesAndClasses();
  }, [user]); 

  const handleDeleteQuiz = () => {
    if (quizToDelete) {
      const success = deleteQuizById(quizToDelete.id);
      if (success) {
        toast({
          title: "Kuis Dihapus",
          description: `Kuis "${quizToDelete.title}" telah berhasil dihapus.`,
        });
        fetchQuizzesAndClasses(); // Refresh the list
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


  const getTotalPoints = (questions: Quiz['questions']): number => {
    return questions.reduce((total, q) => total + (q.points || 0), 0);
  };

  const getAssignedClassesDisplay = (assignedClassIds?: string[]): string => {
    if (!assignedClassIds || assignedClassIds.length === 0) return '-';
    return assignedClassIds.map(id => classesMap[id] || id).join(', ');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileQuestion className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Kuis Saya</h1>
        </div>
        <Button asChild>
          <Link href="/teacher/quizzes/new">
            <PlusCircle className="w-4 h-4 mr-2" /> Buat Kuis Baru
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Daftar Kuis Dibuat</CardTitle>
          <CardDescription>
            Kelola semua kuis yang telah Anda buat untuk siswa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Kuis</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Jumlah Pertanyaan</TableHead>
                <TableHead>Total Poin</TableHead>
                <TableHead>Kelas Ditugaskan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teacherQuizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell className="font-medium">{quiz.title}</TableCell>
                  <TableCell>{quiz.description || '-'}</TableCell>
                  <TableCell>{quiz.questions.length}</TableCell>
                  <TableCell>{getTotalPoints(quiz.questions)}</TableCell>
                  <TableCell>{getAssignedClassesDisplay(quiz.assignedClassIds)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/teacher/quizzes/${quiz.id}/edit`}>
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
              {teacherQuizzes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Anda belum membuat kuis.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
