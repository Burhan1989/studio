
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit, Trash2, Users, KeyRound, Upload, Download, RefreshCw } from "lucide-react";
import type { StudentData } from "@/lib/types";
import { getStudents, deleteStudentById } from "@/lib/mockData";
import Link from "next/link";
import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


export default function AdminStudentsPage() {
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [studentToDelete, setStudentToDelete] = useState<StudentData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStudents = () => {
    setStudents(getStudents());
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteStudent = () => {
    if (studentToDelete) {
      const success = deleteStudentById(studentToDelete.ID_Siswa);
      if (success) {
        toast({
          title: "Siswa Dihapus",
          description: `Siswa "${studentToDelete.Nama_Lengkap}" telah berhasil dihapus.`,
        });
        fetchStudents(); 
      } else {
        toast({
          title: "Gagal Menghapus",
          description: `Siswa "${studentToDelete.Nama_Lengkap}" tidak ditemukan atau gagal dihapus.`,
          variant: "destructive",
        });
      }
      setStudentToDelete(null); 
    }
  };

  const handleActionPlaceholder = (action: string, item: string) => {
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas "${action} ${item}" akan segera hadir.`,
    });
  };

  const handleResetPassword = (student: StudentData) => {
    console.log(`Simulasi reset password untuk ${student.Nama_Lengkap} menjadi tanggal lahir: ${student.Tanggal_Lahir}`);
    toast({
      title: "Password Direset (Simulasi)",
      description: `Password untuk siswa "${student.Nama_Lengkap}" telah direset menjadi tanggal lahirnya (simulasi). Pastikan siswa diberitahu.`,
      variant: "default",
      duration: 5000,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Memulai Ekspor Data Siswa",
      description: "Sedang mempersiapkan file CSV...",
    });
    const dataToExport = getStudents();
    if (dataToExport.length === 0) {
      toast({
        title: "Ekspor Dibatalkan",
        description: "Tidak ada data siswa untuk diekspor.",
        variant: "destructive"
      });
      return;
    }
    const header = "ID_Siswa,Nama_Lengkap,Email,NISN,Nomor_Induk,Kelas,Jurusan,Status_Aktif\n";
    const csvRows = dataToExport.map(student =>
      `${student.ID_Siswa},"${student.Nama_Lengkap.replace(/"/g, '""')}","${student.Email}","${student.NISN}","${student.Nomor_Induk}","${student.Kelas}","${student.Program_Studi}",${student.Status_Aktif}`
    ).join("\n");
    const csvString = header + csvRows;

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "data_siswa.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Ekspor Berhasil",
      description: "Data siswa telah berhasil diekspor sebagai data_siswa.csv.",
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "File Dipilih",
        description: `File "${file.name}" dipilih. Memproses impor (simulasi)...`,
      });
      setTimeout(() => {
        toast({
          title: "Impor Selesai (Simulasi)",
          description: `Impor data siswa dari "${file.name}" telah selesai. Data tidak benar-benar diperbarui.`,
        });
      }, 2000);
    }
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
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
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileSelected}
        accept=".csv,.xlsx"
      />
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kelola Data Siswa</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <CardTitle className="text-xl">Manajemen Data Siswa (CSV/Excel)</CardTitle>
          </div>
          <CardDescription>Impor dan ekspor data siswa menggunakan file CSV atau Excel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={handleImportClick} variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" /> Import Siswa
            </Button>
            <Button onClick={handleExportData} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" /> Export Siswa (CSV)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Catatan: Fitur impor saat ini adalah simulasi. Ekspor menghasilkan file CSV contoh.</p>
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
              <Button onClick={() => handleActionPlaceholder("Tambah", "Siswa Baru (Form belum dibuat)")}>
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
                <TableHead>Foto</TableHead>
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
              {students.map((student) => (
                <TableRow key={student.ID_Siswa}>
                  <TableCell>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={student.Profil_Foto} alt={student.Nama_Lengkap} />
                      <AvatarFallback>{student.Nama_Lengkap.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
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
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/students/${student.ID_Siswa}/edit`}>
                        <Edit className="w-4 h-4" /> Edit
                      </Link>
                    </Button>
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => setStudentToDelete(student)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus siswa "{studentToDelete?.Nama_Lengkap}"? Tindakan ini tidak dapat diurungkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setStudentToDelete(null)}>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteStudent}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button variant="outline" size="sm" onClick={() => handleResetPassword(student)}>
                      <KeyRound className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground">Belum ada data siswa.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
