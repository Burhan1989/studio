"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit, Trash2, Users, UserCog } from "lucide-react";

// Mock Data (Sementara)
const mockTeachers = [
  { id: "guru1", name: "Dr. Budi Darmawan", email: "budi.d@example.com", subject: "Matematika Lanjut", classes: ["Kelas 11A", "Kelas 12B"] },
  { id: "guru2", name: "Siti Nurhaliza, M.Pd.", email: "siti.n@example.com", subject: "Bahasa Indonesia", classes: ["Kelas 10A", "Kelas 10C"] },
  { id: "guru3", name: "Prof. Agus Salim", email: "agus.s@example.com", subject: "Fisika Dasar", classes: ["Kelas 11B"] },
];

const mockStudents = [
  { id: "siswa1", name: "Ahmad Zaini", email: "ahmad.z@example.com", studentId: "S1001", class: "Kelas 10A" },
  { id: "siswa2", name: "Rina Amelia", email: "rina.a@example.com", studentId: "S1002", class: "Kelas 11B" },
  { id: "siswa3", name: "Kevin Sanjaya", email: "kevin.s@example.com", studentId: "S1003", class: "Kelas 12C" },
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
                <TableHead>Email</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Kelas Diajar</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>{teacher.classes.join(", ")}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleActionPlaceholder("Edit", `Guru ${teacher.name}`)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleActionPlaceholder("Hapus", `Guru ${teacher.name}`)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {mockTeachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">Belum ada data guru.</TableCell>
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
                <TableHead>Email</TableHead>
                <TableHead>NIM/NIS</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleActionPlaceholder("Edit", `Siswa ${student.name}`)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleActionPlaceholder("Hapus", `Siswa ${student.name}`)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {mockStudents.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">Belum ada data siswa.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
