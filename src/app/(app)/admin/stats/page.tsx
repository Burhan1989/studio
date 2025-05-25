"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpenCheck, Activity, BarChartBig, TrendingUp, Percent } from "lucide-react";

// Mock Data (Sementara)
const mockStats = {
  totalUsers: 1250,
  activeCourses: 75,
  completedLessons: 5600,
  averageCompletionRate: 65.5,
  newUsersThisMonth: 150,
  quizAttempts: 2300,
};

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
            <CardDescription>Visualisasi pertumbuhan pengguna dari waktu ke waktu.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 bg-muted/50 rounded-md">
            <p className="text-muted-foreground">Placeholder untuk grafik pertumbuhan pengguna</p>
             {/* Di sini bisa ditambahkan komponen chart dari ShadCN/Recharts jika sudah siap */}
        </CardContent>
      </Card>
      
    </div>
  );
}
