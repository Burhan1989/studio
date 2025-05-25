
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
import { UserPlus, Save, Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const newTeacherSchema = z.object({
  Nama_Lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  Username: z.string().min(3, "Username minimal 3 karakter."),
  Email: z.string().email("Format email tidak valid."),
  Password_Hash: z.string().min(6, "Password minimal 6 karakter."),
  Jenis_Kelamin: z.enum(["Laki-laki", "Perempuan", ""], { required_error: "Jenis kelamin harus dipilih." }).refine(val => val !== "", { message: "Jenis kelamin harus dipilih." }),
  Tanggal_Lahir: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Tanggal lahir tidak valid." }),
  Alamat: z.string().min(5, "Alamat minimal 5 karakter.").optional().or(z.literal("")),
  Nomor_Telepon: z.string().regex(/^[0-9\-\+\(\)\s]+$/, "Format nomor telepon tidak valid.").optional().or(z.literal("")),
  Mata_Pelajaran: z.string().min(3, "Mata pelajaran minimal 3 karakter."),
  Kelas_Ajar: z.string().min(1, "Kelas ajar harus diisi. Pisahkan dengan koma jika lebih dari satu.").transform(val => val.split(',').map(s => s.trim())),
  Jabatan: z.string().optional().or(z.literal("")),
  Status_Aktif: z.boolean().default(true),
});

type NewTeacherFormData = z.infer<typeof newTeacherSchema>;

export default function AdminAddTeacherPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<NewTeacherFormData>({
    resolver: zodResolver(newTeacherSchema),
    defaultValues: {
      Nama_Lengkap: "",
      Username: "",
      Email: "",
      Password_Hash: "",
      Jenis_Kelamin: "",
      Tanggal_Lahir: "",
      Alamat: "",
      Nomor_Telepon: "",
      Mata_Pelajaran: "",
      Kelas_Ajar: [] as any, // Initial value for string input, will be transformed
      Jabatan: "",
      Status_Aktif: true,
    },
  });

  async function onSubmit(values: NewTeacherFormData) {
    setIsLoading(true);
    console.log("Data guru baru yang akan disimpan (simulasi):", values);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would add the new teacher to your data source (e.g., mockTeachers array or database)
    // For now, we just show a toast and redirect.
    // Example of adding to mock data (requires mockTeachers to be adaptable, e.g., a state or global store):
    // mockTeachers.push({ ID_Guru: `guru${mockTeachers.length + 1}`, ...values, Profil_Foto: "https://placehold.co/100x100.png", Tanggal_Pendaftaran: new Date().toISOString().split('T')[0] });

    toast({
      title: "Guru Baru Ditambahkan (Simulasi)",
      description: `Guru "${values.Nama_Lengkap}" telah berhasil ditambahkan (simulasi).`,
    });
    setIsLoading(false);
    router.push("/admin/teachers"); // Redirect to the list of teachers
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserPlus className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Tambah Guru Baru</h1>
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
              <CardDescription>Lengkapi semua field yang diperlukan.</CardDescription>
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
                      <Input placeholder="cth. budi.darmawan" {...field} />
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
                      <Input type="email" placeholder="cth. budi.d@example.com" {...field} />
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
                    <FormLabel>Jabatan (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Guru Senior Matematika" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="Nomor_Telepon"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
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
                      <Textarea placeholder="Masukkan alamat lengkap guru" {...field} />
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
            </CardContent>
             <CardFooter className="flex justify-end p-6">
                <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                Simpan Data Guru
                </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

    