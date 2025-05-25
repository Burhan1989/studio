
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, BrainCircuit, Target, CheckCircle, ListChecks } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { mockSchoolProfile } from '@/lib/mockData'; // Import data sekolah

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock data
  const currentModule = {
    title: "Pengenalan JavaScript", 
    progress: 65,
    nextLesson: "Variabel dan Tipe Data", 
  };

  const upcomingActivities = [
    { type: "Kuis", title: "Kuis Sintaks Dasar", due: "Besok" },
    { type: "Pelajaran", title: "Fungsi dalam JavaScript", due: "Minggu Depan" },
  ];

  const overallProgress = 42; 

  return (
    <div className="space-y-8">
      <div className="p-6 mb-8 rounded-lg shadow bg-gradient-to-r from-primary to-blue-400 text-primary-foreground">
        <h1 className="text-3xl font-bold">Selamat datang kembali, {user?.name || user?.email}!</h1>
        <p className="mt-1 text-lg opacity-90">
          Mari lanjutkan perjalanan belajar Anda di {mockSchoolProfile.namaSekolah || 'AdeptLearn'}.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Modul Saat Ini
            </CardTitle>
            <CardDescription>{currentModule.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={currentModule.progress} className="w-full mb-2 h-3" />
            <p className="text-sm text-muted-foreground">{currentModule.progress}% selesai</p>
            <p className="mt-2 text-sm">Berikutnya: <strong>{currentModule.nextLesson}</strong></p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/lessons/1">Lanjutkan Belajar</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-accent-foreground" /> 
              Kemajuan Keseluruhan
            </CardTitle>
            <CardDescription>Penyelesaian jalur belajar Anda.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
             <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-muted/30"
                  strokeWidth="3"
                  fill="none"
                  stroke="currentColor"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary"
                  strokeWidth="3"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${overallProgress}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">{overallProgress}%</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Pertahankan kerja bagus ini!</p>
          </CardContent>
           <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/reports">Lihat Laporan Rinci</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="w-6 h-6 text-primary" />
              Pembelajaran Adaptif
            </CardTitle>
            <CardDescription>Sesuaikan pengalaman belajar Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <Image 
              src="https://placehold.co/300x150.png" 
              alt="Pembelajaran Adaptif" 
              width={300} 
              height={150} 
              className="w-full mb-4 rounded-md"
              data-ai-hint="abstract brain"
            />
            <p className="text-sm text-muted-foreground">
              AI kami dapat membantu Anda menyesuaikan jalur belajar, kuis, dan sumber daya agar sesuai dengan gaya Anda.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/learning-path">Sesuaikan Jalur Anda</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="w-6 h-6 text-primary" />
            Aktivitas Mendatang
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingActivities.length > 0 ? (
            <ul className="space-y-3">
              {upcomingActivities.map((activity, index) => (
                <li key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                  <div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${activity.type === "Kuis" ? "bg-orange-200 text-orange-800" : "bg-blue-200 text-blue-800"}`}>
                      {activity.type}
                    </span>
                    <p className="mt-1 font-medium">{activity.title}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.due}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Tidak ada aktivitas mendatang yang dijadwalkan.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
