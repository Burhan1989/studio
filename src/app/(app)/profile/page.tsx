
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { mockStudents, mockTeachers } from '@/lib/mockData';
import type { StudentData, TeacherData, User } from '@/lib/types';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Save, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// Combined schema for validation, fields will be shown conditionally
const profileFormSchema = z.object({
  Nama_Lengkap: z.string().min(2, "Nama lengkap minimal 2 karakter."),
  Email: z.string().email("Email tidak valid.").readonly(), // Email is read-only
  Nomor_Telepon: z.string().optional(),
  Alamat: z.string().optional(),
  // Student specific
  Nama_Panggilan: z.string().optional(),
  Jenis_Kelamin: z.enum(["Laki-laki", "Perempuan", ""]).optional(),
  Tanggal_Lahir: z.string().optional(), // Consider date picker for better UX
  NISN: z.string().optional(),
  Nomor_Induk: z.string().optional(),
  Kelas: z.string().optional(),
  Program_Studi: z.string().optional(), // Jurusan
  // Teacher specific
  Mata_Pelajaran: z.string().optional(),
  Kelas_Ajar: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()) : []), // Stored as array, edited as comma-separated string
  Jabatan: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, login } = useAuth(); // Get login to update AuthContext if name changes
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [initialData, setInitialData] = useState<Partial<ProfileFormData>>({});


  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData,
  });

 useEffect(() => {
    if (user) {
      let baseProfileData: Partial<ProfileFormData> = {
        Nama_Lengkap: user.name || "",
        Email: user.email,
      };

      const studentMatch = mockStudents.find(s => s.Email === user.email);
      if (studentMatch) {
        setIsStudent(true);
        baseProfileData = {
          ...baseProfileData,
          Nama_Lengkap: studentMatch.Nama_Lengkap,
          Nama_Panggilan: studentMatch.Nama_Panggilan,
          Jenis_Kelamin: studentMatch.Jenis_Kelamin,
          Tanggal_Lahir: studentMatch.Tanggal_Lahir,
          Alamat: studentMatch.Alamat,
          Nomor_Telepon: studentMatch.Nomor_Telepon,
          NISN: studentMatch.NISN,
          Nomor_Induk: studentMatch.Nomor_Induk,
          Kelas: studentMatch.Kelas,
          Program_Studi: studentMatch.Program_Studi,
        };
      } else {
        const teacherMatch = mockTeachers.find(t => t.Email === user.email);
        if (teacherMatch) {
          setIsTeacher(true);
          baseProfileData = {
            ...baseProfileData,
            Nama_Lengkap: teacherMatch.Nama_Lengkap,
            Jenis_Kelamin: teacherMatch.Jenis_Kelamin,
            Tanggal_Lahir: teacherMatch.Tanggal_Lahir,
            Alamat: teacherMatch.Alamat,
            Nomor_Telepon: teacherMatch.Nomor_Telepon,
            Mata_Pelajaran: teacherMatch.Mata_Pelajaran,
            Kelas_Ajar: teacherMatch.Kelas_Ajar as any, // Will be transformed to string for form
            Jabatan: teacherMatch.Jabatan,
          };
        }
      }
      setInitialData(baseProfileData);
      // Reset form with new defaultValues from fetched/matched data
      // Transform Kelas_Ajar to string for the form field
      const formDataForReset = {
        ...baseProfileData,
        Kelas_Ajar: Array.isArray(baseProfileData.Kelas_Ajar) ? (baseProfileData.Kelas_Ajar as string[]).join(', ') : undefined,
      };
      form.reset(formDataForReset as ProfileFormData);
    }
  }, [user, form]);


  async function onSubmit(data: ProfileFormData) {
    setIsLoading(true);
    console.log("Data profil yang akan disimpan (simulasi):", data);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update AuthContext if name changed (simple update for demo)
    if (user && data.Nama_Lengkap !== user.name) {
      const updatedUser: User = { ...user, name: data.Nama_Lengkap };
      // In a real app, you'd get the full updated user object from the backend
      login(updatedUser); // This will also update localStorage
    }
    
    // In a real app, here you would send the data to your backend to persist.
    // You might also want to update the local mockData arrays if you want changes to reflect
    // across the app during the session (this is more complex for a mock setup).

    toast({
      title: "Profil Disimpan (Simulasi)",
      description: "Informasi profil Anda telah berhasil diperbarui (simulasi).",
    });
    setIsLoading(false);
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-2">Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <UserCircle className="w-12 h-12 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Profil Pengguna</h1>
          <p className="text-muted-foreground">
            Kelola informasi pribadi Anda. Email tidak dapat diubah.
          </p>
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Informasi Akun</CardTitle>
          <CardDescription>Perbarui detail pribadi Anda di bawah ini.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="Nama_Lengkap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama lengkap Anda" {...field} />
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
                    <FormLabel>Email (Username)</FormLabel>
                    <FormControl>
                      <Input placeholder="Email Anda" {...field} readOnly className="bg-muted/50 cursor-not-allowed" />
                    </FormControl>
                    <FormMessage />
                     <p className="text-xs text-muted-foreground">Email tidak dapat diubah.</p>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Nomor_Telepon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Nomor telepon Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input placeholder="Alamat Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(isStudent || isTeacher) && (
                <>
                 <FormField
                    control={form.control}
                    name="Jenis_Kelamin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Kelamin</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Jenis Kelamin" />
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
                </>
              )}
              

              {isStudent && (
                <>
                  <Separator />
                  <h3 className="text-lg font-medium text-muted-foreground">Informasi Siswa</h3>
                  <FormField
                    control={form.control}
                    name="Nama_Panggilan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Panggilan</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama panggilan" {...field} />
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
                          <Input placeholder="NISN Anda" {...field} readOnly={isStudent} className={isStudent ? "bg-muted/50 cursor-not-allowed" : ""} />
                        </FormControl>
                        {isStudent && <FormDescription>NISN diatur oleh admin.</FormDescription>}
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
                          <Input placeholder="Nomor induk Anda" {...field} readOnly={isStudent} className={isStudent ? "bg-muted/50 cursor-not-allowed" : ""} />
                        </FormControl>
                        {isStudent && <FormDescription>Nomor Induk diatur oleh admin.</FormDescription>}
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
                          <Input placeholder="Kelas Anda" {...field} readOnly={isStudent} className={isStudent ? "bg-muted/50 cursor-not-allowed" : ""} />
                        </FormControl>
                        {isStudent && <FormDescription>Kelas diatur oleh admin.</FormDescription>}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="Program_Studi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jurusan (Program Studi)</FormLabel>
                        <FormControl>
                          <Input placeholder="Jurusan Anda" {...field} readOnly={isStudent} className={isStudent ? "bg-muted/50 cursor-not-allowed" : ""} />
                        </FormControl>
                        {isStudent && <FormDescription>Jurusan diatur oleh admin.</FormDescription>}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {isTeacher && (
                <>
                  <Separator />
                  <h3 className="text-lg font-medium text-muted-foreground">Informasi Guru</h3>
                  <FormField
                    control={form.control}
                    name="Mata_Pelajaran"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mata Pelajaran</FormLabel>
                        <FormControl>
                          <Input placeholder="Mata pelajaran yang diajar" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="Kelas_Ajar"
                    render={({ field }) => ( // field.value here would be the string from form.reset
                      <FormItem>
                        <FormLabel>Kelas yang Diajar</FormLabel>
                        <FormControl>
                          <Input placeholder="Pisahkan dengan koma, cth: Kelas 10A, Kelas 11B" {...field} />
                        </FormControl>
                         <p className="text-xs text-muted-foreground">Pisahkan beberapa kelas dengan koma.</p>
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
                            placeholder="Jabatan Anda" 
                            {...field} 
                            readOnly={isTeacher} 
                            className={isTeacher ? "bg-muted/50 cursor-not-allowed" : ""} 
                          />
                        </FormControl>
                        {isTeacher && <FormDescription>Jabatan diatur oleh admin.</FormDescription>}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Simpan Perubahan
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

