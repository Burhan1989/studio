
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { FileQuestion, PlusCircle, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getQuizzesByTeacherId, mockQuizzes } from "@/lib/mockData"; // Menggunakan mockQuizzes untuk fallback
import type { Quiz } from "@/lib/types";

export default function TeacherQuizzesPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [teacherQuizzes, setTeacherQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    if (user && user.role === 'teacher') {
      // Di aplikasi nyata, Anda akan mengambil ini dari backend
      // Untuk sekarang, kita filter dari mockQuizzes
      const quizzes = getQuizzesByTeacherId(user.id); // Asumsikan user.id adalah teacherId
      setTeacherQuizzes(quizzes);
    } else {
      // Jika tidak ada user guru (misalnya, untuk demo), tampilkan beberapa kuis sebagai contoh
      setTeacherQuizzes(mockQuizzes.slice(0,2)); 
    }
  }, [user]);

  const handleActionPlaceholder = (action: string, itemName: string) => {
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas "${action} untuk ${itemName}" akan segera hadir.`,
    });
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
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teacherQuizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell className="font-medium">{quiz.title}</TableCell>
                  <TableCell>{quiz.description || '-'}</TableCell>
                  <TableCell>{quiz.questions.length}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleActionPlaceholder("Edit", quiz.title)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleActionPlaceholder("Hapus", quiz.title)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {teacherQuizzes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
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
