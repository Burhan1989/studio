
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
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, Loader2, ArrowLeft, Network } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import type { MajorData } from "@/lib/types";
import { getMajorById, updateMajor } from "@/lib/mockData";

const editMajorSchema = z.object({
  Nama_Jurusan: z.string().min(3, "Nama jurusan minimal 3 karakter."),
  Deskripsi_Jurusan: z.string().optional(),
});

type EditMajorFormData = z.infer<typeof editMajorSchema>;

export default function AdminEditMajorPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const majorId = params.majorId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<MajorData | null>(null);

  const form = useForm<EditMajorFormData>({
    resolver: zodResolver(editMajorSchema),
    defaultValues: {
      Nama_Jurusan: "",
      Deskripsi_Jurusan: "",
    },
  });

  useEffect(() => {
    if (majorId) {
      const majorData = getMajorById(majorId);
      if (majorData) {
        setInitialData(majorData);
        form.reset({
          Nama_Jurusan: majorData.Nama_Jurusan,
          Deskripsi_Jurusan: majorData.Deskripsi_Jurusan || "",
        });
      } else {
        toast({
          title: "Jurusan Tidak Ditemukan",
          description: `Jurusan dengan ID ${majorId} tidak ditemukan.`,
          variant: "destructive",
        });
        router.push("/admin/majors");
      }
    }
  }, [majorId, form, router, toast]);

  async function onSubmit(values: EditMajorFormData) {
    if (!initialData) return;
    setIsLoading(true);
    
    const updatedMajorData: MajorData = {
      ...initialData,
      Nama_Jurusan: values.Nama_Jurusan,
      Deskripsi_Jurusan: values.Deskripsi_Jurusan,
    };

    console.log("Data jurusan yang akan diperbarui (simulasi):", updatedMajorData);
    
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    const success = updateMajor(updatedMajorData); 

    if (success) {
      toast({
        title: "Data Jurusan Diperbarui",
        description: `Informasi jurusan "${values.Nama_Jurusan}" telah berhasil diperbarui.`,
      });
      router.push("/admin/majors");
      router.refresh(); 
    } else {
       toast({
        title: "Gagal Memperbarui",
        description: "Terjadi kesalahan saat memperbarui data jurusan.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  if (!initialData && !form.formState.isSubmitting) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center">
            <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Memuat data jurusan...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Network className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Edit Jurusan: {initialData?.Nama_Jurusan}</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/majors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Jurusan
          </Link>
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Informasi Data Jurusan</CardTitle>
              <CardDescription>Perbarui detail jurusan di bawah ini.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="Nama_Jurusan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Jurusan</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Ilmu Pengetahuan Alam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Deskripsi_Jurusan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi Jurusan (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Deskripsi singkat mengenai jurusan..." {...field} className="min-h-[100px]" />
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
