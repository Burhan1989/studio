
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, Loader2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import type { ClassData } from "@/lib/types";
import { getClassById, updateClass } from "@/lib/mockData"; // Import helper functions

const editClassSchema = z.object({
  Nama_Kelas: z.string().min(3, "Nama kelas minimal 3 karakter."),
  ID_Guru: z.string().min(1, "ID Wali Kelas harus diisi."), 
  jurusan: z.string().optional(),
  jumlahSiswa: z.coerce.number().int().min(0, "Jumlah siswa tidak boleh negatif.").optional(),
});

type EditClassFormData = z.infer<typeof editClassSchema>;

export default function AdminEditClassPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<ClassData | null>(null);

  const form = useForm<EditClassFormData>({
    resolver: zodResolver(editClassSchema),
    defaultValues: {
      Nama_Kelas: "",
      ID_Guru: "",
      jurusan: "",
      jumlahSiswa: 0,
    },
  });

  useEffect(() => {
    if (classId) {
      const classData = getClassById(classId);
      if (classData) {
        setInitialData(classData);
        form.reset({
          Nama_Kelas: classData.Nama_Kelas,
          ID_Guru: classData.ID_Guru,
          jurusan: classData.jurusan || "",
          // Ensure jumlahSiswa is a number for the form, defaulting to 0 if undefined
          jumlahSiswa: typeof classData.jumlahSiswa === 'number' ? classData.jumlahSiswa : 0,
        });
      } else {
        toast({
          title: "Kelas Tidak Ditemukan",
          description: `Kelas dengan ID ${classId} tidak ditemukan.`,
          variant: "destructive",
        });
        router.push("/admin/classes");
      }
    }
  }, [classId, form, router, toast]);

  async function onSubmit(values: EditClassFormData) {
    if (!initialData) return;
    setIsLoading(true);
    
    const updatedClassData: ClassData = {
      ...initialData, // Retain other fields like ID_Kelas, Deskripsi_Kelas, Waktu_Kelas
      Nama_Kelas: values.Nama_Kelas,
      ID_Guru: values.ID_Guru,
      jurusan: values.jurusan,
      jumlahSiswa: values.jumlahSiswa,
    };

    console.log("Data kelas yang akan diperbarui (simulasi):", updatedClassData);
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const success = updateClass(updatedClassData); 

    if (success) {
      toast({
        title: "Data Kelas Diperbarui",
        description: `Informasi kelas "${values.Nama_Kelas}" telah berhasil diperbarui.`,
      });
      router.push("/admin/classes");
      router.refresh(); // Refresh the previous page to show updated data
    } else {
       toast({
        title: "Gagal Memperbarui",
        description: "Terjadi kesalahan saat memperbarui data kelas.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  if (!initialData && !form.formState.isSubmitting) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center">
            <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Memuat data kelas...</p>
        </div>
    );
  }


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Edit className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Edit Kelas: {initialData?.Nama_Kelas}</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/classes">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Kelas
          </Link>
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Informasi Data Kelas</CardTitle>
              <CardDescription>Perbarui detail kelas di bawah ini.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="Nama_Kelas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kelas</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Kelas 10A IPA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ID_Guru"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Wali Kelas</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. guru001" {...field} />
                    </FormControl>
                     <FormDescription>Masukkan ID unik guru wali kelas. Daftar guru bisa dilihat di menu Kelola Guru.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jurusan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jurusan (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. IPA, IPS, Bahasa" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jumlahSiswa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Siswa (Opsional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="cth. 30" {...field} />
                    </FormControl>
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
