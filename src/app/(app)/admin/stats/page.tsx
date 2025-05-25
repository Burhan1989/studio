"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpenCheck, Activity, BarChartBig, TrendingUp, Percent, FileQuestion } from "lucide-react";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock Data (Sementara)
const mockStats = {
  totalUsers: 1250,
  activeCourses: 75,
  completedLessons: 5600,
  averageCompletionRate: 65.5,
  newUsersThisMonth: 150,
  quizAttempts: 2300,
};

const userGrowthData = [
  { month: "Jan", users: 65 },
  { month: "Feb", users: 59 },
  { month: "Mar", users: 80 },
  { month: "Apr", users: 81 },
  { month: "Mei", users: 56 },
  { month: "Jun", users: 70 },
  { month: "Jul", users: 40 },
];

const chartConfig = {
  users: {
    label: "Pengguna Baru",
    color: "hsl(var(--chart-1))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;


export default function AdminStatsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <BarChartBig className="w-10 h-10 text-primary" />
        <h1 className="text-3xl font-bold">Statistik Situs</h1>
      </div>
      <CardDescription>Pantau metrik kunci dan performa platform AdeptLearn.</CardDescription>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Pengguna terdaftar di platform</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Kursus Aktif</CardTitle>
            <BookOpenCheck className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeCourses}</div>
            <p className="text-xs text-muted-foreground">Jumlah kursus yang tersedia</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pelajaran Selesai</CardTitle>
            <Activity className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.completedLessons.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total pelajaran yang diselesaikan pengguna</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tingkat Penyelesaian Rata-Rata</CardTitle>
            <Percent className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.averageCompletionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Rata-rata penyelesaian kursus</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pengguna Baru (Bulan Ini)</CardTitle>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.newUsersThisMonth}</div>
            <p className="text-xs text-muted-foreground">Pendaftaran baru bulan ini</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Percobaan Kuis</CardTitle>
            <FileQuestion className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.quizAttempts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total kuis yang telah dikerjakan</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Grafik Pertumbuhan Pengguna (Contoh)</CardTitle>
            <CardDescription>Visualisasi pertumbuhan pengguna baru per bulan.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] p-4">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData} margin={{ top: 5, right: 20, left: -5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                  <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Legend />
                  <Bar dataKey="users" fill="var(--color-users)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
      </Card>
      
    </div>
  );
}
