"use client"; 

import ProgressSummary from '@/components/reports/ProgressSummary';
import ScoreChart from '@/components/reports/ScoreChart';
import type { UserProgress, LessonStatusCounts } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookMarked, PieChart as PieChartIcon } from 'lucide-react'; // Renamed to avoid conflict
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockLessons } from '@/lib/mockData'; // To get total lessons for status


// Mock user progress data
const mockUserProgress: UserProgress = {
  userId: '1', // Corresponds to the mock logged-in user
  completedLessons: ['1', '2'], // IDs of completed lessons from mockData.ts
  inProgressLessons: ['3'], // Example of lessons started but not finished
  quizScores: [
    { quizId: 'quiz1', score: 2, totalQuestions: 3 },
    { quizId: 'quiz2', score: 3, totalQuestions: 3 },
  ],
  currentLearningPath: { 
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

// Calculate lesson status counts
const totalMockLessons = mockLessons.length;
const completedCount = mockUserProgress.completedLessons.length;
const inProgressCount = mockUserProgress.inProgressLessons?.length || 0;
const notStartedCount = totalMockLessons - completedCount - inProgressCount;

const lessonStatusData: LessonStatusCounts[] = [
  { name: 'Selesai', value: completedCount, fill: 'hsl(var(--chart-1))' },
  { name: 'Dikerjakan', value: inProgressCount, fill: 'hsl(var(--chart-2))' },
  { name: 'Belum Dimulai', value: notStartedCount, fill: 'hsl(var(--chart-3))' },
];

const lessonStatusChartConfig = {
  Selesai: { label: 'Selesai', color: 'hsl(var(--chart-1))' },
  Dikerjakan: { label: 'Dikerjakan', color: 'hsl(var(--chart-2))' },
  'Belum Dimulai': { label: 'Belum Dimulai', color: 'hsl(var(--chart-3))' },
} satisfies import("@/components/ui/chart").ChartConfig;


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
                <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-primary"/> Status Penyelesaian Pelajaran
                </CardTitle>
                <CardDescription>Distribusi status pelajaran Anda saat ini.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] p-4">
                 <ChartContainer config={lessonStatusChartConfig} className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip 
                                cursor={{ fill: "hsl(var(--muted))" }}
                                content={<ChartTooltipContent hideLabel nameKey="name" />} 
                            />
                            <Pie
                                data={lessonStatusData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                labelLine={false}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                    const RADIAN = Math.PI / 180;
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                    return (
                                    <text x={x} y={y} fill="hsl(var(--card-foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12px">
                                        {`${(percent * 100).toFixed(0)}%`}
                                    </text>
                                    );
                                }}
                            >
                                {lessonStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>

        <Card className="shadow-md lg:col-span-2">
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
