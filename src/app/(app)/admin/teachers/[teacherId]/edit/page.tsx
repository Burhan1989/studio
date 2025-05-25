
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
import { Edit, Save, Loader2, ArrowLeft, UserCog } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import type { TeacherData } from "@/lib/types";
import { getTeacherById, updateTeacher } from "@/lib/mockData";
import { Switch } from "@/components/ui/switch";

const editTeacherSchema = z.object({
  Nama_Lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  Username: z.string().min(3, "Username minimal 3 karakter."),
  Email: z.string().email("Format email tidak valid."),
  Jenis_Kelamin: z.enum(["Laki-laki", "Perempuan", ""], { required_error: "Jenis kelamin harus dipilih." }).refine(val => val !== "", { message: "Jenis kelamin harus dipilih." }),
  Tanggal_Lahir: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Tanggal lahir tidak valid." }),
  Alamat: z.string().min(5, "Alamat minimal 5 karakter.").optional().or(z.literal("")),
  Nomor_Telepon: z.string().regex(/^[0-9\\-\\+\\(\\)\\s]+$/, "Format nomor telepon tidak valid.").optional().or(z.literal("")),
  Mata_Pelajaran: z.string().min(3, "Mata pelajaran minimal 3 karakter."),
  Kelas_Ajar: z.string().min(1, "Kelas ajar harus diisi.").transform(val => val.split(',').map(s => s.trim())),
  Jabatan: z.string().optional().or(z.literal("")), // Admin can edit this
  Status_Aktif: z.boolean().default(true),
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

type EditTeacherFormData = z.infer<typeof editTeacherSchema>;

export default function AdminEditTeacherPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const teacherId = params.teacherId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<TeacherData | null>(null);

  const form = useForm<EditTeacherFormData>({
    resolver: zodResolver(editTeacherSchema),
    defaultValues: {
      Nama_Lengkap: "",
      Username: "",
      Email: "",
      Jenis_Kelamin: "",
      Tanggal_Lahir: "",
      Alamat: "",
      Nomor_Telepon: "",
      Mata_Pelajaran: "",
      Kelas_Ajar: [] as any, 
      Jabatan: "",
      Status_Aktif: true,
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (teacherId) {
      const teacherData = getTeacherById(teacherId);
      if (teacherData) {
        setInitialData(teacherData);
        form.reset({
          Nama_Lengkap: teacherData.Nama_Lengkap,
          Username: teacherData.Username,
          Email: teacherData.Email,
          Jenis_Kelamin: teacherData.Jenis_Kelamin,
          Tanggal_Lahir: teacherData.Tanggal_Lahir,
          Alamat: teacherData.Alamat || "",
          Nomor_Telepon: teacherData.Nomor_Telepon || "",
          Mata_Pelajaran: teacherData.Mata_Pelajaran,
          Kelas_Ajar: teacherData.Kelas_Ajar.join(", ") as any,
          Jabatan: teacherData.Jabatan || "",
          Status_Aktif: teacherData.Status_Aktif,
          newPassword: "", 
          confirmNewPassword: "", 
        });
      } else {
        toast({
          title: "Guru Tidak Ditemukan",
          description: \`Guru dengan ID \${teacherId} tidak ditemukan.\`,
          variant: "destructive",
        });
        router.push("/admin/teachers");
      }
    }
  }, [teacherId, form, router, toast]);

  async function onSubmit(values: EditTeacherFormData) {
    if (!initialData) return;
    setIsLoading(true);
    
    const updatedTeacherData: TeacherData = {
      ...initialData, 
      Nama_Lengkap: values.Nama_Lengkap,
      // Username, Email tidak diubah di sini
      Jenis_Kelamin: values.Jenis_Kelamin,
      Tanggal_Lahir: values.Tanggal_Lahir,
      Alamat: values.Alamat,
      Nomor_Telepon: values.Nomor_Telepon,
      Mata_Pelajaran: values.Mata_Pelajaran,
      Kelas_Ajar: values.Kelas_Ajar, 
      Jabatan: values.Jabatan, // Jabatan can be updated by admin from form values
      Status_Aktif: values.Status_Aktif,
      Password_Hash: values.newPassword ? values.newPassword : initialData.Password_Hash, 
    };

    console.log("Data guru yang akan diperbarui (simulasi):", updatedTeacherData);
    
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    const success = updateTeacher(updatedTeacherData); 

    if (success) {
      toast({
        title: "Data Guru Diperbarui",
        description: \`Informasi guru "\${values.Nama_Lengkap}" telah berhasil diperbarui.\`,
      });
      router.push("/admin/teachers");
      router.refresh(); 
    } else {
       toast({
        title: "Gagal Memperbarui",
        description: "Terjadi kesalahan saat memperbarui data guru.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  if (!initialData && !form.formState.isSubmitting) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center">
            <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Memuat data guru...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserCog className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Edit Guru: {initialData?.Nama_Lengkap}</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/teachers">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Guru
          </Link>
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Informasi Data Guru</CardTitle>
              <CardDescription>Perbarui detail guru di bawah ini. Username dan Email tidak dapat diubah di sini.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="Nama_Lengkap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap (dengan gelar)</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Dr. Budi Darmawan, S.Kom., M.Cs." {...field} />
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
                      <Input placeholder="cth. budi.darmawan" {...field} readOnly className="bg-muted/50 cursor-not-allowed" />
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
                      <Input type="email" placeholder="cth. budi.d@example.com" {...field} readOnly className="bg-muted/50 cursor-not-allowed" />
                    </FormControl>
                    <FormDescription>Email tidak dapat diubah.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="Jenis_Kelamin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Tanggal_Lahir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Mata_Pelajaran"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mata Pelajaran Utama</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Matematika Lanjut" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Jabatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jabatan</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="cth. Guru Senior Matematika" 
                        {...field} 
                        // Jabatan can be edited by admin, so no readOnly here
                      />
                    </FormControl>
                    <FormDescription>Admin dapat mengubah jabatan guru.</FormDescription>
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
                name="Alamat"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Alamat Lengkap (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Masukkan alamat lengkap guru" {...field} className="min-h-[80px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="Kelas_Ajar"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Kelas yang Diajar</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Kelas 10A, Kelas 11B IPA" {...field} value={Array.isArray(field.value) ? field.value.join(", ") : field.value} />
                    </FormControl>
                    <FormDescription>Pisahkan dengan koma jika lebih dari satu kelas.</FormDescription>
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
                name="Status_Aktif"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm md:col-span-2">
                    <div className="space-y-0.5">
                      <FormLabel>Status Aktif</FormLabel>
                      <FormDescription>
                        Nonaktifkan jika guru sudah tidak mengajar.
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

    