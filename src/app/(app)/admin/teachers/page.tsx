
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit, Trash2, UserCog, KeyRound, Upload, Download } from "lucide-react"; 
import type { TeacherData } from "@/lib/types"; 

// Mock Data Guru (Sementara) - Lebih Detail
const mockTeachers: TeacherData[] = [
  { 
    ID_Guru: "guru1", 
    Nama_Lengkap: "Dr. Budi Darmawan, S.Kom., M.Cs.", 
    Username: "budi.darmawan",
    Email: "budi.d@example.com", 
    Mata_Pelajaran: "Matematika Lanjut", 
    Kelas_Ajar: ["Kelas 11A", "Kelas 12B"],
    Jenis_Kelamin: "Laki-laki",
    Tanggal_Lahir: "1980-05-15",
    Alamat: "Jl. Pendidikan No. 1, Jakarta",
    Nomor_Telepon: "081234567890",
    Status_Aktif: true,
    Password_Hash: "hashed_password_guru1", 
    Tanggal_Pendaftaran: "2010-08-01",
    Jabatan: "Guru Senior",
    Profil_Foto: "https://placehold.co/100x100.png"
  },
  { 
    ID_Guru: "guru2", 
    Nama_Lengkap: "Siti Nurhaliza, M.Pd.", 
    Username: "siti.nurhaliza",
    Email: "siti.n@example.com", 
    Mata_Pelajaran: "Bahasa Indonesia", 
    Kelas_Ajar: ["Kelas 10A", "Kelas 10C"],
    Jenis_Kelamin: "Perempuan",
    Tanggal_Lahir: "1985-11-20",
    Alamat: "Jl. Cendekia No. 5, Bandung",
    Nomor_Telepon: "081234567891",
    Status_Aktif: true,
    Password_Hash: "hashed_password_guru2", 
    Tanggal_Pendaftaran: "2012-07-15",
    Jabatan: "Guru Mata Pelajaran",
    Profil_Foto: "https://placehold.co/100x100.png"
  },
  { 
    ID_Guru: "guru3", 
    Nama_Lengkap: "Prof. Dr. Agus Salim, M.Sc.", 
    Username: "agus.salim",
    Email: "agus.s@example.com", 
    Mata_Pelajaran: "Fisika Dasar", 
    Kelas_Ajar: ["Kelas 11B"],
    Jenis_Kelamin: "Laki-laki",
    Tanggal_Lahir: "1975-03-10",
    Alamat: "Jl. Ilmuwan No. 12, Surabaya",
    Nomor_Telepon: "081234567892",
    Status_Aktif: false, 
    Password_Hash: "hashed_password_guru3", 
    Tanggal_Pendaftaran: "2005-01-20",
    Jabatan: "Kepala Jurusan IPA",
    Profil_Foto: "https://placehold.co/100x100.png"
  },
];

export default function AdminTeachersPage() {
  const { toast } = useToast();

  const handleActionPlaceholder = (action: string, item: string) => {
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas "${action} ${item}" akan segera hadir.`,
    });
  };

  const handleExcelAction = (actionType: string) => {
    console.log(`Aksi Excel: ${actionType}`);
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas ${actionType} menggunakan file Excel akan segera hadir. Ini adalah placeholder.`,
      variant: "default",
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
            <Button onClick={() => handleExcelAction("Import Guru")} variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" /> Import Guru
            </Button>
            <Button onClick={() => handleExcelAction("Export Guru")} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" /> Export Guru
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Catatan: Fitur import/export Excel saat ini adalah placeholder UI. Implementasi backend diperlukan.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Icon can be UserCog or similar, already used above, maybe no icon here or a different one like List */}
              <CardTitle className="text-xl">Daftar Guru</CardTitle>
            </div>
            <Button onClick={() => handleActionPlaceholder("Tambah", "Guru Baru")}>
              <UserPlus className="w-4 h-4 mr-2" /> Tambah Guru Baru
            </Button>
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
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Kelas Diajar</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTeachers.map((teacher) => (
                <TableRow key={teacher.ID_Guru}>
                  <TableCell className="font-medium">{teacher.Nama_Lengkap}</TableCell>
                  <TableCell>{teacher.Username}</TableCell>
                  <TableCell>{teacher.Email}</TableCell>
                  <TableCell>{teacher.Mata_Pelajaran}</TableCell>
                  <TableCell>{teacher.Kelas_Ajar.join(", ")}</TableCell>
                  <TableCell>
                    <Badge variant={teacher.Status_Aktif ? "default" : "destructive"}>
                      {teacher.Status_Aktif ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleActionPlaceholder("Edit", `Guru ${teacher.Nama_Lengkap}`)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleActionPlaceholder("Hapus", `Guru ${teacher.Nama_Lengkap}`)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleActionPlaceholder("Reset Akun", `Guru ${teacher.Nama_Lengkap}`)}>
                      <KeyRound className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {mockTeachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">Belum ada data guru.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
