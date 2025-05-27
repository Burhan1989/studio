
"use client";

import { useState, useEffect, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { getStudents, getTeachers, updateStudent, updateTeacher } from '@/lib/mockData'; 
import type { StudentData, TeacherData, User } from '@/lib/types';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const profileFormSchema = z.object({
  Nama_Lengkap: z.string().min(2, "Nama lengkap minimal 2 karakter."),
  Email: z.string().email("Email tidak valid.").readonly(),
  Nomor_Telepon: z.string().optional(),
  Alamat: z.string().optional(),
  Profil_Foto_File: z.any().optional(), 
  Profil_Foto_Url: z.string().url().optional().or(z.literal("")), 
  Nama_Panggilan: z.string().optional(),
  Jenis_Kelamin: z.enum(["Laki-laki", "Perempuan", ""]).optional(),
  Tanggal_Lahir: z.string().optional(),
  NISN: z.string().optional(),
  Nomor_Induk: z.string().optional(),
  Kelas: z.string().optional(),
  Program_Studi: z.string().optional(),
  Mata_Pelajaran: z.string().optional(),
  Kelas_Ajar: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()) : []),
  Jabatan: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      Nama_Lengkap: "",
      Email: "",
      Profil_Foto_Url: "",
      Nomor_Telepon: "",
      Alamat: "",
      Nama_Panggilan: "",
      Jenis_Kelamin: "",
      Tanggal_Lahir: "",
      NISN: "",
      Nomor_Induk: "",
      Kelas: "",
      Program_Studi: "",
      Mata_Pelajaran: "",
      Kelas_Ajar: [],
      Jabatan: "",
    },
  });

 useEffect(() => {
    if (user) {
      let baseProfileData: Partial<ProfileFormData> = {
        Nama_Lengkap: user.name || "",
        Email: user.email,
        Profil_Foto_Url: user.Profil_Foto || "",
      };
      
      if (user.Profil_Foto) {
        setPhotoPreview(user.Profil_Foto);
      }

      const students = getStudents(); 
      const studentMatch = students.find(s => s.Email === user.email);
      if (studentMatch) {
        setIsStudent(true);
        setIsTeacher(false);
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
          Profil_Foto_Url: studentMatch.Profil_Foto || user.Profil_Foto || "",
        };
        if (studentMatch.Profil_Foto) setPhotoPreview(studentMatch.Profil_Foto);
      } else {
        const teachers = getTeachers(); 
        const teacherMatch = teachers.find(t => t.Email === user.email);
        if (teacherMatch) {
          setIsTeacher(true);
          setIsStudent(false);
          baseProfileData = {
            ...baseProfileData,
            Nama_Lengkap: teacherMatch.Nama_Lengkap,
            Jenis_Kelamin: teacherMatch.Jenis_Kelamin,
            Tanggal_Lahir: teacherMatch.Tanggal_Lahir,
            Alamat: teacherMatch.Alamat,
            Nomor_Telepon: teacherMatch.Nomor_Telepon,
            Mata_Pelajaran: teacherMatch.Mata_Pelajaran,
            Kelas_Ajar: teacherMatch.Kelas_Ajar as any,
            Jabatan: teacherMatch.Jabatan,
            Profil_Foto_Url: teacherMatch.Profil_Foto || user.Profil_Foto || "",
          };
          if (teacherMatch.Profil_Foto) setPhotoPreview(teacherMatch.Profil_Foto);
        } else {
            setIsStudent(false);
            setIsTeacher(false);
        }
      }
      const formDataForReset = {
        ...baseProfileData,
        Kelas_Ajar: Array.isArray(baseProfileData.Kelas_Ajar) ? (baseProfileData.Kelas_Ajar as string[]).join(', ') : baseProfileData.Kelas_Ajar,
      };
      form.reset(formDataForReset as ProfileFormData);
    }
  }, [user, form]);


  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("Profil_Foto_File", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue("Profil_Foto_File", undefined);
      setPhotoPreview(form.getValues("Profil_Foto_Url") || user?.Profil_Foto || null);
    }
  };

  async function onSubmit(data: ProfileFormData) {
    if (!user) return;
    setIsLoading(true);
    
    let newPhotoUrl = data.Profil_Foto_Url;
    if (data.Profil_Foto_File instanceof File) {
      newPhotoUrl = photoPreview || data.Profil_Foto_Url; 
      console.log("Simulasi unggah foto baru:", data.Profil_Foto_File.name);
    }

    let success = false;
    if (isStudent) {
      const studentData = getStudents().find(s => s.Email === user.email);
      if (studentData) {
        const updatedStudentData: StudentData = {
          ...studentData,
          Nama_Lengkap: data.Nama_Lengkap,
          Nama_Panggilan: data.Nama_Panggilan,
          Jenis_Kelamin: data.Jenis_Kelamin || studentData.Jenis_Kelamin,
          Tanggal_Lahir: data.Tanggal_Lahir || studentData.Tanggal_Lahir,
          Alamat: data.Alamat || studentData.Alamat,
          Nomor_Telepon: data.Nomor_Telepon || studentData.Nomor_Telepon,
          Profil_Foto: newPhotoUrl || studentData.Profil_Foto,
          // NISN, Nomor_Induk, Kelas, Program_Studi tidak diubah oleh siswa
        };
        success = updateStudent(updatedStudentData);
      }
    } else if (isTeacher) {
      const teacherData = getTeachers().find(t => t.Email === user.email);
      if (teacherData) {
        const updatedTeacherData: TeacherData = {
          ...teacherData,
          Nama_Lengkap: data.Nama_Lengkap,
          Jenis_Kelamin: data.Jenis_Kelamin || teacherData.Jenis_Kelamin,
          Tanggal_Lahir: data.Tanggal_Lahir || teacherData.Tanggal_Lahir,
          Alamat: data.Alamat || teacherData.Alamat,
          Nomor_Telepon: data.Nomor_Telepon || teacherData.Nomor_Telepon,
          Mata_Pelajaran: data.Mata_Pelajaran || teacherData.Mata_Pelajaran,
          Kelas_Ajar: Array.isArray(data.Kelas_Ajar) && data.Kelas_Ajar.length > 0 && data.Kelas_Ajar[0] !== '' ? data.Kelas_Ajar : teacherData.Kelas_Ajar,
          Profil_Foto: newPhotoUrl || teacherData.Profil_Foto,
          // Jabatan tidak diubah oleh guru
        };
        success = updateTeacher(updatedTeacherData);
      }
    } else { // General user (neither student nor teacher, e.g. parent or new user without detailed profile yet)
        // Only update name and photo in AuthContext for now
        success = true; 
    }

    if (user && (data.Nama_Lengkap !== user.name || newPhotoUrl !== user.Profil_Foto)) {
      const updatedUserAuth: User = { ...user, name: data.Nama_Lengkap, Profil_Foto: newPhotoUrl };
      login(updatedUserAuth); 
    }
    
    if(success){
        toast({
            title: "Profil Disimpan",
            description: "Informasi profil Anda telah berhasil diperbarui.",
        });
    } else {
        toast({
            title: "Gagal Menyimpan",
            description: "Terjadi kesalahan saat menyimpan profil Anda.",
            variant: "destructive"
        });
    }
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
         {photoPreview ? (
          <Avatar className="w-16 h-16 text-primary">
            <AvatarImage src={photoPreview} alt={user.name || "Foto Profil"} />
            <AvatarFallback>{user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : (
          <UserCircle className="w-16 h-16 text-primary" />
        )}
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
                name="Profil_Foto_File"
                render={() => ( 
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" /> Ganti Foto Profil (Opsional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/png, image/jpeg, image/svg+xml"
                        onChange={handlePhotoChange}
                      />
                    </FormControl>
                    <FormDescription>Format yang didukung: PNG, JPG, SVG. Perubahan mungkin memerlukan login ulang untuk terlihat sepenuhnya.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {photoPreview && !form.getValues("Profil_Foto_File") && form.getValues("Profil_Foto_Url") && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Foto saat ini:</p>
                  <Image src={form.getValues("Profil_Foto_Url")!} alt="Pratinjau Foto Profil" width={100} height={100} className="rounded-md border object-cover" data-ai-hint="profile picture" />
                </div>
              )}

              <FormField
                control={form.control}
                name="Nama_Lengkap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama lengkap Anda" {...field} value={field.value || ""} />
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
                      <Input placeholder="Email Anda" {...field} readOnly className="bg-muted/50 cursor-not-allowed" value={field.value || ""} />
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
                      <Input type="tel" placeholder="Nomor telepon Anda" {...field} value={field.value || ""} />
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
                      <Input placeholder="Alamat Anda" {...field} value={field.value || ""} />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value || ""} value={field.value || ""}>
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
                          <Input type="date" {...field} value={field.value || ""} />
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
                          <Input placeholder="Nama panggilan" {...field} value={field.value || ""} />
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
                          <Input placeholder="NISN Anda" {...field} readOnly className="bg-muted/50 cursor-not-allowed" value={field.value || ""}/>
                        </FormControl>
                        <FormDescription>NISN diatur oleh admin.</FormDescription>
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
                          <Input placeholder="Nomor induk Anda" {...field} readOnly className="bg-muted/50 cursor-not-allowed" value={field.value || ""}/>
                        </FormControl>
                        <FormDescription>Nomor Induk diatur oleh admin.</FormDescription>
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
                          <Input placeholder="Kelas Anda" {...field} readOnly className="bg-muted/50 cursor-not-allowed" value={field.value || ""}/>
                        </FormControl>
                        <FormDescription>Kelas diatur oleh admin.</FormDescription>
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
                          <Input placeholder="Jurusan Anda" {...field} readOnly className="bg-muted/50 cursor-not-allowed" value={field.value || ""}/>
                        </FormControl>
                        <FormDescription>Jurusan diatur oleh admin.</FormDescription>
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
                          <Input placeholder="Mata pelajaran yang diajar" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="Kelas_Ajar"
                    render={({ field }) => {
                      const displayValue = Array.isArray(field.value) ? field.value.join(', ') : (field.value || "");
                      return (
                        <FormItem>
                          <FormLabel>Kelas yang Diajar</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Pisahkan dengan koma, cth: Kelas 10A, Kelas 11B"
                              {...field}
                              value={displayValue}
                              onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">Pisahkan beberapa kelas dengan koma.</p>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
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
                            readOnly
                            className="bg-muted/50 cursor-not-allowed"
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>Jabatan diatur oleh admin.</FormDescription>
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

    