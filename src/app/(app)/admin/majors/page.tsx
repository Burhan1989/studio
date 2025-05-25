
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, Network, Upload, Download } from "lucide-react";
import type { MajorData } from "@/lib/types";
import { mockMajors } from "@/lib/mockData"; // Import mockMajors

export default function AdminMajorsPage() {
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

  const handleExcelAction = (actionType: "Import" | "Export") => {
    let actionDescription = actionType === "Import" ? "Impor" : "Ekspor";
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas "${actionDescription} Data Jurusan dari file Excel" akan segera hadir. Ini adalah placeholder dan memerlukan implementasi backend.`,
      variant: "default",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Network className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold">Manajemen Jurusan</h1>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Network className="w-8 h-8 text-primary" />
            <CardTitle className="text-xl">Manajemen Data Jurusan (Excel)</CardTitle>
          </div>
          <CardDescription>Impor dan ekspor data jurusan menggunakan file Excel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => handleExcelAction("Import")} variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" /> Impor Data Jurusan
            </Button>
            <Button onClick={() => handleExcelAction("Export")} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" /> Ekspor Data Jurusan
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Catatan: Fitur impor/ekspor Excel saat ini adalah placeholder UI. Implementasi backend diperlukan.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Daftar Jurusan</CardTitle>
            <Button onClick={() => handleActionPlaceholder("Tambah", "Jurusan Baru")}>
              <PlusCircle className="w-4 h-4 mr-2" /> Tambah Jurusan Baru
            </Button>
          </div>
          <CardDescription>Kelola semua jurusan yang tersedia di platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Jurusan</TableHead>
                <TableHead>Nama Jurusan</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMajors.map((major) => (
                <TableRow key={major.ID_Jurusan}>
                  <TableCell>{major.ID_Jurusan}</TableCell>
                  <TableCell className="font-medium">{major.Nama_Jurusan}</TableCell>
                  <TableCell>{major.Deskripsi_Jurusan || '-'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditAction(`Jurusan ${major.Nama_Jurusan}`)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleActionPlaceholder("Hapus", `Jurusan ${major.Nama_Jurusan}`)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {mockMajors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Belum ada data jurusan.
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
