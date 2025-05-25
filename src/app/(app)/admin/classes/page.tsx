
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { School, Edit, PlusCircle } from "lucide-react"; 
import Link from "next/link";
import { mockClasses } from "@/lib/mockData"; // Import mockClasses
import type { ClassData } from '@/lib/types';
import { useEffect, useState } from "react";

export default function AdminClassesPage() {
  const { toast } = useToast();
  // Use a state to hold classes if you plan to update them client-side and re-render.
  // For now, directly using imported mockClasses for simplicity in display.
  // If mockClasses is mutated by the edit page, this page won't re-render automatically
  // without further state management or a re-fetch mechanism.
  const [classes, setClasses] = useState<ClassData[]>([]);

  useEffect(() => {
    // Simulate fetching or initializing classes.
    // This ensures that if mockClasses is mutated elsewhere (like in edit page),
    // this component uses a fresh (or rather, the current state of the mutated) version on mount/navigation.
    setClasses([...mockClasses]); // Create a shallow copy to trigger re-render if needed in future
  }, []);


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <School className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Manajemen Kelas & Wali Kelas</h1>
        </div>
        <Button onClick={() => toast({ title: "Fitur Dalam Pengembangan", description: "Form tambah kelas baru akan segera hadir."})}>
           <PlusCircle className="w-4 h-4 mr-2" /> Tambah Kelas Baru
        </Button>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Daftar Kelas</CardTitle>
          <CardDescription>Kelola data kelas, jurusan, dan penetapan wali kelas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kelas</TableHead>
                <TableHead>Jurusan</TableHead>
                <TableHead>Wali Kelas (ID Guru)</TableHead>
                <TableHead>Jumlah Siswa (Contoh)</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((kelas) => (
                <TableRow key={kelas.ID_Kelas}>
                  <TableCell>{kelas.Nama_Kelas}</TableCell>
                  <TableCell>{kelas.jurusan || '-'}</TableCell>
                  <TableCell>{kelas.ID_Guru}</TableCell>
                  <TableCell>{kelas.jumlahSiswa || 0}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/classes/${kelas.ID_Kelas}/edit`}>
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {classes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Belum ada data kelas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
           <p className="mt-4 text-xs text-muted-foreground">Catatan: Fitur "Tambah Kelas Baru" dan "Hapus Kelas" akan diimplementasikan pada iterasi berikutnya.</p>
        </CardContent>
      </Card>
    </div>
  );
}
