
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit, Trash2, Users, KeyRound, Upload, Download, RefreshCw } from "lucide-react";
import type { StudentData } from "@/lib/types"; 
import { mockStudents } from "@/lib/mockData"; // Import mockStudents


export default function AdminStudentsPage() {
  const { toast } = useToast();

  const handleActionPlaceholder = (action: string, item: string) => {
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas "${action} ${item}" akan segera hadir.`,
    });
  };

  const handleEditAction = (itemName: string) => {
    toast({
      title: `Edit ${itemName}`,
      description: `Membuka form edit untuk ${itemName}. Implementasi form akan dilakukan pada iterasi berikutnya.`,
    });
  };

  const handleExcelAction = (actionType: "Import" | "Export", dataType: string) => {
    let actionDescription = actionType === "Import" ? "Impor" : "Ekspor";
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas "${actionDescription} ${dataType} dari file Excel" akan segera hadir. Ini adalah placeholder dan memerlukan implementasi backend.`,
      variant: "default",
    });
  };

  const handleMassPasswordGenerate = () => {
    toast({
      title: "Simulasi Generate Password Massal",
      description: "Password massal untuk siswa akan digenerate dari tanggal lahir mereka (simulasi). Implementasi backend diperlukan.",
      variant: "default",
      duration: 5000,
    });
  };

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kelola Data Siswa</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <CardTitle className="text-xl">Manajemen Data Siswa (Excel)</CardTitle>
          </div>
          <CardDescription>Import dan export data siswa menggunakan file Excel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => handleExcelAction("Import", "Data Siswa")} variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" /> Import Siswa
            </Button>
            <Button onClick={() => handleExcelAction("Export", "Data Siswa")} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" /> Export Siswa
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Catatan: Fitur import/export Excel saat ini adalah placeholder UI. Implementasi backend diperlukan.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">Daftar Siswa</CardTitle>
            </div>
             <div className="flex flex-wrap gap-2">
              <Button onClick={handleMassPasswordGenerate} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" /> Generate Password Massal (Tgl. Lahir)
              </Button>
              <Button onClick={() => handleActionPlaceholder("Tambah", "Siswa Baru")}>
                <UserPlus className="w-4 h-4 mr-2" /> Tambah Siswa Baru
              </Button>
            </div>
          </div>
          <CardDescription>Lihat, tambah, edit, atau hapus data siswa dalam sistem.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Siswa</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>NISN</TableHead>
                <TableHead>No. Induk</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Jurusan</TableHead> 
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStudents.map((student) => (
                <TableRow key={student.ID_Siswa}>
                  <TableCell className="font-medium">{student.Nama_Lengkap}</TableCell>
                  <TableCell>{student.Username}</TableCell>
                  <TableCell>{student.Email}</TableCell>
                  <TableCell>{student.NISN}</TableCell>
                  <TableCell>{student.Nomor_Induk}</TableCell>
                  <TableCell>{student.Kelas}</TableCell>
                  <TableCell>{student.Program_Studi}</TableCell> 
                  <TableCell>
                    <Badge variant={student.Status_Aktif ? "default" : "destructive"}>
                      {student.Status_Aktif ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditAction(`Siswa ${student.Nama_Lengkap}`)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleActionPlaceholder("Hapus", `Siswa ${student.Nama_Lengkap}`)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleActionPlaceholder("Reset Akun", `Siswa ${student.Nama_Lengkap}`)}>
                      <KeyRound className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {mockStudents.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">Belum ada data siswa.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
