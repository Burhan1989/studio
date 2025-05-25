
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
    learningPathDescription: "A beginner-friendly path focusing on JavaScript fundamentals, followed by an introduction to React.",
    customQuizzes: [
      { resourceType: "Interactive Quiz", resourceLink: "#", description: "Test your core JS knowledge." }
    ],
    customLearningResources: [
      { resourceType: "Video Tutorial", resourceLink: "#", description: "Deep dive into JS closures." },
      { resourceType: "Article", resourceLink: "#", description: "Understanding ES6 features." }
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
        <h1 className="text-3xl font-bold text-foreground">Your Learning Report</h1>
        <p className="mt-1 text-muted-foreground">
          An overview of your progress, achievements, and learning path.
        </p>
      </div>

      <ProgressSummary progress={userProgress} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ScoreChart quizScores={userProgress.quizScores} />
        
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookMarked className="w-5 h-5 text-primary"/> Current Learning Path</CardTitle>
                <CardDescription>Your AI-customized learning journey.</CardDescription>
            </CardHeader>
            <CardContent>
                {userProgress.currentLearningPath ? (
                    <div>
                        <p className="mb-2 font-semibold">{userProgress.currentLearningPath.learningPathDescription}</p>
                        {userProgress.currentLearningPath.customQuizzes.length > 0 && (
                            <>
                                <h4 className="mt-4 mb-1 text-sm font-medium text-muted-foreground">Custom Quizzes:</h4>
                                <ul className="pl-5 text-sm list-disc list-inside">
                                    {userProgress.currentLearningPath.customQuizzes.map(q => <li key={q.description}>{q.description}</li>)}
                                </ul>
                            </>
                        )}
                        {userProgress.currentLearningPath.customLearningResources.length > 0 && (
                             <>
                                <h4 className="mt-3 mb-1 text-sm font-medium text-muted-foreground">Custom Resources:</h4>
                                <ul className="pl-5 text-sm list-disc list-inside">
                                    {userProgress.currentLearningPath.customLearningResources.map(r => <li key={r.description}>{r.description}</li>)}
                                </ul>
                            </>
                        )}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No custom learning path generated yet. Visit the "Customize Path" section!</p>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
