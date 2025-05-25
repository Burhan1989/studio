
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
import { Building, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import type { SchoolProfileData } from "@/lib/types";

const schoolProfileSchema = z.object({
  namaSekolah: z.string().min(3, "Nama sekolah minimal 3 karakter."),
  npsn: z.string().regex(/^[0-9]{8}$/, "NPSN harus 8 digit angka.").optional().or(z.literal("")),
  jenjang: z.enum(["SD", "SMP", "SMA", "SMK", "Lainnya", ""]).default(""),
  statusSekolah: z.enum(["Negeri", "Swasta", ""]).default(""),
  akreditasi: z.string().optional(),
  namaKepalaSekolah: z.string().min(3, "Nama kepala sekolah minimal 3 karakter.").optional().or(z.literal("")),
  alamatJalan: z.string().min(5, "Alamat jalan minimal 5 karakter.").optional().or(z.literal("")),
  kota: z.string().min(3, "Kota minimal 3 karakter.").optional().or(z.literal("")),
  provinsi: z.string().min(3, "Provinsi minimal 3 karakter.").optional().or(z.literal("")),
  kodePos: z.string().regex(/^[0-9]{5}$/, "Kode pos harus 5 digit angka.").optional().or(z.literal("")),
  nomorTelepon: z.string().regex(/^[0-9\-\+\(\)\s]+$/, "Format nomor telepon tidak valid.").optional().or(z.literal("")),
  emailSekolah: z.string().email("Format email tidak valid.").optional().or(z.literal("")),
  websiteSekolah: z.string().url("Format URL website tidak valid.").optional().or(z.literal("")),
  visi: z.string().max(1000, "Visi maksimal 1000 karakter.").optional(),
  misi: z.string().max(2000, "Misi maksimal 2000 karakter.").optional(),
  logo: z.any().optional(), // Handle file upload separately
});

export default function AdminSchoolProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Mock data for initial form values (in real app, fetch this from DB)
  const mockInitialData: Partial<SchoolProfileData> = {
    namaSekolah: "SMA Negeri 1 Teladan Bangsa",
    npsn: "12345678",
    jenjang: "SMA",
    statusSekolah: "Negeri",
    akreditasi: "A (Unggul)",
    namaKepalaSekolah: "Dr. H. Budi Santoso, M.Pd.",
    alamatJalan: "Jl. Pendidikan No. 1",
    kota: "Jakarta Selatan",
    provinsi: "DKI Jakarta",
    kodePos: "12345",
    nomorTelepon: "021-1234567",
    emailSekolah: "info@sman1teladan.sch.id",
    websiteSekolah: "https://sman1teladan.sch.id",
    visi: "Menjadi sekolah unggul yang berkarakter, berprestasi, dan berwawasan global.",
    misi: "1. Melaksanakan pembelajaran yang inovatif dan kreatif.\n2. Mengembangkan potensi siswa secara optimal.\n3. Membangun karakter siswa yang berakhlak mulia."
  };
  
  const form = useForm<z.infer<typeof schoolProfileSchema>>({
    resolver: zodResolver(schoolProfileSchema),
    defaultValues: mockInitialData,
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("logo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue("logo", undefined);
      setLogoPreview(null);
    }
  };

  async function onSubmit(values: z.infer<typeof schoolProfileSchema>) {
    setIsLoading(true);
    console.log("Data profil sekolah yang akan disimpan (simulasi):", values);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Data Sekolah Disimpan (Simulasi)",
      description: "Informasi profil sekolah telah berhasil diperbarui (simulasi).",
    });
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Building className="w-10 h-10 text-primary" />
        <h1 className="text-3xl font-bold">Profil Sekolah</h1>
      </div>
      <CardDescription>Kelola informasi detail mengenai institusi sekolah Anda.</CardDescription>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Informasi Umum Sekolah</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="namaSekolah"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Sekolah</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama sekolah" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="npsn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NPSN</FormLabel>
                    <FormControl>
                      <Input placeholder="Nomor Pokok Sekolah Nasional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jenjang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenjang Pendidikan</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenjang" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SD">SD/MI</SelectItem>
                        <SelectItem value="SMP">SMP/MTs</SelectItem>
                        <SelectItem value="SMA">SMA/MA</SelectItem>
                        <SelectItem value="SMK">SMK</SelectItem>
                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="statusSekolah"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Sekolah</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Negeri">Negeri</SelectItem>
                        <SelectItem value="Swasta">Swasta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="akreditasi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Akreditasi</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. A (Unggul)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="namaKepalaSekolah"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kepala Sekolah</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama lengkap kepala sekolah" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Kontak & Alamat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="alamatJalan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Jalan</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Masukkan alamat lengkap jalan, nomor, RT/RW, Kelurahan, Kecamatan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="kota"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kota/Kabupaten</FormLabel>
                      <FormControl>
                        <Input placeholder="Kota atau Kabupaten" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="provinsi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provinsi</FormLabel>
                      <FormControl>
                        <Input placeholder="Provinsi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kodePos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Pos</FormLabel>
                      <FormControl>
                        <Input placeholder="Kode Pos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nomorTelepon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon Sekolah</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Nomor telepon sekolah" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emailSekolah"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Sekolah</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email resmi sekolah" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="websiteSekolah"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website Sekolah (Opsional)</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://namasekolah.sch.id" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Visi & Misi Sekolah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="visi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visi Sekolah (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tuliskan visi sekolah" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="misi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Misi Sekolah (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tuliskan misi sekolah (gunakan baris baru untuk poin-poin misi)" className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Logo Sekolah</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => ( // field is not directly used for input type file, but required by FormField
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" /> Unggah Logo Sekolah (Opsional)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/png, image/jpeg, image/svg+xml"
                        onChange={handleLogoChange} // Use custom handler
                      />
                    </FormControl>
                    <FormDescription>Format yang didukung: PNG, JPG, SVG. Maksimal 2MB (Contoh).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {logoPreview && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium">Pratinjau Logo:</p>
                  <img src={logoPreview} alt="Pratinjau Logo Sekolah" className="h-32 w-auto border rounded-md object-contain" />
                </div>
              )}
            </CardContent>
          </Card>

          <CardFooter className="flex justify-end p-0 pt-6">
            <Button type="submit" disabled={isLoading} size="lg">
              {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
              Simpan Data Sekolah
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
