
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { School, Edit, PlusCircle, Trash2 } from "lucide-react"; 
import Link from "next/link";
import { getClasses, addClass, deleteClassById, getTeachers } from "@/lib/mockData";
import type { ClassData, TeacherData } from '@/lib/types';
import { useEffect, useState, type FormEvent } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, // Added AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export default function AdminClassesPage() {
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<ClassData | null>(null);

  const [newClassName, setNewClassName] = useState("");
  const [newClassTeacherId, setNewClassTeacherId] = useState("");
  const [newClassJurusan, setNewClassJurusan] = useState("");
  const [newClassJumlahSiswa, setNewClassJumlahSiswa] = useState<number | undefined>(undefined);

  const fetchClassesAndTeachers = () => {
    setClasses(getClasses());
    setTeachers(getTeachers().filter(t => !t.isAdmin)); // Hanya guru non-admin
  };

  useEffect(() => {
    fetchClassesAndTeachers();
  }, []);

  const handleAddClass = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newClassName.trim() || !newClassTeacherId || !newClassJurusan.trim()) {
      toast({ title: "Input Tidak Lengkap", description: "Nama Kelas, Wali Kelas, dan Jurusan harus diisi.", variant: "destructive" });
      return;
    }
    addClass({
      Nama_Kelas: newClassName,
      ID_Guru: newClassTeacherId,
      jurusan: newClassJurusan,
      jumlahSiswa: newClassJumlahSiswa,
    });
    toast({ title: "Kelas Ditambahkan", description: `Kelas "${newClassName}" telah berhasil ditambahkan.` });
    setNewClassName("");
    setNewClassTeacherId("");
    setNewClassJurusan("");
    setNewClassJumlahSiswa(undefined);
    setIsAddClassDialogOpen(false);
    fetchClassesAndTeachers();
  };

  const handleDeleteClass = () => {
    if (classToDelete) {
      const success = deleteClassById(classToDelete.ID_Kelas);
      if (success) {
        toast({ title: "Kelas Dihapus", description: `Kelas "${classToDelete.Nama_Kelas}" telah berhasil dihapus.` });
        fetchClassesAndTeachers();
      } else {
        toast({ title: "Gagal Menghapus", description: `Kelas "${classToDelete.Nama_Kelas}" tidak ditemukan.`, variant: "destructive" });
      }
      setClassToDelete(null);
    }
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.ID_Guru === teacherId);
    return teacher ? teacher.Nama_Lengkap : teacherId;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <School className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Manajemen Kelas & Wali Kelas</h1>
        </div>
        <Dialog open={isAddClassDialogOpen} onOpenChange={setIsAddClassDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" /> Tambah Kelas Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Kelas Baru</DialogTitle>
              <DialogDescription>
                Lengkapi detail untuk kelas baru. Klik simpan jika selesai.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddClass} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="new-class-name">Nama Kelas</Label>
                <Input
                  id="new-class-name"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="cth. Kelas 10A"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-class-teacher">Wali Kelas</Label>
                <Select value={newClassTeacherId} onValueChange={setNewClassTeacherId} required>
                  <SelectTrigger id="new-class-teacher">
                    <SelectValue placeholder="Pilih Wali Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map(teacher => (
                      <SelectItem key={teacher.ID_Guru} value={teacher.ID_Guru}>
                        {teacher.Nama_Lengkap}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-class-jurusan">Jurusan</Label>
                <Input
                  id="new-class-jurusan"
                  value={newClassJurusan}
                  onChange={(e) => setNewClassJurusan(e.target.value)}
                  placeholder="cth. IPA, IPS, Bahasa"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-class-jumlah-siswa">Jumlah Siswa (Opsional)</Label>
                <Input
                  id="new-class-jumlah-siswa"
                  type="number"
                  value={newClassJumlahSiswa === undefined ? '' : newClassJumlahSiswa}
                  onChange={(e) => setNewClassJumlahSiswa(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}
                  placeholder="cth. 30"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                   <Button type="button" variant="outline">Batal</Button>
                </DialogClose>
                <Button type="submit">Simpan Kelas</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                <TableHead>Wali Kelas</TableHead>
                <TableHead>Jumlah Siswa</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((kelas) => (
                <TableRow key={kelas.ID_Kelas}>
                  <TableCell>{kelas.Nama_Kelas}</TableCell>
                  <TableCell>{kelas.jurusan || '-'}</TableCell>
                  <TableCell>{getTeacherName(kelas.ID_Guru)}</TableCell>
                  <TableCell>{kelas.jumlahSiswa === undefined ? '-' : kelas.jumlahSiswa}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/classes/${kelas.ID_Kelas}/edit`}>
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => setClassToDelete(kelas)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus kelas "{classToDelete?.Nama_Kelas}"? Tindakan ini tidak dapat diurungkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setClassToDelete(null)}>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteClass}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
              {classes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Belum ada data kelas. Silakan tambahkan kelas baru.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

