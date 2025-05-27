
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, Loader2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { getLessonById, updateLesson, getQuizzes } from "@/lib/mockData";
import type { Lesson, Quiz } from "@/lib/types";

const editLessonSchema = z.object({
  title: z.string().min(3, "Judul pelajaran minimal 3 karakter."),
  content: z.string().min(20, "Konten pelajaran minimal 20 karakter."),
  videoUrl: z.string().url("URL Video tidak valid.").optional().or(z.literal("")),
  quizId: z.string().optional(),
  estimatedTime: z.string().min(3, "Estimasi waktu minimal 3 karakter."),
  difficulty: z.enum(["Pemula", "Menengah", "Mahir"], { required_error: "Kesulitan harus dipilih." }),
});

type EditLessonFormData = z.infer<typeof editLessonSchema>;

export default function AdminEditCoursePage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<Lesson | null>(null);
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([]);

  const form = useForm<EditLessonFormData>({
    resolver: zodResolver(editLessonSchema),
    defaultValues: {
      title: "",
      content: "",
      videoUrl: "",
      quizId: "_NO_QUIZ_",
      estimatedTime: "",
      difficulty: "Pemula",
    },
  });

  useEffect(() => {
    setAvailableQuizzes(getQuizzes());
    if (lessonId) {
      const lessonData = getLessonById(lessonId);
      if (lessonData) {
        setInitialData(lessonData);
        form.reset({
          title: lessonData.title,
          content: lessonData.content,
          videoUrl: lessonData.videoUrl || "",
          quizId: lessonData.quizId || "_NO_QUIZ_",
          estimatedTime: lessonData.estimatedTime,
          difficulty: lessonData.difficulty,
        });
      } else {
        toast({
          title: "Pelajaran Tidak Ditemukan",
          description: `Pelajaran dengan ID ${lessonId} tidak ditemukan.`,
          variant: "destructive",
        });
        router.push("/admin/courses");
      }
    }
  }, [lessonId, form, router, toast]);

  async function onSubmit(values: EditLessonFormData) {
    if (!initialData) return;
    setIsLoading(true);
    
    const updatedLessonData: Lesson = {
      ...initialData,
      title: values.title,
      content: values.content,
      videoUrl: values.videoUrl,
      quizId: values.quizId === "_NO_QUIZ_" ? undefined : values.quizId,
      estimatedTime: values.estimatedTime,
      difficulty: values.difficulty,
    };
    
    updateLesson(updatedLessonData);

    toast({
      title: "Data Pelajaran Diperbarui",
      description: `Informasi pelajaran "${values.title}" telah berhasil diperbarui.`,
    });
    router.push("/admin/courses");
    router.refresh(); 
    setIsLoading(false);
  }

  if (!initialData && !form.formState.isSubmitting) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center">
            <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Memuat data pelajaran...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Edit className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Edit Pelajaran: {initialData?.title}</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/courses">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Kelola Pelajaran
          </Link>
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Detail Pelajaran</CardTitle>
              <CardDescription>Perbarui detail pelajaran di bawah ini.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Judul Pelajaran</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Dasar-dasar Pemrograman Python" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Konten Pelajaran</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Masukkan konten utama pelajaran di sini..." className="min-h-[200px]" {...field} />
                    </FormControl>
                     <FormDescription>Anda dapat menggunakan format markdown sederhana.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="estimatedTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimasi Waktu</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. 1 jam 30 menit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tingkat Kesulitan</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tingkat kesulitan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pemula">Pemula</SelectItem>
                        <SelectItem value="Menengah">Menengah</SelectItem>
                        <SelectItem value="Mahir">Mahir</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>URL Video (Opsional)</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://contoh.com/video-pelajaran.mp4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quizId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Kuis Terkait (Opsional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "_NO_QUIZ_"} defaultValue={field.value || "_NO_QUIZ_"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kuis terkait (jika ada)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="_NO_QUIZ_">Tidak Ada Kuis Terkait</SelectItem>
                        {availableQuizzes.map((quiz) => (
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
            </CardContent>
             <CardFooter className="flex justify-end p-6">
                <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                Simpan Perubahan
                </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

    