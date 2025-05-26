
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit, Trash2, UserCog, KeyRound, Upload, Download, RefreshCw } from "lucide-react";
import type { TeacherData } from "@/lib/types";
import Link from "next/link";
import { getTeachers, deleteTeacherById } from "@/lib/mockData";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format, parseISO } from 'date-fns';
import { id as LocaleID } from 'date-fns/locale';

function escapeCsvField(field: any): string {
  const fieldStr = String(field === null || field === undefined ? '' : field);
  if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n') || fieldStr.includes('\r')) {
    const escapedStr = fieldStr.replace(/"/g, '""');
    return `"${escapedStr}"`;
  }
  return fieldStr;
}


export default function AdminTeachersPage() {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTeachers = () => {
    setTeachers(getTeachers());
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDeleteTeacher = () => {
    if (teacherToDelete) {
      const success = deleteTeacherById(teacherToDelete.ID_Guru);
      if (success) {
        toast({
          title: "Guru Dihapus",
          description: `Guru "${teacherToDelete.Nama_Lengkap}" telah berhasil dihapus.`,
        });
        fetchTeachers();
      } else {
        toast({
          title: "Gagal Menghapus",
          description: `Guru "${teacherToDelete.Nama_Lengkap}" tidak ditemukan atau gagal dihapus.`,
          variant: "destructive",
        });
      }
      setTeacherToDelete(null);
    }
  };

  const handleResetPassword = (teacher: TeacherData) => {
    console.log(`Simulasi reset password untuk ${teacher.Nama_Lengkap} menjadi tanggal lahir: ${teacher.Tanggal_Lahir}`);
    toast({
      title: "Password Direset (Simulasi)",
      description: `Password untuk guru "${teacher.Nama_Lengkap}" telah direset menjadi tanggal lahirnya (simulasi). Pastikan guru diberitahu.`,
      variant: "default",
      duration: 5000,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Memulai Ekspor Data Guru",
      description: "Sedang mempersiapkan file Excel (format CSV)...",
    });

    const dataToExport = getTeachers();
    if (dataToExport.length === 0) {
      toast({
        title: "Ekspor Dibatalkan",
        description: "Tidak ada data guru untuk diekspor.",
        variant: "destructive"
      });
      return;
    }

    const header = [
      "ID_Guru", "Nama_Lengkap", "Username", "Email", "Jenis_Kelamin",
      "Tanggal_Lahir", "Alamat", "Nomor_Telepon", "Mata_Pelajaran",
      "Kelas_Ajar", "Jabatan", "Status_Aktif", "Tanggal_Pendaftaran", "isAdmin", "Profil_Foto"
    ].map(escapeCsvField).join(",") + "\n";

    const csvRows = dataToExport.map(teacher => {
      const kelasAjarCsv = Array.isArray(teacher.Kelas_Ajar) ? teacher.Kelas_Ajar.join('; ') : teacher.Kelas_Ajar;
      return [
        teacher.ID_Guru,
        teacher.Nama_Lengkap,
        teacher.Username,
        teacher.Email,
        teacher.Jenis_Kelamin,
        teacher.Tanggal_Lahir ? format(parseISO(teacher.Tanggal_Lahir), 'yyyy-MM-dd', { locale: LocaleID }) : '',
        teacher.Alamat || '',
        teacher.Nomor_Telepon || '',
        teacher.Mata_Pelajaran,
        kelasAjarCsv,
        teacher.Jabatan || '',
        String(teacher.Status_Aktif),
        teacher.Tanggal_Pendaftaran ? format(parseISO(teacher.Tanggal_Pendaftaran), 'yyyy-MM-dd', { locale: LocaleID }) : '',
        String(teacher.isAdmin || false),
        teacher.Profil_Foto || ''
      ].map(escapeCsvField).join(",");
    }).join("\n");

    const csvString = "\uFEFF" + header + csvRows; // Add BOM

    const blob = new Blob([csvString], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "data_guru.xlsx");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Ekspor Berhasil",
      description: "Data guru telah berhasil diekspor sebagai data_guru.xlsx (format CSV).",
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
        description: `File "${file.name}" dipilih untuk impor data guru. Memproses (simulasi)...`,
      });
      setTimeout(() => {
        toast({
          title: "Impor Selesai (Simulasi)",
          description: `Impor data guru dari "${file.name}" telah selesai. Data tidak benar-benar diperbarui.`,
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
      description: "Password massal untuk guru akan digenerate dari tanggal lahir mereka (simulasi). Implementasi backend diperlukan.",
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
        accept=".csv,.xlsx,.xls"
      />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kelola Data Guru</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <UserCog className="w-8 h-8 text-primary" />
            <CardTitle className="text-xl">Manajemen Data Guru (Excel/CSV)</CardTitle>
          </div>
          <CardDescription>Impor dan ekspor data guru menggunakan file Excel atau format CSV.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={handleImportClick} variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" /> Import Guru
            </Button>
            <Button onClick={handleExportData} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" /> Export Guru (Excel - Format CSV)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Catatan: Fitur impor saat ini adalah simulasi. Ekspor menghasilkan file .xlsx dengan data CSV.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">Daftar Guru</CardTitle>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleMassPasswordGenerate} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" /> Generate Password Massal (Tgl. Lahir)
              </Button>
              <Button asChild>
                <Link href="/admin/teachers/new">
                  <UserPlus className="w-4 h-4 mr-2" /> Tambah Guru Baru
                </Link>
              </Button>
            </div>
          </div>
          <CardDescription>Lihat, tambah, edit, atau hapus data guru dalam sistem.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Nama Guru</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Kelas Diajar</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.ID_Guru}>
                  <TableCell>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={teacher.Profil_Foto} alt={teacher.Nama_Lengkap} />
                      <AvatarFallback>{teacher.Nama_Lengkap.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{teacher.Nama_Lengkap}</TableCell>
                  <TableCell>{teacher.Username}</TableCell>
                  <TableCell>{teacher.Email}</TableCell>
                  <TableCell>{teacher.Jabatan || '-'}</TableCell>
                  <TableCell>{teacher.Mata_Pelajaran}</TableCell>
                  <TableCell>{Array.isArray(teacher.Kelas_Ajar) ? teacher.Kelas_Ajar.join(", ") : teacher.Kelas_Ajar}</TableCell>
                  <TableCell>
                    <Badge variant={teacher.Status_Aktif ? "default" : "destructive"}>
                      {teacher.Status_Aktif ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/teachers/${teacher.ID_Guru}/edit`}>
                        <Edit className="w-4 h-4" /> Edit
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => setTeacherToDelete(teacher)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus guru "{teacherToDelete?.Nama_Lengkap}"? Tindakan ini tidak dapat diurungkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setTeacherToDelete(null)}>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteTeacher}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button variant="outline" size="sm" onClick={() => handleResetPassword(teacher)}>
                      <KeyRound className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {teachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">Belum ada data guru.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    