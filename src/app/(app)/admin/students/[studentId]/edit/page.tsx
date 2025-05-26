
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
import { Users, Save, Loader2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import type { StudentData } from "@/lib/types";
import { getStudentById, updateStudent } from "@/lib/mockData";
import { Switch } from "@/components/ui/switch";

const editStudentSchema = z.object({
  Nama_Lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  Nama_Panggilan: z.string().optional(),
  Username: z.string().min(3, "Username minimal 3 karakter."),
  Email: z.string().email("Format email tidak valid."),
  NISN: z.string().regex(/^[0-9]{10}$/, "NISN harus 10 digit angka."),
  Nomor_Induk: z.string().min(3, "Nomor induk minimal 3 karakter."),
  Jenis_Kelamin: z.enum(["Laki-laki", "Perempuan", ""], { required_error: "Jenis kelamin harus dipilih." }).refine(val => val !== "", { message: "Jenis kelamin harus dipilih." }),
  Tanggal_Lahir: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Tanggal lahir tidak valid." }),
  Alamat: z.string().min(5, "Alamat minimal 5 karakter.").optional().or(z.literal("")),
  Nomor_Telepon: z.string().regex(/^[0-9\-\+\(\)\s]+$/, "Format nomor telepon tidak valid.").optional().or(z.literal("")),
  Program_Studi: z.string().min(1, "Jurusan harus diisi."),
  Kelas: z.string().min(1, "Kelas harus diisi."),
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

type EditStudentFormData = z.infer<typeof editStudentSchema>;

export default function AdminEditStudentPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<StudentData | null>(null);

  const form = useForm<EditStudentFormData>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      Nama_Lengkap: "",
      Nama_Panggilan: "",
      Username: "",
      Email: "",
      NISN: "",
      Nomor_Induk: "",
      Jenis_Kelamin: "",
      Tanggal_Lahir: "",
      Alamat: "",
      Nomor_Telepon: "",
      Program_Studi: "",
      Kelas: "",
      Status_Aktif: true,
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (studentId) {
      const studentData = getStudentById(studentId);
      if (studentData) {
        setInitialData(studentData);
        form.reset({
          Nama_Lengkap: studentData.Nama_Lengkap,
          Nama_Panggilan: studentData.Nama_Panggilan || "",
          Username: studentData.Username,
          Email: studentData.Email,
          NISN: studentData.NISN,
          Nomor_Induk: studentData.Nomor_Induk,
          Jenis_Kelamin: studentData.Jenis_Kelamin,
          Tanggal_Lahir: studentData.Tanggal_Lahir,
          Alamat: studentData.Alamat || "",
          Nomor_Telepon: studentData.Nomor_Telepon || "",
          Program_Studi: studentData.Program_Studi,
          Kelas: studentData.Kelas,
          Status_Aktif: studentData.Status_Aktif,
          newPassword: "", 
          confirmNewPassword: "", 
        });
      } else {
        toast({
          title: "Siswa Tidak Ditemukan",
          description: `Siswa dengan ID ${studentId} tidak ditemukan.`,
          variant: "destructive",
        });
        router.push("/admin/students");
      }
    }
  }, [studentId, form, router, toast]);

  async function onSubmit(values: EditStudentFormData) {
    if (!initialData) return;
    setIsLoading(true);
    
    const updatedStudentData: StudentData = {
      ...initialData, 
      Nama_Lengkap: values.Nama_Lengkap,
      Nama_Panggilan: values.Nama_Panggilan,
      Username: values.Username, // Username can be updated by admin
      Email: values.Email, // Email can be updated by admin
      NISN: values.NISN, // NISN can be updated by admin
      Nomor_Induk: values.Nomor_Induk, // Nomor Induk can be updated by admin
      Jenis_Kelamin: values.Jenis_Kelamin,
      Tanggal_Lahir: values.Tanggal_Lahir,
      Alamat: values.Alamat,
      Nomor_Telepon: values.Nomor_Telepon,
      Program_Studi: values.Program_Studi,
      Kelas: values.Kelas,
      Status_Aktif: values.Status_Aktif,
      Password_Hash: values.newPassword ? values.newPassword : initialData.Password_Hash, 
    };

    console.log("Data siswa yang akan diperbarui (simulasi):", updatedStudentData);
    
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    const success = updateStudent(updatedStudentData); 

    if (success) {
      toast({
        title: "Data Siswa Diperbarui",
        description: `Informasi siswa "${values.Nama_Lengkap}" telah berhasil diperbarui.`,
      });
      router.push("/admin/students");
      router.refresh(); 
    } else {
       toast({
        title: "Gagal Memperbarui",
        description: "Terjadi kesalahan saat memperbarui data siswa.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  if (!initialData && !form.formState.isSubmitting) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center">
            <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Memuat data siswa...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Edit Siswa: {initialData?.Nama_Lengkap}</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/students">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Siswa
          </Link>
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Informasi Data Siswa</CardTitle>
              <CardDescription>Perbarui detail siswa di bawah ini.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="Nama_Lengkap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Budi Sanjaya" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Nama_Panggilan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Panggilan (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Budi" {...field} />
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
                      <Input placeholder="cth. budisanjaya" {...field} />
                    </FormControl>
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
                      <Input type="email" placeholder="cth. budi.s@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="NISN"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NISN</FormLabel>
                    <FormControl>
                      <Input placeholder="Nomor Induk Siswa Nasional (10 digit)" {...field} />
                    </FormControl>
                     <FormDescription>NISN harus terdiri dari 10 digit angka.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="Nomor_Induk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Induk Siswa</FormLabel>
                    <FormControl>
                      <Input placeholder="Nomor Induk Siswa di Sekolah" {...field} />
                    </FormControl>
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
                name="Kelas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kelas</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Kelas 10A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="Program_Studi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jurusan</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. IPA" {...field} />
                    </FormControl>
                    <FormDescription>Masukkan jurusan siswa.</FormDescription>
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
                      <Textarea placeholder="Masukkan alamat lengkap siswa" {...field} className="min-h-[80px]" />
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
                name="Status_Aktif"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm md:col-span-2">
                    <div className="space-y-0.5">
                      <FormLabel>Status Aktif</FormLabel>
                      <FormDescription>
                        Nonaktifkan jika siswa sudah tidak aktif.
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

    