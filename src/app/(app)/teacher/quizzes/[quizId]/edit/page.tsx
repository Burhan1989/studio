
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FilePenLine, Save, Loader2, ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getQuizById, updateQuiz, mockClasses } from "@/lib/mockData";
import type { Question, Quiz, ClassData } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const questionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(5, "Teks pertanyaan minimal 5 karakter."),
  type: z.enum(["multiple-choice", "true-false", "essay"], {
    required_error: "Tipe pertanyaan harus dipilih.",
  }),
  options: z.array(z.string().min(1, "Opsi tidak boleh kosong.")).optional(),
  correctAnswer: z.union([z.string(), z.boolean()]).optional(),
  points: z.coerce.number().int().min(1, "Poin minimal 1 untuk setiap pertanyaan.").default(1),
});

const editQuizSchema = z.object({
  title: z.string().min(3, "Judul kuis minimal 3 karakter."),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, "Kuis harus memiliki setidaknya satu pertanyaan."),
  assignedClassIds: z.array(z.string()).optional(),
});

type EditQuizFormData = z.infer<typeof editQuizSchema>;

export default function TeacherEditQuizPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId as string;
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [initialQuizData, setInitialQuizData] = useState<Quiz | null>(null);
  const availableClasses: ClassData[] = mockClasses; 

  const form = useForm<EditQuizFormData>({
    resolver: zodResolver(editQuizSchema),
    defaultValues: {
      title: "",
      description: "",
      questions: [],
      assignedClassIds: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  useEffect(() => {
    if (quizId) {
      const quizData = getQuizById(quizId);
      if (quizData) {
        // Make sure teacherId matches or user is admin (not strictly enforced yet for mock)
        if (user && (quizData.teacherId === user.id || user.isAdmin)) {
          setInitialQuizData(quizData);
          form.reset({
            title: quizData.title,
            description: quizData.description || "",
            questions: quizData.questions.map(q => ({ // Ensure all fields are present for react-hook-form
                id: q.id,
                text: q.text,
                type: q.type,
                options: q.options || (q.type === 'multiple-choice' ? ["", "", "", ""] : []),
                correctAnswer: q.correctAnswer,
                points: q.points || 1
            })),
            assignedClassIds: quizData.assignedClassIds || [],
          });
        } else {
          toast({ title: "Akses Ditolak", description: "Anda tidak memiliki izin untuk mengedit kuis ini.", variant: "destructive" });
          router.push("/teacher/quizzes");
        }
      } else {
        toast({ title: "Kuis Tidak Ditemukan", description: `Kuis dengan ID ${quizId} tidak ditemukan.`, variant: "destructive" });
        router.push("/teacher/quizzes");
      }
    }
  }, [quizId, user, router, toast, form]);


  async function onSubmit(values: EditQuizFormData) {
    if (!user || !initialQuizData) {
      toast({ title: "Kesalahan", description: "Tidak dapat menyimpan kuis.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    const updatedQuizData: Quiz = {
      ...initialQuizData, // Retain original ID, teacherId, lessonId
      title: values.title,
      description: values.description,
      assignedClassIds: values.assignedClassIds || [],
      questions: values.questions.map(q => ({
        ...q,
        id: q.id || `new_q_${Date.now()}${Math.random().toString(36).substring(2,7)}`, // Assign new ID if it's a new question
        correctAnswer: q.type === 'true-false' ? (q.correctAnswer === 'true' || q.correctAnswer === true) : q.correctAnswer,
        points: q.points || 1,
        options: q.type === 'multiple-choice' ? q.options : undefined, // Ensure options are undefined if not multiple-choice
      }))
    };
    
    console.log("Data kuis yang akan diperbarui (simulasi):", updatedQuizData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = updateQuiz(updatedQuizData);

    if (success) {
      toast({
        title: "Kuis Diperbarui",
        description: `Kuis "${values.title}" telah berhasil diperbarui.`,
      });
      router.push("/teacher/quizzes");
      router.refresh(); // To ensure the list page re-fetches or re-renders
    } else {
      toast({
        title: "Gagal Memperbarui",
        description: "Terjadi kesalahan saat memperbarui kuis.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  const addQuestion = () => {
    append({ text: "", type: "multiple-choice", options: ["", "", "", ""], correctAnswer: "", points: 1 });
  };
  
  const addOption = (questionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`) || [];
    if (currentOptions.length < 6) {
      // This needs to update the field array correctly.
      const questionField = fields[questionIndex];
      update(questionIndex, { ...questionField, options: [...currentOptions, ""] });
    } else {
      toast({ title: "Batas Opsi", description: "Maksimal 6 opsi per pertanyaan.", variant: "default" });
    }
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const questionField = fields[questionIndex];
    const currentOptions = form.getValues(`questions.${questionIndex}.options`);
    if (currentOptions && currentOptions.length > 2) {
      const newOptions = currentOptions.filter((_, idx) => idx !== optionIndex);
      update(questionIndex, { ...questionField, options: newOptions });
    } else {
      toast({ title: "Minimal Opsi", description: "Minimal harus ada 2 opsi.", variant: "default" });
    }
  };
  
  if (!initialQuizData && !form.formState.isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center">
        <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Memuat data kuis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FilePenLine className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Edit Kuis: {initialQuizData?.title}</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/teacher/quizzes">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Kuis Saya
          </Link>
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Informasi Umum Kuis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Kuis</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Kuis Aljabar Dasar Bab 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi Kuis (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Deskripsi singkat mengenai kuis ini..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="assignedClassIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tugaskan ke Kelas (Opsional)</FormLabel>
                    <FormDescription>Pilih satu atau lebih kelas yang akan mengerjakan kuis ini.</FormDescription>
                    <div className="grid grid-cols-1 gap-2 pt-2 md:grid-cols-2 lg:grid-cols-3">
                      {availableClasses.map((cls) => (
                        <FormItem 
                          key={cls.ID_Kelas}
                          className="flex flex-row items-start p-3 border rounded-md shadow-sm space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(cls.ID_Kelas)}
                              onCheckedChange={(checked) => {
                                const currentValues = field.value || [];
                                const newValues = checked
                                  ? [...currentValues, cls.ID_Kelas]
                                  : currentValues.filter((id) => id !== cls.ID_Kelas);
                                field.onChange(newValues);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {cls.Nama_Kelas} - {cls.jurusan}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Daftar Pertanyaan</CardTitle>
              <CardDescription>Tambahkan dan kelola pertanyaan untuk kuis ini. Setiap pertanyaan wajib memiliki poin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((fieldItem, index) => (
                <Card key={fieldItem.id} className="p-4 border-2 border-dashed">
                  <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
                    <CardTitle className="text-lg">Pertanyaan {index + 1}</CardTitle>
                    <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} disabled={fields.length <= 1}>
                      <Trash2 className="w-4 h-4 text-destructive" /> Hapus Pertanyaan
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0 space-y-4">
                    <FormField
                      control={form.control}
                      name={`questions.${index}.text`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teks Pertanyaan</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Masukkan teks pertanyaan..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name={`questions.${index}.points`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Poin untuk Pertanyaan Ini</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="cth. 10" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`questions.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipe Pertanyaan</FormLabel>
                          <Select onValueChange={(value) => {
                              field.onChange(value);
                              const currentQuestion = form.getValues(`questions.${index}`);
                              const newOptions = value === 'multiple-choice' ? (currentQuestion.options && currentQuestion.options.length >=2 ? currentQuestion.options : ["", "", "", ""]) : undefined;
                              const newCorrectAnswer = value === 'true-false' ? 'true' : (value === 'multiple-choice' ? '' : undefined);
                              
                              // Use update from useFieldArray to ensure re-render with new structure
                              update(index, {
                                ...currentQuestion,
                                type: value as Question['type'],
                                options: newOptions,
                                correctAnswer: newCorrectAnswer
                              });

                          }} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih tipe pertanyaan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="multiple-choice">Pilihan Ganda</SelectItem>
                              <SelectItem value="true-false">Benar/Salah</SelectItem>
                              <SelectItem value="essay">Esai</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {form.watch(`questions.${index}.type`) === 'multiple-choice' && (
                        <div className="space-y-3">
                            <FormLabel>Opsi Jawaban</FormLabel>
                            {form.watch(`questions.${index}.options`)?.map((_, optionIndex) => (
                                <FormField
                                    key={`${fieldItem.id}-option-${optionIndex}`}
                                    control={form.control}
                                    name={`questions.${index}.options.${optionIndex}`}
                                    render={({ field: optionField }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormControl>
                                            <Input placeholder={`Opsi ${optionIndex + 1}`} {...optionField} />
                                        </FormControl>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index, optionIndex)} disabled={(form.getValues(`questions.${index}.options`)?.length ?? 0) <= 2}>
                                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                        </Button>
                                    </FormItem>
                                    )}
                                />
                            ))}
                             <Button type="button" variant="outline" size="sm" onClick={() => addOption(index)} disabled={(form.getValues(`questions.${index}.options`)?.length ?? 0) >= 6}>
                                <PlusCircle className="w-4 h-4 mr-2" /> Tambah Opsi
                            </Button>
                            <FormField
                                control={form.control}
                                name={`questions.${index}.correctAnswer`}
                                render={({ field: correctAnswerField }) => (
                                <FormItem>
                                    <FormLabel>Kunci Jawaban Pilihan Ganda</FormLabel>
                                    <Select onValueChange={correctAnswerField.onChange} value={correctAnswerField.value as string | undefined} defaultValue={correctAnswerField.value as string | undefined}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jawaban benar" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {form.watch(`questions.${index}.options`)?.map((opt, optIdx) => (
                                            opt.trim() && <SelectItem key={`correct-${optIdx}-${opt}`} value={opt}>{opt}</SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                    )}

                    {form.watch(`questions.${index}.type`) === 'true-false' && (
                      <FormField
                        control={form.control}
                        name={`questions.${index}.correctAnswer`}
                        render={({ field: correctAnswerField }) => (
                          <FormItem>
                            <FormLabel>Kunci Jawaban Benar/Salah</FormLabel>
                            <Select onValueChange={correctAnswerField.onChange} value={String(correctAnswerField.value) === 'true' ? 'true' : 'false'} defaultValue={String(correctAnswerField.value) === 'true' ? 'true' : 'false'}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih jawaban benar" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="true">Benar</SelectItem>
                                <SelectItem value="false">Salah</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                     {form.watch(`questions.${index}.type`) === 'essay' && (
                        <FormField
                            control={form.control}
                            name={`questions.${index}.correctAnswer`} 
                            render={({ field: essayField }) => (
                            <FormItem>
                                <FormLabel>Model Jawaban/Rubrik Penilaian (Opsional untuk Esai)</FormLabel>
                                <FormControl>
                                <Textarea placeholder="Masukkan model jawaban atau kriteria penilaian untuk esai..." {...essayField} value={essayField.value as string | undefined} />
                                </FormControl>
                                <FormDescription>Untuk esai, ini bisa berupa poin-poin kunci jawaban atau rubrik penilaian.</FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    )}
                  </CardContent>
                </Card>
              ))}
              <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
                <PlusCircle className="w-4 h-4 mr-2" /> Tambah Pertanyaan Baru
              </Button>
            </CardContent>
             <CardFooter className="flex justify-end p-6">
                <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                Simpan Perubahan Kuis
                </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
