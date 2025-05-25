
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { School, Edit } from "lucide-react"; // Import Edit
import type { ClassData } from '@/lib/types';

const mockClasses: ClassData[] = [
  { ID_Kelas: 'kelasA', Nama_Kelas: 'Kelas 10A', ID_Guru: 'Budi Santoso', jumlahSiswa: 30, jurusan: "IPA" },
  { ID_Kelas: 'kelasB', Nama_Kelas: 'Kelas 11B', ID_Guru: 'Siti Aminah', jumlahSiswa: 28, jurusan: "IPS" },
  { ID_Kelas: 'kelasC', Nama_Kelas: 'Kelas 12C', ID_Guru: 'Agus Setiawan', jumlahSiswa: 32, jurusan: "Bahasa" },
];

export default function AdminClassesPage() {
  const { toast } = useToast();

  const handleEditClassAction = (className: string) => {
    toast({
      title: `Edit Kelas ${className}`,
      description: `Membuka form edit untuk ${className}. Implementasi form akan dilakukan pada iterasi berikutnya.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <School className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Manajemen Kelas & Wali Kelas</h1>
        </div>
        <Button onClick={() => toast({ title: "Fitur Dalam Pengembangan", description: "Form tambah kelas baru akan segera hadir."})}>
          Tambah Kelas Baru
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
              {mockClasses.map((kelas) => (
                <TableRow key={kelas.ID_Kelas}>
                  <TableCell>{kelas.Nama_Kelas}</TableCell>
                  <TableCell>{kelas.jurusan || '-'}</TableCell>
                  <TableCell>{kelas.ID_Guru}</TableCell>
                  <TableCell>{kelas.jumlahSiswa || 0}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEditClassAction(kelas.Nama_Kelas)}>
                      <Edit className="w-4 h-4" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {mockClasses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Belum ada data kelas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
           <p className="mt-4 text-xs text-muted-foreground">Catatan: Fitur ini adalah placeholder UI. Implementasi CRUD (Create, Read, Update, Delete) penuh diperlukan.</p>
        </CardContent>
      </Card>
    </div>
  );
}
