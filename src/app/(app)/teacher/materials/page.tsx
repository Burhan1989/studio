
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

export default function TeacherMaterialsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <UploadCloud className="w-10 h-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Materi Saya</h1>
          <p className="text-muted-foreground">
            Kelola materi pelajaran yang telah Anda buat atau unggah. (Fitur dalam pengembangan)
          </p>
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Materi Pelajaran</CardTitle>
          <CardDescription>
            Di sini Anda akan dapat melihat, menambah, mengedit, dan menghapus materi pelajaran Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Fungsionalitas untuk mengelola materi (seperti unggah file, tambah video, dll.) akan ditambahkan di iterasi berikutnya.
          </p>
          {/* Placeholder untuk daftar materi nantinya */}
        </CardContent>
      </Card>
    </div>
  );
}
