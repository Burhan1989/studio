
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, Save, Loader2, ArrowLeft } from "lucide-react"; // Menggunakan ikon Users
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import type { ParentData, StudentData } from "@/lib/types"; // StudentData untuk anak terkait
import { getParentById, updateParent, getStudents } from "@/lib/mockData";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";


const editParentSchema = z.object({
  Nama_Lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  Username: z.string().min(3, "Username minimal 3 karakter."),
  Email: z.string().email("Format email tidak valid."),
  Nomor_Telepon: z.string().regex(/^[0-9\\-\\+\\(\\)\\s]*$/, "Format nomor telepon tidak valid.").optional().or(z.literal("")),
  Status_Aktif: z.boolean().default(true),
  Anak_Terkait_IDs: z.array(z.string()).optional(), // Untuk menyimpan ID siswa yang dipilih
  newPassword: z.string().min(6, "Password baru minimal 6 karakter.").optional().or(z.literal("")),
  confirmNewPassword: z.string().optional().or(z.literal("")),
}).refine(data => {
  if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
    return false;
  }
  return true;
}, {
  message: "Konfirmasi password tidak cocok dengan password baru.",
  path: ["confirmNewPassword"],
});

type EditParentFormData = z.infer<typeof editParentSchema>;

export default function AdminEditParentPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const parentId = params.parentId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<ParentData | null>(null);
  const [allStudents, setAllStudents] = useState<StudentData[]>([]);

  const form = useForm<EditParentFormData>({
    resolver: zodResolver(editParentSchema),
    defaultValues: {
      Nama_Lengkap: "",
      Username: "",
      Email: "",
      Nomor_Telepon: "",
      Status_Aktif: true,
      Anak_Terkait_IDs: [],
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    setAllStudents(getStudents());
    if (parentId) {
      const parentData = getParentById(parentId);
      if (parentData) {
        setInitialData(parentData);
        form.reset({
          Nama_Lengkap: parentData.Nama_Lengkap,
          Username: parentData.Username,
          Email: parentData.Email,
          Nomor_Telepon: parentData.Nomor_Telepon || "",
          Status_Aktif: parentData.Status_Aktif,
          Anak_Terkait_IDs: parentData.Anak_Terkait?.map(anak => anak.ID_Siswa) || [],
          newPassword: "", 
          confirmNewPassword: "", 
        });
      } else {
        toast({
          title: "Data Orang Tua Tidak Ditemukan",
          description: `Data orang tua dengan ID ${parentId} tidak ditemukan.`,
          variant: "destructive",
        });
        router.push("/admin/parents");
      }
    }
  }, [parentId, form, router, toast]);

  async function onSubmit(values: EditParentFormData) {
    if (!initialData) return;
    setIsLoading(true);
    
    const anakTerkaitData = values.Anak_Terkait_IDs
      ? values.Anak_Terkait_IDs.map(studentId => {
          const student = allStudents.find(s => s.ID_Siswa === studentId);
          return student ? { ID_Siswa: student.ID_Siswa, Nama_Siswa: student.Nama_Lengkap } : null;
        }).filter(Boolean) as { ID_Siswa: string; Nama_Siswa: string }[]
      : [];

    const updatedParentData: ParentData = {
      ...initialData, 
      Nama_Lengkap: values.Nama_Lengkap,
      // Username & Email tidak diubah setelah dibuat (umumnya)
      Nomor_Telepon: values.Nomor_Telepon,
      Status_Aktif: values.Status_Aktif,
      Anak_Terkait: anakTerkaitData,
      Password_Hash: values.newPassword ? values.newPassword : initialData.Password_Hash, 
    };

    console.log("Data orang tua yang akan diperbarui (simulasi):", updatedParentData);
    
    // Simulate API call for localStorage interaction
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    const success = updateParent(updatedParentData); 

    if (success) {
      toast({
        title: "Data Orang Tua Diperbarui",
        description: `Informasi orang tua "${values.Nama_Lengkap}" telah berhasil diperbarui.`,
      });
      router.push("/admin/parents");
      router.refresh(); 
    } else {
       toast({
        title: "Gagal Memperbarui",
        description: "Terjadi kesalahan saat memperbarui data orang tua.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  if (!initialData && !form.formState.isSubmitting) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center">
            <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Memuat data orang tua...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Edit Data Orang Tua: {initialData?.Nama_Lengkap}</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/parents">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Orang Tua
          </Link>
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Informasi Data Orang Tua</CardTitle>
              <CardDescription>Perbarui detail orang tua di bawah ini. Username dan Email tidak dapat diubah.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="Nama_Lengkap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Bapak Budi Sanjaya" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. bapak.budi" {...field} readOnly className="bg-muted/50 cursor-not-allowed" />
                    </FormControl>
                     <FormDescription>Username tidak dapat diubah.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="cth. bapak.budi@example.com" {...field} readOnly className="bg-muted/50 cursor-not-allowed" />
                    </FormControl>
                    <FormDescription>Email tidak dapat diubah.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Nomor_Telepon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon (Opsional)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="cth. 081234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Baru (Opsional)</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Masukkan password baru jika ingin mengubah" {...field} />
                    </FormControl>
                    <FormDescription>Biarkan kosong jika tidak ingin mengubah password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password Baru</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Konfirmasi password baru" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="Anak_Terkait_IDs"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Kaitkan dengan Siswa</FormLabel>
                      <FormDescription>Pilih satu atau lebih siswa yang merupakan anak dari pengguna ini.</FormDescription>
                      <ScrollArea className="h-40 mt-2 border rounded-md">
                        <div className="p-4 space-y-2">
                          {allStudents.map((student) => (
                            <FormItem
                              key={student.ID_Siswa}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(student.ID_Siswa)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    const newValues = checked
                                      ? [...currentValues, student.ID_Siswa]
                                      : currentValues.filter((id) => id !== student.ID_Siswa);
                                    field.onChange(newValues);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {student.Nama_Lengkap} (Kelas: {student.Kelas} - {student.Program_Studi})
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                      </ScrollArea>
                       <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="Status_Aktif"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm md:col-span-2">
                    <div className="space-y-0.5">
                      <FormLabel>Status Aktif</FormLabel>
                      <FormDescription>
                        Nonaktifkan jika akun orang tua ini sudah tidak digunakan.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
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

    

    