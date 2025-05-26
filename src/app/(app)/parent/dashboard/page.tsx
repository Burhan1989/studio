
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getStudents, mockUserProgress, getParents } from '@/lib/mockData'; // Menggunakan getStudents, mockUserProgress
import type { StudentData, ClassData, ParentData } from '@/lib/types';
import ProgressSummary from '@/components/reports/ProgressSummary';
import ScoreChart from '@/components/reports/ScoreChart';
import { Users, BookOpenCheck, Activity, Percent } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

export default function ParentDashboardPage() {
  const { user } = useAuth(); // Dapatkan pengguna yang login
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [linkedStudents, setLinkedStudents] = useState<StudentData[]>([]);
  const [studentProgress, setStudentProgress] = useState<typeof mockUserProgress | null>(null);

  useEffect(() => {
    if (user && user.role === 'parent') {
      const allStudents = getStudents();
      const studentsForThisParent = allStudents.filter(
        (student) => student.ID_OrangTua_Terkait === user.id
      );
      setLinkedStudents(studentsForThisParent);
      setSelectedStudentId(''); // Reset pilihan siswa jika parent berubah atau pertama kali load
      setStudentProgress(null);
    } else {
      setLinkedStudents([]);
    }
  }, [user]);

  const handleViewProgress = () => {
    const student = linkedStudents.find(s => s.ID_Siswa === selectedStudentId);
    if (student && student.ID_Siswa === 'student001') { 
      setStudentProgress(mockUserProgress);
    } else if (student) {
      setStudentProgress({
        userId: student.ID_Siswa,
        completedLessons: [],
        inProgressLessons: [],
        quizScores: [],
        currentLearningPath: {
          learningPathDescription: "Belum ada data progres detail untuk siswa ini.",
          customQuizzes: [],
          customLearningResources: []
        }
      });
    } else {
      setStudentProgress(null);
    }
  };

  const selectedStudentDetails = linkedStudents.find(s => s.ID_Siswa === selectedStudentId);

  if (!user || user.role !== 'parent') {
    // Tambahkan penanganan jika pengguna bukan orang tua atau belum login
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader><CardTitle>Akses Terbatas</CardTitle></CardHeader>
          <CardContent><p>Anda harus login sebagai orang tua untuk melihat halaman ini.</p></CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Users className="w-10 h-10 text-primary" />
        <h1 className="text-3xl font-bold">Dasbor Orang Tua</h1>
      </div>
      <CardDescription>Pilih nama anak Anda untuk melihat progres pembelajaran mereka.</CardDescription>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Pilih Anak</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="select-student">Pilih Nama Anak</Label>
              <Select 
                value={selectedStudentId} 
                onValueChange={setSelectedStudentId}
                disabled={linkedStudents.length === 0}
              >
                <SelectTrigger id="select-student">
                  <SelectValue placeholder={linkedStudents.length > 0 ? "Pilih Siswa" : "Tidak ada anak yang terhubung"} />
                </SelectTrigger>
                <SelectContent>
                  {linkedStudents.map(student => (
                    <SelectItem key={student.ID_Siswa} value={student.ID_Siswa}>
                      {student.Nama_Lengkap} (Kelas: {student.Kelas} - {student.Program_Studi})
                    </SelectItem>
                  ))}
                  {linkedStudents.length === 0 && (
                    <div className="p-2 text-sm text-muted-foreground">Tidak ada data anak yang terhubung dengan akun Anda.</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleViewProgress} disabled={!selectedStudentId}>
            Lihat Progres Anak
          </Button>
        </CardContent>
      </Card>

      {selectedStudentDetails && studentProgress && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>Status Pembelajaran untuk {selectedStudentDetails.Nama_Lengkap}</CardTitle>
            <CardDescription>Berikut adalah ringkasan kemajuan belajar anak Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             {studentProgress.userId === 'student001' ? (
              <>
                <ProgressSummary progress={studentProgress} />
                <div className="grid gap-6 lg:grid-cols-2">
                    <ScoreChart quizScores={studentProgress.quizScores} />
                     <Card>
                        <CardHeader><CardTitle>Detail Lain</CardTitle></CardHeader>
                        <CardContent><p>Grafik atau detail lain tentang progres siswa bisa ditambahkan di sini.</p></CardContent>
                     </Card>
                </div>
                {studentProgress.currentLearningPath && (
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BookOpenCheck className="w-5 h-5 text-primary"/> Jalur Belajar Saat Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-2 font-semibold">{studentProgress.currentLearningPath.learningPathDescription}</p>
                        </CardContent>
                    </Card>
                )}
              </>
            ) : (
                <p className="text-muted-foreground">{studentProgress.currentLearningPath?.learningPathDescription || "Tidak ada data progres rinci yang tersedia untuk siswa ini."}</p>
            )}
          </CardContent>
        </Card>
      )}
       {selectedStudentId && !studentProgress && (
         <Card className="mt-8 shadow-lg">
            <CardHeader>
                <CardTitle>Status Pembelajaran</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Klik "Lihat Progres Anak" untuk menampilkan data.</p>
            </CardContent>
         </Card>
       )}
    </div>
  );
}

