
"use client"

import type { UserProgress } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartTooltipContent,
  ChartContainer
} from "@/components/ui/chart"


interface ScoreChartProps {
  quizScores: UserProgress['quizScores'];
}

const chartConfig = {
  score: {
    label: "Skor",
    color: "hsl(var(--primary))",
  },
} satisfies import("@/components/ui/chart").ChartConfig

export default function ScoreChart({ quizScores }: ScoreChartProps) {
  const chartData = quizScores.map(qs => ({
    name: `Kuis ${qs.quizId.slice(-2)}`, // Shorten quizId for display
    score: (qs.score / qs.totalQuestions) * 100,
  }));

  if (quizScores.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Performa Kuis</CardTitle>
          <CardDescription>Tidak ada data kuis yang tersedia untuk ditampilkan.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Ambil beberapa kuis untuk melihat performa Anda di sini!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Performa Kuis (%)</CardTitle>
        <CardDescription>Skor Anda pada kuis terbaru.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Legend />
              <Bar dataKey="score" fill="var(--color-score)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
