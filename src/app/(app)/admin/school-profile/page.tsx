
"use client";

import * as React from "react"; // Added React import for useMemo
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Building, Save, Loader2, Image as ImageIcon } from "lucide-react"; // PlusCircle, Trash2 removed as they are not used in this specific file
import { useState, useEffect } from "react";
import type { SchoolProfileData, LandingPageSlide } from "@/lib/types";
import { getSchoolProfile, updateSchoolProfile } from "@/lib/mockData";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const landingPageSlideSchema = z.object({
  imageUrl: z.string().url("URL Gambar tidak valid.").or(z.literal("")).optional(),
  description: z.string().max(200, "Deskripsi maksimal 200 karakter.").or(z.literal("")).optional(),
});

const schoolProfileSchema = z.object({
  namaSekolah: z.string().min(3, "Nama sekolah minimal 3 karakter."),
  npsn: z.string().regex(/^[0-9]{8}$/, "NPSN harus 8 digit angka.").optional().or(z.literal("")),
  jenjang: z.enum(["SD", "SMP", "SMA", "SMK", "Lainnya", ""], {errorMap: () => ({ message: "Pilih jenjang yang valid." })}).default(""),
  statusSekolah: z.enum(["Negeri", "Swasta", ""], {errorMap: () => ({ message: "Pilih status sekolah yang valid." })}).default(""),
  akreditasi: z.string().optional(),
  namaKepalaSekolah: z.string().min(3, "Nama kepala sekolah minimal 3 karakter.").optional().or(z.literal("")),
  alamatJalan: z.string().min(5, "Alamat jalan minimal 5 karakter.").optional().or(z.literal("")),
  kota: z.string().min(3, "Kota minimal 3 karakter.").optional().or(z.literal("")),
  provinsi: z.string().min(3, "Provinsi minimal 3 karakter.").optional().or(z.literal("")),
  kodePos: z.string().regex(/^[0-9]{5}$/, "Kode pos harus 5 digit angka.").optional().or(z.literal("")),
  nomorTelepon: z.string().regex(/^[0-9\\-\\+\\(\\)\\s]*$/, "Format nomor telepon tidak valid.").optional().or(z.literal("")),
  emailSekolah: z.string().email("Format email tidak valid.").optional().or(z.literal("")),
  websiteSekolah: z.string().url("Format URL website tidak valid.").optional().or(z.literal("")),
  visi: z.string().max(1000, "Visi maksimal 1000 karakter.").optional(),
  misi: z.string().max(2000, "Misi maksimal 2000 karakter.").optional(),
  logo: z.any().optional(),
  landingPageSlides: z.array(landingPageSlideSchema).optional().default([{ imageUrl: "", description: "" }, { imageUrl: "", description: "" }, { imageUrl: "", description: "" }]),
  landingPageImageUrl: z.string().url("URL Gambar tidak valid.").optional().or(z.literal("")),
});

