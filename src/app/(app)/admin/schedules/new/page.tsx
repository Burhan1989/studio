
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
import { addSchedule, mockClasses, mockTeachers, mockLessons, mockQuizzes } from "@/lib/mockData";

const scheduleCategories = ['Pelajaran', 'Kuis', 'Tugas', 'Diskusi', 'Lainnya'] as const;

const newScheduleSchema = z.object({
  title: z.string().min(3, "Judul jadwal minimal 3 karakter."),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Tanggal tidak valid." }),
  time: z.string().min(5, "Waktu harus diisi, cth. 08:00 - 09:30."),
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
      date: new Date().toISOString().split('T')[0], // Default to today
      time: "",
      classId: "_NO_CLASS_",
      teacherId: "_NO_TEACHER_",
      lessonId: "_NO_LESSON_",
      quizId: "_NO_QUIZ_",
      description: "",
      category: "Pelajaran",
    },
  });

  async function onSubmit(values: NewScheduleFormData) {
    setIsLoading(true);
    
    const newScheduleData: Omit<ScheduleItem, 'id' | 'className' | 'teacherName'> = {
      title: values.title,
      date: values.date,
      time: values.time,
      classId: values.classId === "_NO_CLASS_" ? undefined : values.classId,
      teacherId: values.teacherId === "_NO_TEACHER_" ? undefined : values.teacherId,
      lessonId: values.lessonId === "_NO_LESSON_" ? undefined : values.lessonId,
      quizId: values.quizId === "_NO_QUIZ_" ? undefined : values.quizId,
      description: values.description,
      category: values.category,
    };
    
    console.log("Data jadwal baru yang akan ditambahkan (simulasi):", newScheduleData);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    const addedSchedule = addSchedule(newScheduleData); 

    if (addedSchedule) {
      toast({
        title: "Jadwal Baru Ditambahkan",
        description: `Jadwal "${values.title}" telah berhasil ditambahkan.`,
      });
      router.push("/admin"); // Redirect to admin dashboard
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
              <CardDescription>Lengkapi semua field yang diperlukan.</CardDescription>
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
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
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                Simpan Jadwal Baru
                </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
