
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit, Trash2, Users, KeyRound, Upload, Download } from "lucide-react";
import type { ParentData } from "@/lib/types";
import { mockParents } from "@/lib/mockData"; // Import mockParents

export default function AdminParentsPage() {
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kelola Data Orang Tua</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <CardTitle className="text-xl">Manajemen Data Orang Tua (Excel)</CardTitle>
          </div>
          <CardDescription>Import dan export data orang tua menggunakan file Excel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => handleExcelAction("Import", "Data Orang Tua")} variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" /> Import Data Orang Tua
            </Button>
            <Button onClick={() => handleExcelAction("Export", "Data Orang Tua")} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" /> Export Data Orang Tua
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Catatan: Fitur import/export Excel saat ini adalah placeholder UI. Implementasi backend diperlukan.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">Daftar Orang Tua</CardTitle>
            </div>
            <Button onClick={() => handleActionPlaceholder("Tambah", "Orang Tua Baru")}>
              <UserPlus className="w-4 h-4 mr-2" /> Tambah Orang Tua Baru
            </Button>
          </div>
          <CardDescription>Lihat, tambah, edit, atau hapus data orang tua dalam sistem.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nomor Telepon</TableHead>
                <TableHead>Anak Terkait (Contoh)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockParents.map((parent) => (
                <TableRow key={parent.ID_OrangTua}>
                  <TableCell className="font-medium">{parent.Nama_Lengkap}</TableCell>
                  <TableCell>{parent.Username}</TableCell>
                  <TableCell>{parent.Email}</TableCell>
                  <TableCell>{parent.Nomor_Telepon || '-'}</TableCell>
                  <TableCell>
                    {parent.Anak_Terkait && parent.Anak_Terkait.length > 0 
                      ? parent.Anak_Terkait.map(anak => anak.Nama_Siswa).join(', ') 
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={parent.Status_Aktif ? "default" : "destructive"}>
                      {parent.Status_Aktif ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditAction(`Orang Tua ${parent.Nama_Lengkap}`)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleActionPlaceholder("Hapus", `Orang Tua ${parent.Nama_Lengkap}`)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleActionPlaceholder("Reset Akun", `Orang Tua ${parent.Nama_Lengkap}`)}>
                      <KeyRound className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {mockParents.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">Belum ada data orang tua.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