export default function AdminSchoolProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [landingPageImagePreview, setLandingPageImagePreview] = useState<string | null>(null);
  const [slideImagePreviews, setSlideImagePreviews] = useState<Array<string | null>>([null, null, null]);

  // Memoize initialSchoolProfileData to prevent re-creation on every render
  const initialSchoolProfileData = React.useMemo(() => getSchoolProfile(), []);

  const form = useForm<z.infer<typeof schoolProfileSchema>>({
    resolver: zodResolver(schoolProfileSchema),
    defaultValues: {
      namaSekolah: initialSchoolProfileData.namaSekolah || "",
      npsn: initialSchoolProfileData.npsn || "",
      jenjang: initialSchoolProfileData.jenjang || "",
      statusSekolah: initialSchoolProfileData.statusSekolah || "",
      akreditasi: initialSchoolProfileData.akreditasi || "",
      namaKepalaSekolah: initialSchoolProfileData.namaKepalaSekolah || "",
      alamatJalan: initialSchoolProfileData.alamatJalan || "",
      kota: initialSchoolProfileData.kota || "",
      provinsi: initialSchoolProfileData.provinsi || "",
      kodePos: initialSchoolProfileData.kodePos || "",
      nomorTelepon: initialSchoolProfileData.nomorTelepon || "",
      emailSekolah: initialSchoolProfileData.emailSekolah || "",
      websiteSekolah: initialSchoolProfileData.websiteSekolah || "",
      visi: initialSchoolProfileData.visi || "",
      misi: initialSchoolProfileData.misi || "",
      logo: typeof initialSchoolProfileData.logo === 'string' ? initialSchoolProfileData.logo : undefined,
      landingPageImageUrl: initialSchoolProfileData.landingPageImageUrl || "",
      landingPageSlides: (initialSchoolProfileData.landingPageSlides && initialSchoolProfileData.landingPageSlides.length > 0)
        ? initialSchoolProfileData.landingPageSlides.slice(0, 3).concat(Array(Math.max(0, 3 - initialSchoolProfileData.landingPageSlides.length)).fill({ imageUrl: "", description: "" })).slice(0,3)
        : [
            { imageUrl: "", description: "" },
            { imageUrl: "", description: "" },
            { imageUrl: "", description: "" },
          ],
    },
  });

  const { fields } = useFieldArray({ // append and remove are not used but defined by the hook
    control: form.control,
    name: "landingPageSlides",
  });

  useEffect(() => {
    const currentProfile = initialSchoolProfileData;
    if (currentProfile) {
        form.reset({
            namaSekolah: currentProfile.namaSekolah || "",
            npsn: currentProfile.npsn || "",
            jenjang: currentProfile.jenjang || "",
            statusSekolah: currentProfile.statusSekolah || "",
            akreditasi: currentProfile.akreditasi || "",
            namaKepalaSekolah: currentProfile.namaKepalaSekolah || "",
            alamatJalan: currentProfile.alamatJalan || "",
            kota: currentProfile.kota || "",
            provinsi: currentProfile.provinsi || "",
            kodePos: currentProfile.kodePos || "",
            nomorTelepon: currentProfile.nomorTelepon || "",
            emailSekolah: currentProfile.emailSekolah || "",
            websiteSekolah: currentProfile.websiteSekolah || "",
            visi: currentProfile.visi || "",
            misi: currentProfile.misi || "",
            logo: typeof currentProfile.logo === 'string' ? currentProfile.logo : undefined,
            landingPageImageUrl: currentProfile.landingPageImageUrl || "",
            landingPageSlides: (currentProfile.landingPageSlides && currentProfile.landingPageSlides.length > 0)
              ? currentProfile.landingPageSlides.slice(0, 3).concat(Array(Math.max(0, 3 - currentProfile.landingPageSlides.length)).fill({ imageUrl: "", description: "" })).slice(0,3)
              : [
                  { imageUrl: "", description: "" },
                  { imageUrl: "", description: "" },
                  { imageUrl: "", description: "" },
                ],
        });
        if (typeof currentProfile.logo === 'string' && currentProfile.logo.trim() !== '') {
          setLogoPreview(currentProfile.logo);
        } else {
          setLogoPreview(null);
        }
        if (currentProfile.landingPageImageUrl && currentProfile.landingPageImageUrl.trim() !== '') {
          setLandingPageImagePreview(currentProfile.landingPageImageUrl);
        } else {
          setLandingPageImagePreview(null);
        }
         const newPreviews = (currentProfile.landingPageSlides || []).slice(0, 3).map(slide => slide.imageUrl || null);
         setSlideImagePreviews(newPreviews.concat(Array(Math.max(0, 3 - newPreviews.length)).fill(null)).slice(0,3));
    }
  }, [form, initialSchoolProfileData]);


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
      setLogoPreview(typeof initialSchoolProfileData.logo === 'string' ? initialSchoolProfileData.logo : null);
    }
  };

  const handleLandingPageImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    form.setValue("landingPageImageUrl", url);
    if (url && url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
        setLandingPageImagePreview(url);
    } else {
        setLandingPageImagePreview(null);
    }
  };

  const handleSlideImageUrlChange = (index: number, url: string) => {
    form.setValue(`landingPageSlides.${index}.imageUrl`, url);
    const newPreviews = [...slideImagePreviews];
    if (url && url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      newPreviews[index] = url;
    } else {
      newPreviews[index] = null;
    }
    setSlideImagePreviews(newPreviews);
  };


  async function onSubmit(values: z.infer<typeof schoolProfileSchema>) {
    setIsLoading(true);

    let logoToSave: string | undefined = typeof initialSchoolProfileData.logo === 'string' ? initialSchoolProfileData.logo : undefined;

    if (values.logo instanceof File) {
      logoToSave = logoPreview || undefined;
      console.log("Simulasi unggah logo baru:", values.logo.name, "URL Baru (Simulasi):", logoToSave);
    } else if (typeof values.logo === 'string') {
      logoToSave = values.logo;
    }

    const slidesToSave = (values.landingPageSlides || [])
      .map(slide => ({
        imageUrl: slide.imageUrl || "",
        description: slide.description || ""
      }))
      .filter(slide => (slide.imageUrl || "").trim() !== "" || (slide.description || "").trim() !== "");

    const profileToUpdate: SchoolProfileData = {
        ...initialSchoolProfileData,
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
        landingPageImageUrl: values.landingPageImageUrl || "",
        landingPageSlides: slidesToSave.length > 0 ? slidesToSave : initialSchoolProfileData.landingPageSlides,
    };

    updateSchoolProfile(profileToUpdate);

    toast({
      title: "Data Sekolah Disimpan",
      description: "Informasi profil sekolah telah berhasil diperbarui.",
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
                    <Select onValueChange={field.onChange} value={field.value || ""}>
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
                    <Select onValueChange={field.onChange} value={field.value || ""}>
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
                  <Image src={logoPreview} alt="Pratinjau Logo Sekolah" width={160} height={40} className="object-contain w-auto h-10 p-1 border rounded-md bg-muted" data-ai-hint="school logo"/>
                </div>
              )}

              <Separator />
               <FormField
                control={form.control}
                name="landingPageImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Gambar Halaman Utama (Carousel Slide Tunggal)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://contoh.com/gambar-utama.jpg"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                            field.onChange(e);
                            handleLandingPageImageChange(e);
                        }}
                      />
                    </FormControl>
                     <FormDescription>URL ini akan digunakan jika slide carousel di bawah tidak diisi.</FormDescription>
                    {landingPageImagePreview && (
                      <div className="mt-2">
                        <Image src={landingPageImagePreview} alt="Pratinjau Gambar Halaman Utama" width={300} height={150} className="object-cover border rounded-md" data-ai-hint="education technology"/>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />
              <h3 className="text-lg font-semibold">Slide Gambar Halaman Utama (Carousel)</h3>
              <FormDescription>Kelola hingga 3 slide untuk carousel di halaman utama. Jika diisi, ini akan menggantikan "URL Gambar Halaman Utama" di atas.</FormDescription>

              {fields.slice(0, 3).map((fieldItem, index) => (
                <Card key={fieldItem.id} className="p-4 border">
                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-md">Slide {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 space-y-3">
                    <FormField
                      control={form.control}
                      name={`landingPageSlides.${index}.imageUrl`}
                      render={({ field: slideField }) => (
                        <FormItem>
                          <FormLabel>URL Gambar Slide {index + 1}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://contoh.com/gambar.jpg"
                              {...slideField}
                              value={slideField.value || ""}
                              onChange={(e) => handleSlideImageUrlChange(index, e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {slideImagePreviews[index] && (
                      <div className="mt-2">
                         <Image src={slideImagePreviews[index]!} alt={`Pratinjau Slide ${index + 1}`} width={200} height={100} className="object-contain p-1 border rounded-md max-h-24 bg-muted" data-ai-hint="presentation abstract"/>
                      </div>
                    )}
                    <FormField
                      control={form.control}
                      name={`landingPageSlides.${index}.description`}
                      render={({ field: slideField }) => (
                        <FormItem>
                          <FormLabel>Deskripsi Slide {index + 1}</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Deskripsi singkat untuk slide ini..." className="min-h-[60px]" {...slideField} value={slideField.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
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

    