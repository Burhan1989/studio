
"use client"; // Diubah menjadi Client Component

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getSchoolProfile } from '@/lib/mockData';
import type { SchoolProfileData } from '@/lib/types';

export default function LandingPage() {
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfileData | null>(null);

  useEffect(() => {
    setSchoolProfile(getSchoolProfile());
  }, []);

  const imageUrl = schoolProfile?.landingPageImageUrl || "https://placehold.co/600x400.png";
  const schoolName = schoolProfile?.namaSekolah || "AdeptLearn";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col items-start gap-4">
            <div className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full text-primary bg-primary/10">
              <GraduationCap className="w-4 h-4 mr-2" /> Selamat Datang di {schoolName}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
              Buka Potensi Anda dengan Pembelajaran Adaptif
            </h1>
            <p className="max-w-[700px] text-lg text-foreground/80">
              {schoolName} mempersonalisasi perjalanan pendidikan Anda. Platform kami yang didukung AI beradaptasi dengan gaya belajar Anda, membantu Anda menguasai keterampilan baru secara efektif.
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  Mulai Gratis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">
                  Jelajahi Fitur
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <Image
              src={imageUrl}
              alt="Ilustrasi Pembelajaran Adaptif"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl object-cover" // Added object-cover
              data-ai-hint="education technology"
              priority // Consider adding priority if it's LCP
            />
          </div>
        </section>

        <section className="py-12 bg-muted md:py-24 lg:py-32">
          <div className="container">
            <h2 className="mb-12 text-3xl font-bold text-center text-foreground">Mengapa Memilih {schoolName}?</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center p-6 text-center transition-shadow duration-300 bg-card rounded-xl hover:shadow-xl">
                <div className="p-4 mb-4 rounded-full bg-primary/10 text-primary">
                  <GraduationCap className="w-10 h-10" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Jalur yang Dipersonalisasi</h3>
                <p className="text-foreground/70">AI menyusun perjalanan belajar yang unik sesuai gaya dan kecepatan Anda.</p>
              </div>
              <div className="flex flex-col items-center p-6 text-center transition-shadow duration-300 bg-card rounded-xl hover:shadow-xl">
                <div className="p-4 mb-4 rounded-full bg-accent/10 text-accent-foreground">
                   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain-circuit"><path d="M12 5a3 3 0 1 0-5.997.125"/><path d="M18.62 4A2 2 0 0 0 17 3a2 2 0 0 0-2 2c0 .24.04.47.11.7H12a3 3 0 0 0-2.995 2.883m0 0A3 3 0 1 0 12 5"/><path d="M14.5 4.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/><path d="M12 13a3 3 0 1 0-5.997.125"/><path d="M18.62 12A2 2 0 0 0 17 11a2 2 0 0 0-2 2c0 .24.04.47.11.7H12a3 3 0 0 0-2.995 2.883m0 0A3 3 0 1 0 12 13"/><path d="M14.5 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/><path d="M4.58 8a2 2 0 0 0-1.48 3.5M20.55 8a2 2 0 0 1-1.59 3.41"/><path d="M5 16a2 2 0 0 0-1.58 3.5M20.55 16a2 2 0 0 1-1.59 3.41"/><circle cx="12" cy="12" r="1"/><path d="M12 16v2a2 2 0 0 0-2 2H8"/><path d="M12 8V6a2 2 0 0 0-2-2H8"/></svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Konten Interaktif</h3>
                <p className="text-foreground/70">Terlibat dengan pelajaran, video, dan kuis khusus yang dirancang untuk Anda.</p>
              </div>
              <div className="flex flex-col items-center p-6 text-center transition-shadow duration-300 bg-card rounded-xl hover:shadow-xl">
                <div className="p-4 mb-4 rounded-full bg-primary/10 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Lacak Kemajuan Anda</h3>
                <p className="text-foreground/70">Pantau pencapaian Anda dan lihat sejauh mana Anda telah berkembang.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 text-center border-t bg-background text-foreground/60">
        <p>&copy; {new Date().getFullYear()} {schoolName}. Hak cipta dilindungi.</p>
      </footer>
    </div>
  );
}
