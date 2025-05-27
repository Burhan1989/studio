
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
import { getSchoolProfile, updateSchoolProfile } from "@/lib/mockData";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  nomorTelepon: z.string().regex(/^[0-9\\-\\+\\(\\)\\s]+$/, "Format nomor telepon tidak valid.").optional().or(z.literal("")),
  emailSekolah: z.string().email("Format email tidak valid.").optional().or(z.literal("")),
  websiteSekolah: z.string().url("Format URL website tidak valid.").optional().or(z.literal("")),
  visi: z.string().max(1000, "Visi maksimal 1000 karakter.").optional(),
  misi: z.string().max(2000, "Misi maksimal 2000 karakter.").optional(),
  logo: z.any().optional(),
  landingPageImageUrl: z.string().url("Format URL tidak valid.").optional().or(z.literal("")),
});

export default function AdminSchoolProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [landingImagePreview, setLandingImagePreview] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<SchoolProfileData>(getSchoolProfile());

  const form = useForm<z.infer<typeof schoolProfileSchema>>({
    resolver: zodResolver(schoolProfileSchema),
    defaultValues: {
      ...initialData,
      logo: typeof initialData.logo === 'string' ? initialData.logo : undefined,
      landingPageImageUrl: initialData.landingPageImageUrl || "",
    },
  });

  useEffect(() => {
    const currentProfile = getSchoolProfile();
    setInitialData(currentProfile);
    form.reset({
        ...currentProfile,
        logo: typeof currentProfile.logo === 'string' ? currentProfile.logo : undefined,
        landingPageImageUrl: currentProfile.landingPageImageUrl || "",
    });
    if (typeof currentProfile.logo === 'string' && currentProfile.logo.trim() !== '') {
      setLogoPreview(currentProfile.logo);
    }
    if (typeof currentProfile.landingPageImageUrl === 'string' && currentProfile.landingPageImageUrl.trim() !== '') {
      setLandingImagePreview(currentProfile.landingPageImageUrl);
    }
  }, [form]);


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
      setLogoPreview(typeof initialData.logo === 'string' ? initialData.logo : null);
    }
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'landingPageImageUrl') {
        const url = value.landingPageImageUrl;
        if (url && url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
          setLandingImagePreview(url);
        } else {
          setLandingImagePreview(null);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  async function onSubmit(values: z.infer<typeof schoolProfileSchema>) {
    setIsLoading(true);

    let logoToSave: string | undefined = typeof initialData.logo === 'string' ? initialData.logo : undefined;

    if (values.logo instanceof File) {
      logoToSave = logoPreview || undefined;
      console.log("Simulasi unggah logo baru:", values.logo.name, "URL Baru (Simulasi):", logoToSave);
    } else if (typeof values.logo === 'string') {
      logoToSave = values.logo;
    }


    const profileToUpdate: SchoolProfileData = {
        namaSekolah: values.namaSekolah,
        npsn: values.npsn || "",
        jenjang: values.jenjang || "",
        statusSekolah: values.statusSekolah || "",
        akreditasi: values.akreditasi || "",
        namaKepalaSekolah: values.namaKepalaSekolah || "",
        alamatJalan: values.alamatJalan || "",
        kota: values.kota || "",
        provinsi: values.provinsi || "",
        kodePos: values.kodePos || "",
        nomorTelepon: values.nomorTelepon || "",
        emailSekolah: values.emailSekolah || "",
        websiteSekolah: values.websiteSekolah,
        visi: values.visi,
        misi: values.misi,
        logo: logoToSave,
        landingPageImageUrl: values.landingPageImageUrl,
    };

    updateSchoolProfile(profileToUpdate);

    toast({
      title: "Data Sekolah Disimpan",
      description: "Informasi profil sekolah telah berhasil diperbarui.",
    });
    setIsLoading(false);
    setInitialData(profileToUpdate);
    router.refresh();
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
                    <Select onValueChange={field.onChange} value={field.value || ""} defaultValue={field.value || ""}>
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
                    <Select onValueChange={field.onChange} value={field.value || ""} defaultValue={field.value || ""}>
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
              <CardTitle className="text-xl">Kustomisasi Tampilan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="logo"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" /> Unggah Logo Sekolah (Opsional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/png, image/jpeg, image/svg+xml"
                        onChange={handleLogoChange}
                      />
                    </FormControl>
                    <FormDescription>Format yang didukung: PNG, JPG, SVG. Ganti URL di bawah jika Anda tidak mengunggah file. Pratinjau akan menggunakan URL jika file tidak dipilih.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {logoPreview && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium">Pratinjau Logo:</p>
                  <Image src={logoPreview} alt="Pratinjau Logo Sekolah" width={160} height={40} className="h-10 w-auto border rounded-md object-contain bg-muted p-1" data-ai-hint="school logo"/>
                </div>
              )}
               <FormField
                control={form.control}
                name="landingPageImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Gambar Halaman Utama</FormLabel>
                    <FormControl>
                      <Input placeholder="https://contoh.com/gambar-landing.jpg" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Masukkan URL gambar yang akan ditampilkan di halaman utama.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {landingImagePreview && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium">Pratinjau Gambar Halaman Utama:</p>
                  <Image src={landingImagePreview} alt="Pratinjau Gambar Landing Page" width={300} height={200} className="w-auto rounded-md border object-contain bg-muted p-1 max-h-48" data-ai-hint="education learning"/>
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
