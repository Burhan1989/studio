
"use client";

import { useEffect, useState, useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit, Trash2, Users, KeyRound, Upload, Download } from "lucide-react";
import type { ParentData } from "@/lib/types";
import { getParents } from "@/lib/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminParentsPage() {
  const { toast } = useToast();
  const [parentsList, setParentsList] = useState<ParentData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setParentsList(getParents());
  }, []);

  const handleEditAction = (itemName: string) => {
    toast({
      title: `Edit ${itemName}`,
      description: `Membuka form edit untuk ${itemName}. Implementasi form akan dilakukan pada iterasi berikutnya.`,
    });
  };

    const handleActionPlaceholder = (action: string, item: string) => {
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas "${action} untuk ${item}" akan segera hadir.`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Memulai Ekspor Data Orang Tua",
      description: "Sedang mempersiapkan file Excel (TSV)...",
    });
    const dataToExport = getParents();
    if (dataToExport.length === 0) {
      toast({
        title: "Ekspor Dibatalkan",
        description: "Tidak ada data orang tua untuk diekspor.",
        variant: "destructive"
      });
      return;
    }
    const header = "ID_OrangTua\tNama_Lengkap\tUsername\tEmail\tNomor_Telepon\tStatus_Aktif\tAnak_Terkait_ID_Siswa\n";
    const tsvRows = dataToExport.map(parent => {
      const anakTerkaitTsv = parent.Anak_Terkait ? parent.Anak_Terkait.map(anak => anak.ID_Siswa).join('; ') : '';
      return [
        parent.ID_OrangTua,
        parent.Nama_Lengkap,
        parent.Username,
        parent.Email,
        parent.Nomor_Telepon || '',
        String(parent.Status_Aktif),
        anakTerkaitTsv
      ].map(field => String(field).replace(/\t|\n|\r/g, ' ')) // Ensure fields are strings and replace tabs/newlines
       .join("\t");
    }).join("\n");
    const tsvString = "\uFEFF" + header + tsvRows; // Add BOM

    const blob = new Blob([tsvString], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "data_orang_tua.xlsx");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Ekspor Berhasil",
      description: "Data orang tua telah berhasil diekspor sebagai data_orang_tua.xlsx (format TSV, buka dengan Excel).",
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
        description: `File "${file.name}" dipilih untuk impor data orang tua. Memproses (simulasi)...`,
      });
      setTimeout(() => {
        toast({
          title: "Impor Selesai (Simulasi)",
          description: `Impor data orang tua dari "${file.name}" telah selesai. Data tidak benar-benar diperbarui.`,
        });
      }, 2000);
    }
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelected}
        accept=".xlsx,.xls,.tsv,.csv"
      />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kelola Data Orang Tua</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <CardTitle className="text-xl">Manajemen Data Orang Tua (Excel/TSV)</CardTitle>
          </div>
          <CardDescription>Impor dan ekspor data orang tua menggunakan file Excel (format TSV).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={handleImportClick} variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" /> Import Data Orang Tua
            </Button>
            <Button onClick={handleExportData} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" /> Export Data Orang Tua (Excel - TSV)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Catatan: Fitur impor saat ini adalah simulasi. Ekspor menghasilkan file .xlsx dengan data TSV.</p>
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
                <TableHead>Foto</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nomor Telepon</TableHead>
                <TableHead>Anak Terkait (Nama)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parentsList.map((parent) => (
                <TableRow key={parent.ID_OrangTua}>
                  <TableCell>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={parent.Profil_Foto} alt={parent.Nama_Lengkap} />
                      <AvatarFallback>{parent.Nama_Lengkap.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
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
              {parentsList.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">Belum ada data orang tua.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
