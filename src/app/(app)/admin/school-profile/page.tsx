
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
import { useState, useEffect } from "react";
import type { SchoolProfileData } from "@/lib/types";
import { mockSchoolProfile } from "@/lib/mockData"; // Import mockSchoolProfile
import Image from "next/image"; // Import next/image

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

  // Use mockSchoolProfile for initial form values
  const initialData = mockSchoolProfile;
  
  const form = useForm<z.infer<typeof schoolProfileSchema>>({
    resolver: zodResolver(schoolProfileSchema),
    defaultValues: {
      ...initialData, // Spread initialData
      // Ensure logo field in form is initially aligned with what mockData might have (URL string or undefined)
      logo: typeof initialData.logo === 'string' ? initialData.logo : undefined,
    },
  });

  useEffect(() => {
    // Set initial logo preview if a logo URL exists in mockSchoolProfile
    if (typeof initialData.logo === 'string' && initialData.logo.trim() !== '') {
      setLogoPreview(initialData.logo);
    }
  }, [initialData.logo]);


  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("logo", file); // Store the File object for potential upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string); // Show preview of the selected file
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue("logo", undefined);
      // If no file is selected, and there was an existing logo URL, revert to it or clear
      setLogoPreview(typeof initialData.logo === 'string' ? initialData.logo : null);
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
    // In a real app, you'd update mockSchoolProfile or re-fetch if data is saved to a backend
    // For now, if a new logo was selected via file input, it's only in logoPreview and form state.
    // If values.logo is a File, it means a new logo was chosen.
    // If values.logo is a string (from defaultValues), it's the existing URL.
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
                      <Input placeholder="cth. A (Unggul)" {...field} value={field.value || ""} />
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
                      <Input placeholder="Nama lengkap kepala sekolah" {...field} value={field.value || ""} />
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
                      <Textarea placeholder="Masukkan alamat lengkap jalan, nomor, RT/RW, Kelurahan, Kecamatan" {...field} value={field.value || ""} />
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
                        <Input placeholder="Kota atau Kabupaten" {...field} value={field.value || ""} />
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
                        <Input placeholder="Provinsi" {...field} value={field.value || ""} />
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
                        <Input placeholder="Kode Pos" {...field} value={field.value || ""} />
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
                        <Input type="tel" placeholder="Nomor telepon sekolah" {...field} value={field.value || ""} />
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
                        <Input type="email" placeholder="Email resmi sekolah" {...field} value={field.value || ""} />
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
                        <Input type="url" placeholder="https://namasekolah.sch.id" {...field} value={field.value || ""} />
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
                      <Textarea placeholder="Tuliskan visi sekolah" className="min-h-[100px]" {...field} value={field.value || ""} />
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
                      <Textarea placeholder="Tuliskan misi sekolah (gunakan baris baru untuk poin-poin misi)" className="min-h-[150px]" {...field} value={field.value || ""} />
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
                  <Image src={logoPreview} alt="Pratinjau Logo Sekolah" width={160} height={40} className="h-10 w-auto border rounded-md object-contain bg-muted p-1" data-ai-hint="school logo" />
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
