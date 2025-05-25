
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
import { FilePlus2, Save, Loader2, ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { addQuiz, mockClasses } from "@/lib/mockData";
import type { Question, Quiz, ClassData } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const questionSchema = z.object({
  id: z.string().optional(), // To handle existing questions during edit, not used yet
  text: z.string().min(5, "Teks pertanyaan minimal 5 karakter."),
  type: z.enum(["multiple-choice", "true-false", "essay"], {
    required_error: "Tipe pertanyaan harus dipilih.",
  }),
  options: z.array(z.string().min(1, "Opsi tidak boleh kosong.")).optional(),
  correctAnswer: z.union([z.string(), z.boolean()]).optional(),
  points: z.coerce.number().int().min(1, "Poin minimal 1 untuk setiap pertanyaan.").default(1),
});

const newQuizSchema = z.object({
  title: z.string().min(3, "Judul kuis minimal 3 karakter."),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, "Kuis harus memiliki setidaknya satu pertanyaan."),
  assignedClassIds: z.array(z.string()).optional(),
});

type NewQuizFormData = z.infer<typeof newQuizSchema>;

export default function TeacherNewQuizPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const availableClasses: ClassData[] = mockClasses; 

  const form = useForm<NewQuizFormData>({
    resolver: zodResolver(newQuizSchema),
    defaultValues: {
      title: "",
      description: "",
      questions: [{ text: "", type: "multiple-choice", options: ["", "", "", ""], correctAnswer: "", points: 1 }],
      assignedClassIds: [], 
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  async function onSubmit(values: NewQuizFormData) {
    if (!user || user.role !== 'teacher') {
        toast({ title: "Akses Ditolak", description: "Anda harus login sebagai guru.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    
    const quizDataForMock: Omit<Quiz, 'id'> & { teacherId: string; assignedClassIds?: string[] } = {
        title: values.title,
        description: values.description,
        teacherId: user.id, 
        assignedClassIds: values.assignedClassIds && values.assignedClassIds.length > 0 ? values.assignedClassIds : undefined,
        questions: values.questions.map(q => ({
            ...q,
            id: `q${Date.now()}${Math.random().toString(36).substring(2,7)}`,
            correctAnswer: q.type === 'true-false' ? (q.correctAnswer === 'true' || q.correctAnswer === true) : q.correctAnswer,
            points: q.points || 1,
        }))
    };

    console.log("Data kuis baru (simulasi):", quizDataForMock);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    addQuiz(quizDataForMock); 

    toast({
      title: "Kuis Baru Ditambahkan (Simulasi)",
      description: `Kuis "${values.title}" telah berhasil ditambahkan.`,
    });
    setIsLoading(false);
    router.push("/teacher/quizzes"); 
  }

  const addQuestion = () => {
    append({ text: "", type: "multiple-choice", options: ["", "", "", ""], correctAnswer: "", points: 1 });
  };
  
  const addOption = (questionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`) || [];
    if (currentOptions.length < 6) { 
        form.setValue(`questions.${questionIndex}.options`, [...currentOptions, ""]);
    } else {
        toast({ title: "Batas Opsi", description: "Maksimal 6 opsi per pertanyaan.", variant: "default" });
    }
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
      const currentOptions = form.getValues(`questions.${questionIndex}.options`);
      if (currentOptions && currentOptions.length > 2) { 
        const newOptions = currentOptions.filter((_, idx) => idx !== optionIndex);
        form.setValue(`questions.${questionIndex}.options`, newOptions);
      } else {
        toast({ title: "Minimal Opsi", description: "Minimal harus ada 2 opsi.", variant: "default" });
      }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FilePlus2 className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Buat Kuis Baru</h1>
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
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm"
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
                              form.setValue(`questions.${index}.options`, value === 'multiple-choice' ? ["", "", "", ""] : undefined);
                              form.setValue(`questions.${index}.correctAnswer`, value === 'true-false' ? 'true' : (value === 'multiple-choice' ? '' : undefined));
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
                                    <Select onValueChange={correctAnswerField.onChange} defaultValue={correctAnswerField.value as string | undefined}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jawaban benar" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {form.watch(`questions.${index}.options`)?.map((opt, optIdx) => (
                                            opt.trim() && <SelectItem key={`correct-${optIdx}`} value={opt}>{opt}</SelectItem>
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
                            <Select onValueChange={correctAnswerField.onChange} defaultValue={String(correctAnswerField.value) === 'true' ? 'true' : 'false'}>
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
                Simpan Kuis
                </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

