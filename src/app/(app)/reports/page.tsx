
"use client"; // Due to mock data and potential client-side state for reports

import ProgressSummary from '@/components/reports/ProgressSummary';
import ScoreChart from '@/components/reports/ScoreChart';
import type { UserProgress } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookMarked } from 'lucide-react';

// Mock user progress data
const mockUserProgress: UserProgress = {
  userId: '1', // Corresponds to the mock logged-in user
  completedLessons: ['1', '2'], // IDs of completed lessons from mockData.ts
  quizScores: [
    { quizId: 'quiz1', score: 2, totalQuestions: 3 },
    { quizId: 'quiz2', score: 3, totalQuestions: 3 },
  ],
  currentLearningPath: { // Example, could be populated by AI
    learningPathDescription: "Jalur ramah pemula yang berfokus pada dasar-dasar JavaScript, diikuti oleh pengenalan React.",
    customQuizzes: [
      { resourceType: "Kuis Interaktif", resourceLink: "#", description: "Uji pengetahuan inti JS Anda." }
    ],
    customLearningResources: [
      { resourceType: "Tutorial Video", resourceLink: "#", description: "Selami lebih dalam closure JS." },
      { resourceType: "Artikel", resourceLink: "#", description: "Memahami fitur ES6." }
    ]
  }
};

export default function ReportsPage() {
  const { user } = useAuth();

  // In a real app, this data would be fetched based on the logged-in user
  const userProgress = mockUserProgress; 

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Laporan Belajar Anda</h1>
        <p className="mt-1 text-muted-foreground">
          Gambaran umum kemajuan, pencapaian, dan jalur belajar Anda.
        </p>
      </div>

      <ProgressSummary progress={userProgress} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ScoreChart quizScores={userProgress.quizScores} />
        
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookMarked className="w-5 h-5 text-primary"/> Jalur Belajar Saat Ini</CardTitle>
                <CardDescription>Perjalanan belajar Anda yang disesuaikan AI.</CardDescription>
            </CardHeader>
            <CardContent>
                {userProgress.currentLearningPath ? (
                    <div>
                        <p className="mb-2 font-semibold">{userProgress.currentLearningPath.learningPathDescription}</p>
                        {userProgress.currentLearningPath.customQuizzes.length > 0 && (
                            <>
                                <h4 className="mt-4 mb-1 text-sm font-medium text-muted-foreground">Kuis Khusus:</h4>
                                <ul className="pl-5 text-sm list-disc list-inside">
                                    {userProgress.currentLearningPath.customQuizzes.map(q => <li key={q.description}>{q.description}</li>)}
                                </ul>
                            </>
                        )}
                        {userProgress.currentLearningPath.customLearningResources.length > 0 && (
                             <>
                                <h4 className="mt-3 mb-1 text-sm font-medium text-muted-foreground">Sumber Daya Khusus:</h4>
                                <ul className="pl-5 text-sm list-disc list-inside">
                                    {userProgress.currentLearningPath.customLearningResources.map(r => <li key={r.description}>{r.description}</li>)}
                                </ul>
                            </>
                        )}
                    </div>
                ) : (
                    <p className="text-muted-foreground">Belum ada jalur belajar khusus yang dibuat. Kunjungi bagian "Sesuaikan Jalur"!</p>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
