
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, Network, Upload, Download } from "lucide-react";
import type { MajorData } from "@/lib/types";
import { getMajors, addMajor, deleteMajorById } from "@/lib/mockData";
import Link from "next/link";
import { useState, useEffect, type FormEvent, useRef, type ChangeEvent } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

function escapeCsvField(field: any): string {
  const fieldStr = String(field === null || field === undefined ? '' : field);
  if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n') || fieldStr.includes('\r')) {
    const escapedStr = fieldStr.replace(/"/g, '""');
    return `"${escapedStr}"`;
  }
  return fieldStr;
}

export default function AdminMajorsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [majors, setMajors] = useState<MajorData[]>([]);
  const [isAddMajorDialogOpen, setIsAddMajorDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newMajorName, setNewMajorName] = useState("");
  const [newMajorDescription, setNewMajorDescription] = useState("");
  const [newMajorHead, setNewMajorHead] = useState("");

  useEffect(() => {
    setMajors(getMajors());
  }, []);

  const refreshMajors = () => {
    setMajors(getMajors());
    // router.refresh(); // router.refresh() bisa menyebabkan reload penuh, mungkin tidak diperlukan jika state dikelola dengan baik
  };

  const handleAddMajor = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMajorName.trim()) {
      toast({ title: "Nama Jurusan Diperlukan", description: "Mohon isi nama jurusan.", variant: "destructive" });
      return;
    }
    addMajor({
      Nama_Jurusan: newMajorName,
      Deskripsi_Jurusan: newMajorDescription,
      Nama_Kepala_Program: newMajorHead,
    });
    toast({ title: "Jurusan Ditambahkan", description: `Jurusan "${newMajorName}" telah berhasil ditambahkan.` });
    setNewMajorName("");
    setNewMajorDescription("");
    setNewMajorHead("");
    setIsAddMajorDialogOpen(false);
    refreshMajors();
  };

  const handleDeleteMajor = (majorId: string, majorName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus jurusan "${majorName}"? Tindakan ini tidak dapat diurungkan.`)) {
      const success = deleteMajorById(majorId);
      if (success) {
        toast({ title: "Jurusan Dihapus", description: `Jurusan "${majorName}" telah berhasil dihapus.` });
        refreshMajors();
      } else {
        toast({ title: "Gagal Menghapus", description: `Jurusan "${majorName}" tidak ditemukan.`, variant: "destructive" });
      }
    }
  };

  const handleExportData = () => {
    toast({
      title: "Memulai Ekspor Data Jurusan",
      description: "Sedang mempersiapkan file Excel (format CSV)...",
    });
    const dataToExport = getMajors();
    if (dataToExport.length === 0) {
      toast({
        title: "Ekspor Dibatalkan",
        description: "Tidak ada data jurusan untuk diekspor.",
        variant: "destructive"
      });
      return;
    }
    const header = [
        "ID_Jurusan", "Nama_Jurusan", "Deskripsi_Jurusan", "Nama_Kepala_Program"
    ].map(escapeCsvField).join(",") + "\n";

    const csvRows = dataToExport.map(major =>
      [
        major.ID_Jurusan,
        major.Nama_Jurusan,
        major.Deskripsi_Jurusan || '',
        major.Nama_Kepala_Program || ''
      ].map(escapeCsvField).join(",")
    ).join("\n");

    const csvString = "\uFEFF" + header + csvRows; // Add BOM

    const blob = new Blob([csvString], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "data_jurusan.xlsx");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Ekspor Berhasil",
      description: "Data jurusan telah berhasil diekspor sebagai data_jurusan.xlsx (format CSV).",
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
        description: `File "${file.name}" dipilih untuk impor data jurusan. Memproses (simulasi)...`,
      });
      setTimeout(() => {
        toast({
          title: "Impor Selesai (Simulasi)",
          description: `Impor data jurusan dari "${file.name}" telah selesai. Data tidak benar-benar diperbarui.`,
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
        accept=".csv,.xlsx,.xls"
      />
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
            <CardTitle className="text-xl">Manajemen Data Jurusan (Excel/CSV)</CardTitle>
          </div>
          <CardDescription>Impor dan ekspor data jurusan menggunakan file Excel atau format CSV.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={handleImportClick} variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" /> Impor Data Jurusan
            </Button>
            <Button onClick={handleExportData} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" /> Ekspor Data Jurusan (Excel - Format CSV)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Catatan: Fitur impor saat ini adalah simulasi. Ekspor menghasilkan file .xlsx dengan data CSV.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Daftar Jurusan</CardTitle>
            <Dialog open={isAddMajorDialogOpen} onOpenChange={setIsAddMajorDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="w-4 h-4 mr-2" /> Tambah Jurusan Baru
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Tambah Jurusan Baru</DialogTitle>
                  <DialogDescription>
                    Masukkan detail untuk jurusan baru. Klik simpan jika selesai.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddMajor} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="new-major-name">Nama Jurusan</Label>
                    <Input
                      id="new-major-name"
                      value={newMajorName}
                      onChange={(e) => setNewMajorName(e.target.value)}
                      placeholder="cth. Ilmu Pengetahuan Alam"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-major-description">Deskripsi Jurusan (Opsional)</Label>
                    <Textarea
                      id="new-major-description"
                      value={newMajorDescription}
                      onChange={(e) => setNewMajorDescription(e.target.value)}
                      placeholder="Deskripsi singkat mengenai jurusan..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-major-head">Nama Kepala Program (Opsional)</Label>
                    <Input
                      id="new-major-head"
                      value={newMajorHead}
                      onChange={(e) => setNewMajorHead(e.target.value)}
                      placeholder="cth. Dr. Annisa Fitri, M.Si."
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                       <Button type="button" variant="outline">Batal</Button>
                    </DialogClose>
                    <Button type="submit">Simpan Jurusan</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>Kelola semua jurusan yang tersedia di platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Jurusan</TableHead>
                <TableHead>Nama Jurusan</TableHead>
                <TableHead>Kepala Program</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {majors.map((major) => (
                <TableRow key={major.ID_Jurusan}>
                  <TableCell>{major.ID_Jurusan}</TableCell>
                  <TableCell className="font-medium">{major.Nama_Jurusan}</TableCell>
                  <TableCell>{major.Nama_Kepala_Program || '-'}</TableCell>
                  <TableCell>{major.Deskripsi_Jurusan || '-'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/majors/${major.ID_Jurusan}/edit`}>
                        <Edit className="w-4 h-4" /> Edit
                      </Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteMajor(major.ID_Jurusan, major.Nama_Jurusan)}>
                      <Trash2 className="w-4 h-4" /> Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {majors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
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

    