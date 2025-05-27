
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Megaphone, Save, Loader2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { addAnnouncement, getClasses } from "@/lib/mockData";
import type { ClassData } from "@/lib/types";

const announcementSchema = z.object({
  title: z.string().min(5, "Judul pengumuman minimal 5 karakter."),
  content: z.string().min(10, "Isi pengumuman minimal 10 karakter."),
  targetAudience: z.enum(['all_teachers', 'all_students', 'specific_class'], {
    required_error: "Anda harus memilih target audiens."
  }),
  targetClassId: z.string().optional(),
}).refine(data => {
  if (data.targetAudience === 'specific_class' && !data.targetClassId) {
    return false;
  }
  return true;
}, {
  message: "Jika target adalah 'Kelas Tertentu', Anda harus memilih kelas.",
  path: ["targetClassId"],
});

type NewAnnouncementFormData = z.infer<typeof announcementSchema>;

export default function AdminNewAnnouncementPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [availableClasses, setAvailableClasses] = useState<ClassData[]>([]);

  useEffect(() => {
    setAvailableClasses(getClasses());
  }, []);

  const form = useForm<NewAnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
      targetAudience: undefined, // Biarkan kosong agar radio group bisa dikontrol
      targetClassId: undefined,
    },
  });

  const watchTargetAudience = form.watch("targetAudience");

  async function onSubmit(values: NewAnnouncementFormData) {
    if (!user || !user.isAdmin) {
        toast({ title: "Akses Ditolak", description: "Hanya admin yang dapat membuat pengumuman.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    
    const selectedClass = values.targetClassId ? availableClasses.find(c => c.ID_Kelas === values.targetClassId) : undefined;

    const announcementDataToAdd = {
        title: values.title,
        content: values.content,
        targetAudience: values.targetAudience,
        targetClassId: values.targetAudience === 'specific_class' ? values.targetClassId : undefined,
        targetClassName: values.targetAudience === 'specific_class' ? (selectedClass ? `${selectedClass.Nama_Kelas} (${selectedClass.jurusan})` : values.targetClassId) : undefined,
        createdBy: user.id, // atau user.name, tergantung kebutuhan
    };
    
    addAnnouncement(announcementDataToAdd);

    toast({
      title: "Pengumuman Dibuat",
      description: `Pengumuman "${values.title}" telah berhasil dibuat.`,
    });
    setIsLoading(false);
    router.push("/admin/announcements");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Megaphone className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Buat Pengumuman Baru</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/announcements">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Pengumuman
          </Link>
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Detail Pengumuman</CardTitle>
              <CardDescription>Isi detail pengumuman dan pilih target audiens.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Pengumuman</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Pemberitahuan Libur Sekolah" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Isi Pengumuman</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tulis isi lengkap pengumuman di sini..." className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Target Audiens</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="all_teachers" />
                          </FormControl>
                          <FormLabel className="font-normal">Semua Guru</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="all_students" />
                          </FormControl>
                          <FormLabel className="font-normal">Semua Siswa</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="specific_class" />
                          </FormControl>
                          <FormLabel className="font-normal">Kelas Tertentu</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchTargetAudience === 'specific_class' && (
                <FormField
                  control={form.control}
                  name="targetClassId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pilih Kelas</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kelas yang dituju" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableClasses.map((cls) => (
                            <SelectItem key={cls.ID_Kelas} value={cls.ID_Kelas}>
                              {cls.Nama_Kelas} ({cls.jurusan})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
             <CardFooter className="flex justify-end p-6">
                <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                Kirim Pengumuman
                </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
