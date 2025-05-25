
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit, Trash2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { getTeachers } from "@/lib/mockData"; // Menggunakan getTeachers untuk data admin
import type { TeacherData } from "@/lib/types";

export default function AdminManageAdminsPage() {
  const { toast } = useToast();
  const [adminUsers, setAdminUsers] = useState<TeacherData[]>([]);

  useEffect(() => {
    // Filter mockTeachers untuk mendapatkan pengguna yang juga admin
    const teachers = getTeachers();
    setAdminUsers(teachers.filter(teacher => teacher.isAdmin));
  }, []);

  const handleActionPlaceholder = (action: string, itemName: string) => {
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas "${action} untuk ${itemName}" akan segera hadir.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Kelola Pengguna Admin</h1>
        </div>
        <Button asChild>
          <Link href="/admin/admins/add">
            <UserPlus className="w-4 h-4 mr-2" /> Tambah Admin Baru
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Daftar Pengguna Admin</CardTitle>
          <CardDescription>
            Lihat, tambah, edit, atau hapus data pengguna dengan hak akses admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Email (Username)</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.map((admin) => (
                <TableRow key={admin.ID_Guru}>
                  <TableCell>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={admin.Profil_Foto} alt={admin.Nama_Lengkap} />
                      <AvatarFallback>{admin.Nama_Lengkap.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{admin.Nama_Lengkap}</TableCell>
                  <TableCell>{admin.Email}</TableCell>
                  <TableCell>{admin.Jabatan || 'Admin'}</TableCell>
                  <TableCell>
                    <Badge variant={admin.Status_Aktif ? "default" : "destructive"}>
                      {admin.Status_Aktif ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleActionPlaceholder("Edit", admin.Nama_Lengkap)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleActionPlaceholder("Hapus", admin.Nama_Lengkap)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {adminUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Belum ada data pengguna admin.
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
