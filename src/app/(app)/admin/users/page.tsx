
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit, Trash2, Users, UserCog, KeyRound } from "lucide-react"; // Tambahkan KeyRound
import type { TeacherData, StudentData } from "@/lib/types"; 

// Mock Data (Sementara) - Lebih Detail
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

const mockStudents: StudentData[] = [
  { 
    ID_Siswa: "siswa1", 
    Nama_Lengkap: "Ahmad Zulkifli Zaini", 
    Nama_Panggilan: "Zaini",
    Username: "ahmad.zaini",
    Email: "ahmad.z@example.com", 
    NISN: "0012345678",
    Nomor_Induk: "S1001", 
    Kelas: "Kelas 10A",
    Jenis_Kelamin: "Laki-laki",
    Tanggal_Lahir: "2007-08-17",
    Alamat: "Jl. Pelajar No. 10, Jakarta",
    Nomor_Telepon: "085678901234",
    Program_Studi: "IPA", 
    Tanggal_Daftar: "2023-07-01",
    Status_Aktif: true,
    Password_Hash: "hashed_password_siswa1", 
    Profil_Foto: "https://placehold.co/100x100.png"
  },
  { 
    ID_Siswa: "siswa2", 
    Nama_Lengkap: "Rina Amelia Putri", 
    Nama_Panggilan: "Rina",
    Username: "rina.amelia",
    Email: "rina.a@example.com", 
    NISN: "0023456789",
    Nomor_Induk: "S1002", 
    Kelas: "Kelas 11B",
    Jenis_Kelamin: "Perempuan",
    Tanggal_Lahir: "2006-05-22",
    Alamat: "Jl. Siswa No. 20, Bandung",
    Nomor_Telepon: "085678901235",
    Program_Studi: "IPS", 
    Tanggal_Daftar: "2022-07-01",
    Status_Aktif: true,
    Password_Hash: "hashed_password_siswa2", 
    Profil_Foto: "https://placehold.co/100x100.png"
  },
  { 
    ID_Siswa: "siswa3", 
    Nama_Lengkap: "Kevin Sanjaya", 
    Nama_Panggilan: "Kevin",
    Username: "kevin.sanjaya",
    Email: "kevin.s@example.com", 
    NISN: "0034567890",
    Nomor_Induk: "S1003", 
    Kelas: "Kelas 12C",
    Jenis_Kelamin: "Laki-laki",
    Tanggal_Lahir: "2005-02-10",
    Alamat: "Jl. Prestasi No. 30, Surabaya",
    Nomor_Telepon: "085678901236",
    Program_Studi: "Bahasa", 
    Tanggal_Daftar: "2021-07-01",
    Status_Aktif: false, 
    Password_Hash: "hashed_password_siswa3", 
    Profil_Foto: "https://placehold.co/100x100.png"
  },
];

export default function AdminUsersPage() {
  const { toast } = useToast();

  const handleActionPlaceholder = (action: string, item: string) => {
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas "${action} ${item}" akan segera hadir.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kelola Pengguna</h1>
      </div>

      {/* Kelola Guru */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserCog className="w-8 h-8 text-primary" />
              <CardTitle className="text-xl">Kelola Data Guru</CardTitle>
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

      {/* Kelola Siswa */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <CardTitle className="text-xl">Kelola Data Siswa</CardTitle>
            </div>
            <Button onClick={() => handleActionPlaceholder("Tambah", "Siswa Baru")}>
              <UserPlus className="w-4 h-4 mr-2" /> Tambah Siswa Baru
            </Button>
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
                    <Button variant="outline" size="sm" onClick={() => handleActionPlaceholder("Edit", `Siswa ${student.Nama_Lengkap}`)}>
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

