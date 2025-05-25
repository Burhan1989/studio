
"use client";

import { useEffect, useState } from 'react';
import { mockSchedules, mockClasses, mockTeachers, mockStudents, getLessonById, getQuizById } from '@/lib/mockData';
import type { ScheduleItem, ClassData, StudentData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Tag, Info, User, Link as LinkIcon, AlertTriangle, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { 
  format, 
  parseISO, 
  isSameDay, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addDays, 
  subDays, 
  addWeeks, 
  subWeeks,
  getDay 
} from 'date-fns';
import { id as LocaleID } from 'date-fns/locale';
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

type ViewMode = 'daily' | 'weekly';

interface DayWithSchedules {
  date: Date;
  schedules: ScheduleItem[];
}

export default function SchedulePage() {
  const { user } = useAuth();
  const [allSchedules, setAllSchedules] = useState<ScheduleItem[]>([]);
  const [studentClassInfo, setStudentClassInfo] = useState<ClassData | null>(null);
  
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 })); 

  const [selectedClassFilter, setSelectedClassFilter] = useState<string>(""); 

  const [displayableSchedules, setDisplayableSchedules] = useState<ScheduleItem[]>([]);
  
  const [weeklyViewData, setWeeklyViewData] = useState<DayWithSchedules[]>([]);


  useEffect(() => {
    const enrichedSchedules = mockSchedules.map(schedule => {
      const classInfo = mockClasses.find(c => c.ID_Kelas === schedule.classId);
      const teacherInfo = mockTeachers.find(t => t.ID_Guru === schedule.teacherId);
      return {
        ...schedule,
        className: classInfo ? `${classInfo.Nama_Kelas} - ${classInfo.jurusan}` : 'Umum (Semua Kelas)',
        teacherName: teacherInfo ? teacherInfo.Nama_Lengkap : 'Tidak Ditentukan',
      };
    });
    setAllSchedules(enrichedSchedules);
  }, []);

  useEffect(() => {
    if (user?.role === 'student' && user.email) {
        const studentData = mockStudents.find(s => s.Email === user.email);
        if (studentData) {
            const classData = mockClasses.find(c => c.Nama_Kelas === studentData.Kelas && c.jurusan === studentData.Program_Studi);
            setStudentClassInfo(classData || null);
        } else {
            setStudentClassInfo(null);
        }
    } else {
        setStudentClassInfo(null);
    }
  }, [user]);

  useEffect(() => {
    let schedulesToFilter = [...allSchedules];

    if (user?.role === 'student') {
      if (studentClassInfo) {
        schedulesToFilter = schedulesToFilter.filter(s => s.classId === studentClassInfo.ID_Kelas || !s.classId);
      } else {
        schedulesToFilter = schedulesToFilter.filter(s => !s.classId);
      }
    } else if (user?.role === 'teacher' || user?.isAdmin) {
        if (selectedClassFilter && selectedClassFilter !== "all") {
            schedulesToFilter = schedulesToFilter.filter(s => s.classId === selectedClassFilter);
        }
    }
    
    if (viewMode === 'daily') {
        const dailyFiltered = schedulesToFilter.filter(s => isSameDay(parseISO(s.date), currentDate));
        setDisplayableSchedules(dailyFiltered.sort((a, b) => a.time.localeCompare(b.time)));
    } else if (viewMode === 'weekly') {
        const weekEnd = addDays(currentWeekStart, 5); // Monday (0) + 5 days = Saturday (5)
        const weeklyFiltered = schedulesToFilter.filter(s => {
            const scheduleDate = parseISO(s.date);
            // Display Monday (1) to Saturday (6)
            return scheduleDate >= currentWeekStart && scheduleDate <= weekEnd && getDay(scheduleDate) >= 1 && getDay(scheduleDate) <= 6; 
        });
        setDisplayableSchedules(weeklyFiltered);

        const daysInDisplayWeek = eachDayOfInterval({ start: currentWeekStart, end: weekEnd })
                                    .filter(day => getDay(day) >= 1 && getDay(day) <= 6); // Mon-Sat

        const newWeeklyViewData = daysInDisplayWeek.map(day => ({
            date: day,
            schedules: weeklyFiltered
                .filter(s => isSameDay(parseISO(s.date), day))
                .sort((a, b) => a.time.localeCompare(b.time))
        }));
        setWeeklyViewData(newWeeklyViewData);
    }

  }, [allSchedules, user, studentClassInfo, selectedClassFilter, viewMode, currentDate, currentWeekStart]);


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
  today.setHours(0, 0, 0, 0);

  const ScheduleCard = ({ item }: { item: ScheduleItem }) => {
    const scheduleDate = parseISO(item.date);
    const isPast = scheduleDate < today && !isSameDay(scheduleDate, today); // Mark as past if before today
    return (
        <Card className={`shadow-md overflow-hidden transition-all hover:shadow-lg ${isPast ? 'opacity-70 bg-muted/30' : 'bg-card'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-lg">{item.title}</CardTitle>
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
          {item.teacherName && (user?.role === 'student' || user?.isAdmin || (user?.role === 'teacher' && user.id !== item.teacherId)) && (
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
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Jadwal Pembelajaran</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant={viewMode === 'daily' ? 'default' : 'outline'} onClick={() => setViewMode('daily')}>Tampilan Harian</Button>
          <Button variant={viewMode === 'weekly' ? 'default' : 'outline'} onClick={() => setViewMode('weekly')}>Tampilan Mingguan</Button>
           {(user?.isAdmin || user?.role === 'teacher') && (
            <Button asChild>
                <Link href="/admin/schedules/new">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Tambah Jadwal
                </Link>
            </Button>
          )}
        </div>
      </div>
      
      <CardDescription>
        Lihat jadwal pelajaran, kuis, tugas, dan kegiatan lainnya.
        {user?.role === 'teacher' && " Anda dapat mengelola jadwal ini."}
        {user?.role === 'student' && studentClassInfo && ` Ini adalah jadwal untuk kelas Anda (${studentClassInfo.Nama_Kelas} - ${studentClassInfo.jurusan}) dan kegiatan umum.`}
        {user?.role === 'student' && !studentClassInfo && " Ini adalah jadwal kegiatan umum. Data kelas Anda tidak ditemukan."}
      </CardDescription>

      {(user?.role === 'teacher' || user?.isAdmin) && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="w-full sm:w-auto sm:max-w-xs">
              <Label htmlFor="class-filter">Filter per Kelas</Label>
              <Select value={selectedClassFilter} onValueChange={setSelectedClassFilter}>
                <SelectTrigger id="class-filter" className="w-full">
                  <SelectValue placeholder="Semua Kelas" />
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
          </div>
        )}

      <Card className="shadow-md">
        <CardHeader>
          {viewMode === 'daily' && (
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={() => setCurrentDate(subDays(currentDate, 1))}><ChevronLeft /></Button>
              <CardTitle className="text-xl text-center">
                {format(currentDate, 'EEEE, dd MMMM yyyy', { locale: LocaleID })}
              </CardTitle>
              <Button variant="outline" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 1))}><ChevronRight /></Button>
            </div>
          )}
          {viewMode === 'weekly' && (
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}><ChevronLeft /></Button>
              <CardTitle className="text-xl text-center">
                Minggu: {format(currentWeekStart, 'dd MMM', { locale: LocaleID })} - {format(addDays(currentWeekStart,5), 'dd MMM yyyy', { locale: LocaleID })}
              </CardTitle>
              <Button variant="outline" size="icon" onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}><ChevronRight /></Button>
            </div>
          )}
          <div className="flex justify-center mt-2">
            {viewMode === 'daily' && <Button variant="ghost" onClick={() => setCurrentDate(new Date())}>Ke Hari Ini</Button>}
            {viewMode === 'weekly' && <Button variant="ghost" onClick={() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>Ke Minggu Ini</Button>}
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'daily' && (
            displayableSchedules.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {displayableSchedules.map(item => <ScheduleCard key={item.id} item={item} />)}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Tidak ada jadwal untuk hari ini.</p>
            )
          )}

          {viewMode === 'weekly' && (
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"> {/* Adjusted to 3 cols for wider day cards */}
              {weeklyViewData.map(dayData => (
                <div key={dayData.date.toISOString()} className="p-3 border rounded-lg bg-background/50">
                  <h3 className="mb-3 font-semibold text-center text-md">
                    {format(dayData.date, 'EEEE', { locale: LocaleID })}
                    <span className="block text-xs text-muted-foreground">{format(dayData.date, 'dd MMM', { locale: LocaleID })}</span>
                  </h3>
                  {dayData.schedules.length > 0 ? (
                    <div className="space-y-3">
                      {dayData.schedules.map(item => <ScheduleCard key={item.id} item={item} />)}
                    </div>
                  ) : (
                    <p className="text-sm text-center text-muted-foreground">Tidak ada jadwal.</p>
                  )}
                </div>
              ))}
            </div>
          )}
          {(viewMode === 'weekly' && weeklyViewData.every(d => d.schedules.length === 0)) && (
             <p className="mt-4 text-center text-muted-foreground">Tidak ada jadwal untuk minggu ini.</p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

