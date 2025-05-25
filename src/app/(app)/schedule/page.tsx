
"use client";

import { useEffect, useState } from 'react';
import { mockSchedules, mockClasses, mockTeachers } from '@/lib/mockData';
import type { ScheduleItem, ClassData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Tag, Info, User, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id as LocaleID } from 'date-fns/locale'; // Impor lokal Bahasa Indonesia
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';


export const dynamic = 'force-dynamic';

export default function SchedulePage() {
  const { user } = useAuth();
  const [allSchedules, setAllSchedules] = useState<ScheduleItem[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<ScheduleItem[]>([]);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>(""); // Untuk filter kelas

  useEffect(() => {
    // Simulating fetching schedules and enriching them with class names and teacher names
    const enrichedSchedules = mockSchedules.map(schedule => {
      const classInfo = mockClasses.find(c => c.ID_Kelas === schedule.classId);
      const teacherInfo = mockTeachers.find(t => t.ID_Guru === schedule.teacherId);
      return {
        ...schedule,
        className: classInfo ? `${classInfo.Nama_Kelas} - ${classInfo.jurusan}` : 'Semua Kelas',
        teacherName: teacherInfo ? teacherInfo.Nama_Lengkap : 'Tidak Ditentukan',
      };
    });
    setAllSchedules(enrichedSchedules);
  }, []);

  useEffect(() => {
    let schedulesToDisplay = [...allSchedules];

    // Filter berdasarkan peran dan kelas yang dipilih
    if (user?.role === 'student') {
      const studentClass = mockStudents.find(s => s.Email === user.email)?.Kelas;
      const studentClassData = mockClasses.find(c => c.Nama_Kelas === studentClass); // Asumsi Nama_Kelas unik untuk mencocokkan
      if (studentClassData) {
        schedulesToDisplay = schedulesToDisplay.filter(s => s.classId === studentClassData.ID_Kelas || !s.classId); // Tampilkan jadwal kelas siswa atau jadwal umum
      } else {
        schedulesToDisplay = schedulesToDisplay.filter(s => !s.classId); // Jika siswa tidak punya kelas, hanya tampilkan jadwal umum
      }
    } else if (user?.role === 'teacher') {
        // Filter by selected class if a class is chosen by the teacher
        if (selectedClassFilter && selectedClassFilter !== "all") {
            schedulesToDisplay = schedulesToDisplay.filter(s => s.classId === selectedClassFilter);
        }
        // Teachers can see all schedules by default or filter by class
    }
    // Admin sees all schedules by default, can also use the filter

    // Urutkan berdasarkan tanggal dan waktu
    schedulesToDisplay.sort((a, b) => {
      const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateComparison !== 0) return dateComparison;
      // Jika tanggal sama, coba urutkan berdasarkan waktu mulai (asumsi format HH:MM)
      const timeA = a.time.split(' - ')[0];
      const timeB = b.time.split(' - ')[0];
      return timeA.localeCompare(timeB);
    });

    setFilteredSchedules(schedulesToDisplay);
  }, [allSchedules, user, selectedClassFilter]);

  const getCategoryBadgeColor = (category: ScheduleItem['category']) => {
    switch (category) {
      case 'Pelajaran': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Kuis': return 'bg-green-100 text-green-800 border-green-300';
      case 'Tugas': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Diskusi': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of today for comparison

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Jadwal Pembelajaran</h1>
        </div>
        {(user?.role === 'teacher' || user?.isAdmin) && (
          <div className="w-full sm:w-auto">
            <Label htmlFor="class-filter" className="sr-only">Filter per Kelas</Label>
            <Select value={selectedClassFilter} onValueChange={setSelectedClassFilter}>
              <SelectTrigger id="class-filter" className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter per Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {mockClasses.map(cls => (
                  <SelectItem key={cls.ID_Kelas} value={cls.ID_Kelas}>
                    {cls.Nama_Kelas} - {cls.jurusan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <CardDescription>
        Lihat jadwal pelajaran, kuis, tugas, dan kegiatan lainnya.
        {user?.role === 'teacher' && " Anda dapat mengelola jadwal ini (fitur akan datang)."}
        {user?.role === 'student' && " Ini adalah jadwal untuk kelas Anda dan kegiatan umum."}
      </CardDescription>

      {filteredSchedules.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSchedules.map((item) => {
            const scheduleDate = parseISO(item.date);
            const isPast = scheduleDate < today;
            return (
              <Card key={item.id} className={`shadow-lg overflow-hidden transition-all hover:shadow-xl ${isPast ? 'opacity-60 bg-muted/50' : 'bg-card'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getCategoryBadgeColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    {format(scheduleDate, 'EEEE, dd MMMM yyyy', { locale: LocaleID })}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {item.time}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {item.className && item.classId && (
                    <div className="flex items-center text-muted-foreground">
                      <Tag className="w-4 h-4 mr-2" /> Kelas: {item.className}
                    </div>
                  )}
                  {item.teacherName && (user?.role === 'student' || user?.isAdmin) && (
                     <div className="flex items-center text-muted-foreground">
                      <User className="w-4 h-4 mr-2" /> Guru: {item.teacherName}
                    </div>
                  )}
                  {item.description && (
                    <div className="flex items-start text-muted-foreground">
                      <Info className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                      <p>{item.description}</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.lessonId && getLessonById(item.lessonId) && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/lessons/${item.lessonId}`}>
                          <LinkIcon className="w-3 h-3 mr-1.5" /> Lihat Pelajaran
                        </Link>
                      </Button>
                    )}
                    {item.quizId && getQuizById(item.quizId) &&(
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/quizzes/${item.quizId}`}>
                           <LinkIcon className="w-3 h-3 mr-1.5" /> Kerjakan Kuis
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <AlertTriangle className="w-12 h-12 mb-4 text-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground">
              Tidak ada jadwal pembelajaran yang tersedia.
            </p>
            <p className="text-sm text-muted-foreground">
              {selectedClassFilter && selectedClassFilter !== "all" ? "Tidak ada jadwal untuk kelas yang dipilih." : "Silakan periksa kembali nanti atau hubungi administrator."}
            </p>
          </CardContent>
        </Card>
      )}
       {user?.role === 'teacher' && (
        <p className="mt-6 text-sm text-center text-muted-foreground">
          Fitur untuk menambah, mengedit, dan menghapus jadwal akan ditambahkan pada iterasi berikutnya.
        </p>
      )}
    </div>
  );
}

// Helper function to get lesson (already in mockData.ts)
function getLessonById(id: string) {
  return mockLessons.find(lesson => lesson.id === id);
}
// Helper function to get quiz (already in mockData.ts)
function getQuizById(id: string) {
  return mockQuizzes.find(quiz => quiz.id === id);
}
