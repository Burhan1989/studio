
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit, Trash2, Users, KeyRound, Upload, Download, RefreshCw } from "lucide-react";
import type { StudentData, ParentData } from "@/lib/types"; // Tambahkan ParentData
import { getStudents, deleteStudentById, addStudent, getParents } from "@/lib/mockData"; // Tambahkan getParents
import Link from "next/link";
import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
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
} from "@/components/ui/alert-dialog"; // AlertDialogTrigger dihapus karena tidak digunakan langsung di sini, tapi di dalam loop
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from 'date-fns';
import { id as LocaleID } from 'date-fns/locale';

function escapeCsvField(field: any): string {
  const fieldStr = String(field === null || field === undefined ? '' : field);
  return `"${fieldStr.replace(/"/g, '""')}"`;
}

export default function AdminStudentsPage() {
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [allParents, setAllParents] = useState<ParentData[]>([]); // State untuk menyimpan data orang tua
  const [studentToDelete, setStudentToDelete] = useState<StudentData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);

  // State untuk form tambah siswa
  const [newStudentNamaLengkap, setNewStudentNamaLengkap] = useState("");
  const [newStudentUsername, setNewStudentUsername] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentPassword, setNewStudentPassword] = useState("");
  const [newStudentNISN, setNewStudentNISN] = useState("");
  const [newStudentNomorInduk, setNewStudentNomorInduk] = useState("");
  const [newStudentJenisKelamin, setNewStudentJenisKelamin] = useState<StudentData['Jenis_Kelamin']>("");
  const [newStudentTanggalLahir, setNewStudentTanggalLahir] = useState("");
  const [newStudentKelas, setNewStudentKelas] = useState("");
  const [newStudentProgramStudi, setNewStudentProgramStudi] = useState("");
  const [newStudentParentId, setNewStudentParentId] = useState<string | undefined>(undefined); // State untuk ID Orang Tua Terkait

  const fetchStudentsAndParents = () => {
    setStudents(getStudents());
    setAllParents(getParents()); // Muat data orang tua
  };

  useEffect(() => {
    fetchStudentsAndParents();
  }, []);

  const handleDeleteStudent = () => {
    if (studentToDelete) {
      const success = deleteStudentById(studentToDelete.ID_Siswa);
      if (success) {
        toast({
          title: "Siswa Dihapus",
          description: `Siswa "${studentToDelete.Nama_Lengkap}" telah berhasil dihapus.`,
        });
        fetchStudentsAndParents();
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

  const handleAddStudent = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newStudentNamaLengkap || !newStudentUsername || !newStudentEmail || !newStudentPassword || !newStudentNISN || !newStudentNomorInduk || !newStudentJenisKelamin || !newStudentTanggalLahir || !newStudentKelas || !newStudentProgramStudi) {
        toast({ title: "Input Tidak Lengkap", description: "Mohon isi semua field yang wajib.", variant: "destructive" });
        return;
    }
    if (newStudentNISN.length !== 10 || !/^\d+$/.test(newStudentNISN)) {
        toast({ title: "Format NISN Salah", description: "NISN harus 10 digit angka.", variant: "destructive" });
        return;
    }

    addStudent({
        Nama_Lengkap: newStudentNamaLengkap,
        Username: newStudentUsername,
        Email: newStudentEmail,
        Password_Hash: newStudentPassword,
        NISN: newStudentNISN,
        Nomor_Induk: newStudentNomorInduk,
        Jenis_Kelamin: newStudentJenisKelamin,
        Tanggal_Lahir: newStudentTanggalLahir,
        Kelas: newStudentKelas,
        Program_Studi: newStudentProgramStudi,
        Alamat: "", 
        Nomor_Telepon: "", 
        ID_OrangTua_Terkait: newStudentParentId === "_NO_PARENT_" ? undefined : newStudentParentId,
    });

    toast({ title: "Siswa Ditambahkan", description: `Siswa "${newStudentNamaLengkap}" berhasil ditambahkan.` });
    fetchStudentsAndParents();
    setIsAddStudentDialogOpen(false);
    // Reset form fields
    setNewStudentNamaLengkap("");
    setNewStudentUsername("");
    setNewStudentEmail("");
    setNewStudentPassword("");
    setNewStudentNISN("");
    setNewStudentNomorInduk("");
    setNewStudentJenisKelamin("");
    setNewStudentTanggalLahir("");
    setNewStudentKelas("");
    setNewStudentProgramStudi("");
    setNewStudentParentId(undefined);
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
      description: "Sedang mempersiapkan file CSV (dipisahkan titik koma)...",
    });
    const dataToExport = getStudents();
    const parentsData = getParents(); // Ambil data orang tua
    if (dataToExport.length === 0) {
      toast({
        title: "Ekspor Dibatalkan",
        description: "Tidak ada data siswa untuk diekspor.",
        variant: "destructive"
      });
      return;
    }

    const header = [
      "ID_Siswa", "NISN", "Nomor_Induk", "Username", "Nama_Lengkap",
      "Nama_Panggilan", "Jenis_Kelamin", "Tanggal_Lahir", "Alamat",
      "Email", "Nomor_Telepon", "Program_Studi", "Kelas",
      "ID_OrangTua_Terkait", "Nama_OrangTua_Terkait", // Kolom baru
      "Tanggal_Daftar", "Status_Aktif", "Profil_Foto_URL"
    ];

    const csvHeaderString = header.map(escapeCsvField).join(";") + "\r\n";

    const csvRows = dataToExport.map(student => {
        const parent = student.ID_OrangTua_Terkait ? parentsData.find(p => p.ID_OrangTua === student.ID_OrangTua_Terkait) : null;
        return [
          student.ID_Siswa,
          student.NISN,
          student.Nomor_Induk,
          student.Username,
          student.Nama_Lengkap,
          student.Nama_Panggilan || '',
          student.Jenis_Kelamin,
          student.Tanggal_Lahir ? format(parseISO(student.Tanggal_Lahir), 'yyyy-MM-dd', { locale: LocaleID }) : '',
          student.Alamat || '',
          student.Email,
          student.Nomor_Telepon || '',
          student.Program_Studi,
          student.Kelas,
          student.ID_OrangTua_Terkait || '',
          parent ? parent.Nama_Lengkap : '', // Nama orang tua
          student.Tanggal_Daftar ? format(parseISO(student.Tanggal_Daftar), 'yyyy-MM-dd', { locale: LocaleID }) : '',
          student.Status_Aktif ? "Aktif" : "Tidak Aktif",
          student.Profil_Foto || ''
        ].map(escapeCsvField).join(";");
      }
    ).join("\r\n");

    const csvString = "\uFEFF" + csvHeaderString + csvRows; 

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
      title: "Ekspor Berhasil (CSV)",
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
        description: `File "${file.name}" dipilih untuk impor data siswa. Memproses (simulasi)...`,
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

  const getParentName = (parentId?: string) => {
    if (!parentId) return '-';
    const parent = allParents.find(p => p.ID_OrangTua === parentId);
    return parent ? parent.Nama_Lengkap : 'Tidak Ditemukan';
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
        <h1 className="text-3xl font-bold">Kelola Data Siswa</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <CardTitle className="text-xl">Manajemen Data Siswa (CSV)</CardTitle>
          </div>
          <CardDescription>Impor dan ekspor data siswa menggunakan file CSV (dipisahkan titik koma untuk kompatibilitas Excel).</CardDescription>
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
          <p className="text-xs text-muted-foreground">Catatan: Fitur impor saat ini adalah simulasi. Ekspor menghasilkan file .csv yang dipisahkan titik koma.</p>
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
              <Dialog open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" /> Tambah Siswa Baru
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Tambah Siswa Baru</DialogTitle>
                    <DialogDescription>
                      Lengkapi semua field yang diperlukan untuk menambahkan siswa baru.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddStudent} className="space-y-3 py-2 max-h-[70vh] overflow-y-auto px-1">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                            <Label htmlFor="new-student-nama">Nama Lengkap</Label>
                            <Input id="new-student-nama" value={newStudentNamaLengkap} onChange={(e) => setNewStudentNamaLengkap(e.target.value)} placeholder="Nama lengkap siswa" required />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="new-student-username">Username</Label>
                            <Input id="new-student-username" value={newStudentUsername} onChange={(e) => setNewStudentUsername(e.target.value)} placeholder="Username unik" required />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="new-student-email">Email</Label>
                            <Input id="new-student-email" type="email" value={newStudentEmail} onChange={(e) => setNewStudentEmail(e.target.value)} placeholder="Email siswa" required />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="new-student-password">Password Awal</Label>
                            <Input id="new-student-password" type="password" value={newStudentPassword} onChange={(e) => setNewStudentPassword(e.target.value)} placeholder="Min. 6 karakter" required />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="new-student-nisn">NISN</Label>
                            <Input id="new-student-nisn" value={newStudentNISN} onChange={(e) => setNewStudentNISN(e.target.value)} placeholder="10 digit angka" required />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="new-student-no-induk">Nomor Induk</Label>
                            <Input id="new-student-no-induk" value={newStudentNomorInduk} onChange={(e) => setNewStudentNomorInduk(e.target.value)} placeholder="Nomor Induk Siswa" required />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="new-student-gender">Jenis Kelamin</Label>
                            <Select value={newStudentJenisKelamin} onValueChange={(value) => setNewStudentJenisKelamin(value as StudentData['Jenis_Kelamin'])} required>
                                <SelectTrigger id="new-student-gender"><SelectValue placeholder="Pilih Jenis Kelamin" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="new-student-dob">Tanggal Lahir</Label>
                            <Input id="new-student-dob" type="date" value={newStudentTanggalLahir} onChange={(e) => setNewStudentTanggalLahir(e.target.value)} required />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="new-student-kelas">Kelas</Label>
                            <Input id="new-student-kelas" value={newStudentKelas} onChange={(e) => setNewStudentKelas(e.target.value)} placeholder="cth. Kelas 10A IPA" required />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="new-student-jurusan">Jurusan</Label>
                            <Input id="new-student-jurusan" value={newStudentProgramStudi} onChange={(e) => setNewStudentProgramStudi(e.target.value)} placeholder="cth. IPA" required />
                        </div>
                         <div className="space-y-1 md:col-span-2">
                            <Label htmlFor="new-student-parent">Orang Tua Terkait (Opsional)</Label>
                             <Select value={newStudentParentId || "_NO_PARENT_"} onValueChange={(value) => setNewStudentParentId(value === "_NO_PARENT_" ? undefined : value)}>
                                <SelectTrigger id="new-student-parent">
                                    <SelectValue placeholder="Pilih Orang Tua" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="_NO_PARENT_">Tidak Ada</SelectItem>
                                    {allParents.map(parent => (
                                        <SelectItem key={parent.ID_OrangTua} value={parent.ID_OrangTua}>
                                            {parent.Nama_Lengkap} ({parent.Email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="pt-4">
                        <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
                        <Button type="submit">Simpan Siswa</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
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
                <TableHead>Email</TableHead>
                <TableHead>NISN</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Jurusan</TableHead>
                <TableHead>Orang Tua Terkait</TableHead> {/* Kolom Baru */}
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
                  <TableCell>{student.Email}</TableCell>
                  <TableCell>{student.NISN}</TableCell>
                  <TableCell>{student.Kelas}</TableCell>
                  <TableCell>{student.Program_Studi}</TableCell>
                  <TableCell>{getParentName(student.ID_OrangTua_Terkait)}</TableCell> {/* Tampilkan Nama Orang Tua */}
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
                  <TableCell colSpan={9} className="text-center text-muted-foreground">Belum ada data siswa. Silakan tambahkan siswa baru.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

