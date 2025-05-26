
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowLeft, FilePlus2 } from "lucide-react";
import Link from "next/link";

export default function AdminNewQuizPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FilePlus2 className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Buat Kuis Baru (Admin)</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/quizzes">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Kuis Admin
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Formulir Pembuatan Kuis</CardTitle>
          <CardDescription>
            Fitur ini sedang dalam pengembangan. Antarmuka untuk menambahkan judul, deskripsi, pertanyaan, dan menugaskan ke kelas akan tersedia di sini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Untuk saat ini, silakan gunakan fitur pembuatan kuis yang tersedia untuk guru.
            Admin akan memiliki kemampuan untuk membuat dan mengelola kuis secara global di iterasi berikutnya.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

    