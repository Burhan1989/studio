
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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Save, Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addAdminUser, getTeachers } from "@/lib/mockData"; // Import fungsi simulasi dan getTeachers
import type { TeacherData } from "@/lib/types";

const newAdminSchema = z.object({
  Nama_Lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  Username: z.string().min(3, "Username minimal 3 karakter."),
  Email: z.string().email("Format email tidak valid."),
  Password_Hash: z.string().min(6, "Password minimal 6 karakter."),
  Jabatan: z.string().optional(),
  Status_Aktif: z.boolean().default(true),
});

type NewAdminFormData = z.infer<typeof newAdminSchema>;

export default function AdminAddAdminPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<NewAdminFormData>({
    resolver: zodResolver(newAdminSchema),
    defaultValues: {
      Nama_Lengkap: "",
      Username: "",
      Email: "",
      Password_Hash: "",
      Jabatan: "Administrator",
      Status_Aktif: true,
    },
  });

  async function onSubmit(values: NewAdminFormData) {
    setIsLoading(true);
    const currentAdmins = getTeachers().filter(t => t.isAdmin);
    
    const newAdminData: Omit<TeacherData, 'ID_Guru' | 'Tanggal_Pendaftaran' | 'Profil_Foto'> = {
        ...values,
        isAdmin: true,
        Jenis_Kelamin: '', 
        Tanggal_Lahir: new Date().toISOString().split('T')[0], 
        Alamat: '', 
        Nomor_Telepon: '', 
        Mata_Pelajaran: 'Administrasi Sistem', 
        Kelas_Ajar: [], 
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const addedAdmin = addAdminUser(newAdminData); 

    if (addedAdmin) {
        toast({
            title: "Admin Baru Ditambahkan",
            description: `Pengguna admin "${values.Nama_Lengkap}" telah berhasil ditambahkan.`,
        });
        router.push("/admin/admins");
        router.refresh(); 
    } else {
        toast({
            title: "Gagal Menambahkan Admin",
            description: "Email atau Username mungkin sudah digunakan. Silakan periksa konsol untuk detail.",
            variant: "destructive",
        });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserPlus className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Tambah Pengguna Admin Baru</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/admins">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Admin
          </Link>
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Informasi Pengguna Admin</CardTitle>
              <CardDescription>Lengkapi semua field yang diperlukan.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="Nama_Lengkap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Admin Aplikasi" {...field} />
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
                      <Input placeholder="cth. adminapp" {...field} />
                    </FormControl>
                    <FormDescription>Digunakan untuk beberapa sistem internal, bukan untuk login utama.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (untuk Login)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="cth. adminbaru@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Password_Hash" 
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Masukkan password" {...field} />
                    </FormControl>
                    <FormDescription>Minimal 6 karakter.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Jabatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jabatan (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Administrator Konten" {...field} />
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
                        Nonaktifkan jika admin ini belum boleh mengakses sistem.
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
                Simpan Admin Baru
                </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
