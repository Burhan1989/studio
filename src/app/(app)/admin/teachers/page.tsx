
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit, Trash2, UserCog, KeyRound, Upload, Download, RefreshCw } from "lucide-react"; 
import type { TeacherData } from "@/lib/types"; 
import Link from "next/link";
import { mockTeachers } from "@/lib/mockData";
import { useState, useEffect } from "react";


export default function AdminTeachersPage() {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<TeacherData[]>([]);

  useEffect(() => {
    // Simulate fetching or initializing teachers.
    setTeachers([...mockTeachers]); 
  }, []);


  const handleActionPlaceholder = (action: string, item: string) => {
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas "${action} ${item}" akan segera hadir.`,
    });
  };

  const handleResetPassword = (teacher: TeacherData) => {
    // In a real app, you'd call an API to reset the password.
    // Here, we just show a toast.
    console.log(`Simulasi reset password untuk ${teacher.Nama_Lengkap} menjadi tanggal lahir: ${teacher.Tanggal_Lahir}`);
    toast({
      title: "Password Direset (Simulasi)",
      description: `Password untuk guru "${teacher.Nama_Lengkap}" telah direset menjadi tanggal lahirnya (simulasi). Pastikan guru diberitahu.`,
      variant: "default",
      duration: 5000,
    });
    // Optionally, you could update the mockTeachers array here if Password_Hash was being used for login simulation
    // For example:
    // const updatedTeachers = teachers.map(t => 
    //   t.ID_Guru === teacher.ID_Guru ? { ...t, Password_Hash: teacher.Tanggal_Lahir } : t
    // );
    // setTeachers(updatedTeachers); // This would update the local state
    // // And if mockTeachers is a let variable in mockData.ts:
    // const index = mockTeachers.findIndex(t => t.ID_Guru === teacher.ID_Guru);
    // if (index !== -1) mockTeachers[index].Password_Hash = teacher.Tanggal_Lahir;
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
      description: "Password massal untuk guru akan digenerate dari tanggal lahir mereka (simulasi). Implementasi backend diperlukan.",
      variant: "default",
      duration: 5000,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kelola Data Guru</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <UserCog className="w-8 h-8 text-primary" />
            <CardTitle className="text-xl">Manajemen Data Guru (Excel)</CardTitle>
          </div>
          <CardDescription>Import dan export data guru menggunakan file Excel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => handleExcelAction("Import", "Data Guru")} variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" /> Import Guru
            </Button>
            <Button onClick={() => handleExcelAction("Export", "Data Guru")} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" /> Export Guru
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Catatan: Fitur import/export Excel saat ini adalah placeholder UI. Implementasi backend diperlukan.</p>
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
                  <TableCell className="font-medium">{teacher.Nama_Lengkap}</TableCell>
                  <TableCell>{teacher.Username}</TableCell>
                  <TableCell>{teacher.Email}</TableCell>
                  <TableCell>{teacher.Jabatan || '-'}</TableCell>
                  <TableCell>{teacher.Mata_Pelajaran}</TableCell>
                  <TableCell>{teacher.Kelas_Ajar.join(", ")}</TableCell>
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
                    <Button variant="destructive" size="sm" onClick={() => handleActionPlaceholder("Hapus", `Guru ${teacher.Nama_Lengkap}`)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleResetPassword(teacher)}>
                      <KeyRound className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {teachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">Belum ada data guru.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
