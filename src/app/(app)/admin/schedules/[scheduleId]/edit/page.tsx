
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
import { CalendarDays, Save, Loader2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import type { ScheduleItem, ClassData, TeacherData, Lesson, Quiz } from "@/lib/types";
import { getScheduleById, updateSchedule, mockClasses, mockTeachers, mockLessons, mockQuizzes } from "@/lib/mockData";
import { format, getDay, addDays, startOfWeek, setDay, parseISO } from "date-fns";

const scheduleCategories = ['Pelajaran', 'Kuis', 'Tugas', 'Diskusi', 'Lainnya'] as const;
const daysOfWeek = [
  { value: "1", label: "Senin" }, // Monday
  { value: "2", label: "Selasa" }, // Tuesday
  { value: "3", label: "Rabu" },   // Wednesday
  { value: "4", label: "Kamis" },  // Thursday
  { value: "5", label: "Jumat" },  // Friday
  { value: "6", label: "Sabtu" },  // Saturday
] as const;

const editScheduleSchema = z.object({
  title: z.string().min(3, "Judul jadwal minimal 3 karakter."),
  dayOfWeek: z.string().min(1, "Hari harus dipilih."),
  time: z.string().min(5, "Waktu harus diisi, cth. 08:00 - 09:30."),
  classId: z.string().optional(),
  teacherId: z.string().optional(),
  lessonId: z.string().optional(),
  quizId: z.string().optional(),
  description: z.string().optional(),
  category: z.enum(scheduleCategories, { required_error: "Kategori harus dipilih." }),
});

type EditScheduleFormData = z.infer<typeof editScheduleSchema>;

export default function AdminEditSchedulePage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const scheduleId = params.scheduleId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<ScheduleItem | null>(null);

  const form = useForm<EditScheduleFormData>({
    resolver: zodResolver(editScheduleSchema),
    defaultValues: {
      title: "",
      dayOfWeek: "",
      time: "",
      classId: undefined,
      teacherId: undefined,
      lessonId: undefined,
      quizId: undefined,
      description: "",
      category: "Pelajaran",
    },
  });

  useEffect(() => {
    if (scheduleId) {
      const scheduleData = getScheduleById(scheduleId);
      if (scheduleData) {
        setInitialData(scheduleData);
        const scheduleDateObj = parseISO(scheduleData.date);
        // getDay: Sunday is 0, Monday is 1, etc. Align with our 1-6 values.
        const dayVal = getDay(scheduleDateObj) === 0 ? "7" : String(getDay(scheduleDateObj)); // Should not be 7, adjust if needed

        form.reset({
          title: scheduleData.title,
          dayOfWeek: dayVal,
          time: scheduleData.time,
          classId: scheduleData.classId || "_NO_CLASS_",
          teacherId: scheduleData.teacherId || "_NO_TEACHER_",
          lessonId: scheduleData.lessonId || "_NO_LESSON_",
          quizId: scheduleData.quizId || "_NO_QUIZ_",
          description: scheduleData.description || "",
          category: scheduleData.category,
        });
      } else {
        toast({
          title: "Jadwal Tidak Ditemukan",
          description: `Jadwal dengan ID ${scheduleId} tidak ditemukan.`,
          variant: "destructive",
        });
        router.push("/admin");
      }
    }
  }, [scheduleId, form, router, toast]);

  function calculateDateForSelectedDayEdit(dayValue: string, originalDateStr: string): string {
    const selectedDayNumber = parseInt(dayValue, 10); // 1 for Mon, ..., 6 for Sat
    const originalDate = parseISO(originalDateStr);
    
    // Set the day of the week within the same week as the original date
    const targetDate = setDay(originalDate, selectedDayNumber, { weekStartsOn: 1 });
    
    return format(targetDate, "yyyy-MM-dd");
  }

  async function onSubmit(values: EditScheduleFormData) {
    if (!initialData) return;
    setIsLoading(true);

    const calculatedDate = calculateDateForSelectedDayEdit(values.dayOfWeek, initialData.date);
    
    const updatedScheduleData: ScheduleItem = {
      ...initialData, 
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
    
    console.log("Data jadwal yang akan diperbarui (simulasi):", updatedScheduleData);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    const success = updateSchedule(updatedScheduleData); 

    if (success) {
      toast({
        title: "Jadwal Diperbarui",
        description: `Jadwal "${values.title}" untuk ${format(new Date(calculatedDate), 'EEEE, dd MMMM yyyy')} telah berhasil diperbarui.`,
      });
      router.push("/admin"); 
      router.refresh(); 
    } else {
       toast({
        title: "Gagal Memperbarui Jadwal",
        description: "Terjadi kesalahan saat memperbarui data jadwal.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  if (!initialData && !form.formState.isSubmitting) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center">
            <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Memuat data jadwal...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Edit Jadwal: {initialData?.title}</h1>
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
              <CardDescription>Perbarui detail jadwal di bawah ini. Tanggal akan dihitung berdasarkan hari yang dipilih dalam minggu jadwal asli.</CardDescription>
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
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value || "_NO_CLASS_"} defaultValue={field.value || "_NO_CLASS_"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kelas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="_NO_CLASS_">Umum (Semua Kelas)</SelectItem>
                        {mockClasses.map((cls) => (
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
                     <Select onValueChange={field.onChange} value={field.value || "_NO_TEACHER_"} defaultValue={field.value || "_NO_TEACHER_"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih guru" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="_NO_TEACHER_">Tidak Ditentukan</SelectItem>
                        {mockTeachers.filter(t => !t.isAdmin).map((teacher) => (
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
                    <Select onValueChange={field.onChange} value={field.value || "_NO_LESSON_"} defaultValue={field.value || "_NO_LESSON_"}>
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
                    <Select onValueChange={field.onChange} value={field.value || "_NO_QUIZ_"} defaultValue={field.value || "_NO_QUIZ_"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kuis terkait" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="_NO_QUIZ_">Tidak Terkait Kuis</SelectItem>
                        {mockQuizzes.map((quiz) => (
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
                Simpan Perubahan Jadwal
                </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

    