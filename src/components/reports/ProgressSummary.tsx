
"use client";

import type { UserProgress } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, BookOpen, Percent, Trophy } from 'lucide-react';

interface ProgressSummaryProps {
  progress: UserProgress; // Using mock data for now
}

export default function ProgressSummary({ progress }: ProgressSummaryProps) {
  const totalLessons = 10; // Mock total number of lessons available in the system
  const lessonsCompletionPercentage = (progress.completedLessons.length / totalLessons) * 100;
  
  const averageQuizScore = progress.quizScores.length > 0
    ? progress.quizScores.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0) / progress.quizScores.length * 100
    : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Pelajaran Selesai</CardTitle>
          <BookOpen className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress.completedLessons.length} / {totalLessons}</div>
          <Progress value={lessonsCompletionPercentage} className="w-full mt-2 h-2" />
          <p className="mt-1 text-xs text-muted-foreground">
            {lessonsCompletionPercentage.toFixed(0)}% dari semua pelajaran
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Rata-rata Skor Kuis</CardTitle>
          <Percent className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageQuizScore.toFixed(1)}%</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Dari {progress.quizScores.length} kuis yang diambil
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Pencapaian (Contoh)</CardTitle>
          <Trophy className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3 Lencana Diperoleh</div>
           <div className="flex mt-2 space-x-2">
            <span className="p-1 text-xs rounded-full bg-primary/20 text-primary">Langkah Pemula</span>
            <span className="p-1 text-xs rounded-full bg-accent/20 text-accent-foreground">Master Kuis</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
