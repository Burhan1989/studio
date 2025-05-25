
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CalendarPlus, Save, Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ScheduleItem } from "@/lib/types";
import { addSchedule, getClasses, getTeachers, mockLessons, getQuizzes } from "@/lib/mockData";
import { format, getDay, addDays, startOfWeek, nextMonday, nextTuesday, nextWednesday, nextThursday, nextFriday, nextSaturday, isPast, setDay } from "date-fns";
import { id as LocaleID } from 'date-fns/locale';

const scheduleCategories = ['Pelajaran', 'Kuis', 'Tugas', 'Diskusi', 'Lainnya'] as const;
const daysOfWeek = [
  { value: "1", label: "Senin" }, // Monday
  { value: "2", label: "Selasa" }, // Tuesday
  { value: "3", label: "Rabu" },   // Wednesday
  { value: "4", label: "Kamis" },  // Thursday
  { value: "5", label: "Jumat" },  // Friday
  { value: "6", label: "Sabtu" },  // Saturday
] as const;


const newScheduleSchema = z.object({
  title: z.string().min(3, "Judul jadwal minimal 3 karakter."),
  dayOfWeek: z.string().min(1, "Hari harus dipilih."),
  time: z.string().min(5, "Waktu harus diisi, cth. 08:00 - 09:30.").regex(/^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/, "Format waktu tidak valid, cth. 08:00 - 09:30"),
  classId: z.string().optional(),
  teacherId: z.string().optional(),
  lessonId: z.string().optional(),
  quizId: z.string().optional(),
  description: z.string().optional(),
  category: z.enum(scheduleCategories, { required_error: "Kategori harus dipilih." }),
});

type NewScheduleFormData = z.infer<typeof newScheduleSchema>;

export default function AdminNewSchedulePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<NewScheduleFormData>({
    resolver: zodResolver(newScheduleSchema),
    defaultValues: {
      title: "",
      dayOfWeek: "", 
      time: "",
      classId: "_NO_CLASS_",
      teacherId: "_NO_TEACHER_",
      lessonId: "_NO_LESSON_",
      quizId: "_NO_QUIZ_",
      description: "",
      category: "Pelajaran",
    },
  });

  function calculateDateForSelectedDay(dayValue: string): string {
    const selectedDayNumber = parseInt(dayValue, 10); 
    let targetDate = new Date();
    
    // Determine the current week's Monday
    const currentWeekMonday = startOfWeek(targetDate, { weekStartsOn: 1 }); 
    
    // Target day in the current week
    let potentialTargetDate = setDay(currentWeekMonday, selectedDayNumber, { weekStartsOn: 1 });

    const today = new Date();
    today.setHours(0,0,0,0); 

    if (potentialTargetDate < today) {
        targetDate = setDay(addDays(currentWeekMonday, 7), selectedDayNumber, { weekStartsOn: 1 });
    } else {
        targetDate = potentialTargetDate;
    }
    return format(targetDate, "yyyy-MM-dd");
  }


  async function onSubmit(values: NewScheduleFormData) {
    setIsLoading(true);

    const calculatedDate = calculateDateForSelectedDay(values.dayOfWeek);
    
    const newScheduleData: Omit<ScheduleItem, 'id' | 'className' | 'teacherName'> = {
      title: values.title,
      date: calculatedDate, 
      time: values.time,
      classId: values.classId === "_NO_CLASS_" ? undefined : values.classId,
      teacherId: values.teacherId === "_NO_TEACHER_" ? undefined : values.teacherId,
      lessonId: values.lessonId === "_NO_LESSON_" ? undefined : values.lessonId,
      quizId: values.quizId === "_NO_QUIZ_" ? undefined : values.quizId,
      description: values.description,
      category: values.category,
    };
    
    console.log("Data jadwal baru yang akan ditambahkan (simulasi):", newScheduleData);
    
    const addedSchedule = addSchedule(newScheduleData); 

    if (addedSchedule) {
      toast({
        title: "Jadwal Baru Ditambahkan",
        description: `Jadwal "${values.title}" untuk ${format(parseISO(addedSchedule.date), 'EEEE, dd MMMM yyyy', { locale: LocaleID })} telah berhasil ditambahkan.`,
      });
      router.push("/admin"); 
      router.refresh(); 
    } else {
       toast({
        title: "Gagal Menambahkan Jadwal",
        description: "Terjadi kesalahan saat menambahkan data jadwal.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarPlus className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Tambah Jadwal Pembelajaran Baru</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Dasbor Admin
          </Link>
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Detail Jadwal Pembelajaran</CardTitle>
              <CardDescription>Lengkapi semua field yang diperlukan. Tanggal akan dihitung otomatis berdasarkan hari yang dipilih (untuk minggu ini/depan).</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Judul Kegiatan</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Pelajaran Matematika Bab 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dayOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hari</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih hari" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {daysOfWeek.map(day => (
                          <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waktu</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. 08:00 - 09:30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori Jadwal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {scheduleCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kelas (Opsional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kelas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="_NO_CLASS_">Umum (Semua Kelas)</SelectItem>
                        {getClasses().map((cls) => (
                          <SelectItem key={cls.ID_Kelas} value={cls.ID_Kelas}>
                            {cls.Nama_Kelas} - {cls.jurusan}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guru (Opsional)</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih guru" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="_NO_TEACHER_">Tidak Ditentukan</SelectItem>
                        {getTeachers().filter(t => !t.isAdmin).map((teacher) => (
                          <SelectItem key={teacher.ID_Guru} value={teacher.ID_Guru}>
                            {teacher.Nama_Lengkap}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lessonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pelajaran Terkait (Opsional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih pelajaran terkait" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="_NO_LESSON_">Tidak Terkait Pelajaran</SelectItem>
                        {mockLessons.map((lesson) => (
                          <SelectItem key={lesson.id} value={lesson.id}>
                            {lesson.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="quizId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kuis Terkait (Opsional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kuis terkait" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="_NO_QUIZ_">Tidak Terkait Kuis</SelectItem>
                        {getQuizzes().map((quiz) => (
                          <SelectItem key={quiz.id} value={quiz.id}>
                            {quiz.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Deskripsi Tambahan (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Catatan atau detail tambahan mengenai jadwal ini..." {...field} className="min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
             <CardFooter className="flex justify-end p-6">
                <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                Simpan Jadwal Baru
                </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
