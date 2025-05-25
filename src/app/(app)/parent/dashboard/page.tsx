
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { mockStudents, mockUserProgress } from '@/lib/mockData'; // Corrected import for mockUserProgress
import type { StudentData, ClassData } from '@/lib/types';
import ProgressSummary from '@/components/reports/ProgressSummary';
import ScoreChart from '@/components/reports/ScoreChart';
import { Users, BookOpenCheck, Activity, Percent } from 'lucide-react';

// Mock class data, similar to admin/classes but simplified for parent dashboard
const mockClassesForParent: Pick<ClassData, 'ID_Kelas' | 'Nama_Kelas'>[] = [
  { ID_Kelas: 'kelasA', Nama_Kelas: 'Kelas 10A IPA' },
  { ID_Kelas: 'kelasB', Nama_Kelas: 'Kelas 11B IPS' },
  { ID_Kelas: 'kelasC', Nama_Kelas: 'Kelas 12C Bahasa' },
  // Add more classes as needed, ensure student.Kelas matches Nama_Kelas
];


export default function ParentDashboardPage() {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [availableStudents, setAvailableStudents] = useState<StudentData[]>([]);
  const [studentProgress, setStudentProgress] = useState<typeof mockUserProgress | null>(null);

  useEffect(() => {
    if (selectedClass) {
      const studentsInClass = mockStudents.filter(student => student.Kelas === selectedClass);
      setAvailableStudents(studentsInClass);
      setSelectedStudentId(''); // Reset student selection when class changes
      setStudentProgress(null);
    } else {
      setAvailableStudents([]);
      setStudentProgress(null);
    }
  }, [selectedClass]);

  const handleViewProgress = () => {
    const student = mockStudents.find(s => s.ID_Siswa === selectedStudentId);
    if (student && student.ID_Siswa === 'student001') { // Simulate: only 'student001' has progress data
      setStudentProgress(mockUserProgress);
    } else if (student) {
      // Simulate finding some basic data for other students, or show "no detailed data"
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

  const selectedStudentDetails = mockStudents.find(s => s.ID_Siswa === selectedStudentId);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Users className="w-10 h-10 text-primary" />
        <h1 className="text-3xl font-bold">Dasbor Orang Tua</h1>
      </div>
      <CardDescription>Pilih kelas dan nama anak Anda untuk melihat progres pembelajaran mereka.</CardDescription>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Pilih Anak</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="select-class">Pilih Kelas Anak</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="select-class">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  {mockClassesForParent.map(cls => (
                    <SelectItem key={cls.ID_Kelas} value={cls.Nama_Kelas}>
                      {cls.Nama_Kelas}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="select-student">Pilih Nama Anak</Label>
              <Select 
                value={selectedStudentId} 
                onValueChange={setSelectedStudentId}
                disabled={!selectedClass || availableStudents.length === 0}
              >
                <SelectTrigger id="select-student">
                  <SelectValue placeholder={availableStudents.length > 0 ? "Pilih Siswa" : "Pilih kelas dulu"} />
                </SelectTrigger>
                <SelectContent>
                  {availableStudents.map(student => (
                    <SelectItem key={student.ID_Siswa} value={student.ID_Siswa}>
                      {student.Nama_Lengkap}
                    </SelectItem>
                  ))}
                  {availableStudents.length === 0 && selectedClass && (
                    <div className="p-2 text-sm text-muted-foreground">Tidak ada siswa di kelas ini.</div>
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
             {studentProgress.userId === 'student001' ? ( // Check if it's the student with detailed mock data
              <>
                <ProgressSummary progress={studentProgress} />
                <div className="grid gap-6 lg:grid-cols-2">
                    <ScoreChart quizScores={studentProgress.quizScores} />
                     {/* Placeholder for other charts if needed */}
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
