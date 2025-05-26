
"use client";

import { useEffect, useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit, Trash2, Users, KeyRound, Upload, Download } from "lucide-react";
import type { ParentData } from "@/lib/types";
import { getParents, addParent, deleteParentById } from "@/lib/mockData"; // Updated imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function escapeExcelField(field: any): string {
  const fieldStr = String(field === null || field === undefined ? '' : field);
  // Ganti karakter tab atau baris baru dengan spasi untuk TSV
  return fieldStr.replace(/\t|\n|\r/g, ' ');
}

export default function AdminParentsPage() {
  const { toast } = useToast();
  const [parentsList, setParentsList] = useState<ParentData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAddParentDialogOpen, setIsAddParentDialogOpen] = useState(false);
  const [parentToDelete, setParentToDelete] = useState<ParentData | null>(null);

  // State untuk form tambah orang tua
  const [newParentNamaLengkap, setNewParentNamaLengkap] = useState("");
  const [newParentUsername, setNewParentUsername] = useState("");
  const [newParentEmail, setNewParentEmail] = useState("");
  const [newParentPassword, setNewParentPassword] = useState("");
  const [newParentNomorTelepon, setNewParentNomorTelepon] = useState("");

  const fetchParents = () => {
    setParentsList(getParents());
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const handleAddParent = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newParentNamaLengkap || !newParentUsername || !newParentEmail || !newParentPassword) {
      toast({ title: "Input Tidak Lengkap", description: "Nama, Username, Email, dan Password harus diisi.", variant: "destructive" });
      return;
    }
    addParent({
      Nama_Lengkap: newParentNamaLengkap,
      Username: newParentUsername,
      Email: newParentEmail,
      Password_Hash: newParentPassword, // Di aplikasi nyata, ini akan di-hash
      Nomor_Telepon: newParentNomorTelepon,
    });
    toast({ title: "Orang Tua Ditambahkan", description: `Pengguna orang tua "${newParentNamaLengkap}" telah berhasil ditambahkan.` });
    fetchParents();
    setIsAddParentDialogOpen(false);
    // Reset form fields
    setNewParentNamaLengkap("");
    setNewParentUsername("");
    setNewParentEmail("");
    setNewParentPassword("");
    setNewParentNomorTelepon("");
  };

  const handleDeleteParent = () => {
    if (parentToDelete) {
      const success = deleteParentById(parentToDelete.ID_OrangTua);
      if (success) {
        toast({
          title: "Orang Tua Dihapus",
          description: `Data orang tua "${parentToDelete.Nama_Lengkap}" telah berhasil dihapus.`,
        });
        fetchParents();
      } else {
        toast({
          title: "Gagal Menghapus",
          description: `Data orang tua "${parentToDelete.Nama_Lengkap}" tidak ditemukan.`,
          variant: "destructive",
        });
      }
      setParentToDelete(null);
    }
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
      description: "Sedang mempersiapkan file Excel (format TSV)...",
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
    const header = [
        "ID_OrangTua", "Nama_Lengkap", "Username", "Email",
        "Nomor_Telepon", "Status_Aktif", "Anak_Terkait_ID_Siswa", "Profil_Foto"
    ];
    
    const tsvHeaderString = header.map(escapeExcelField).join("\t") + "\r\n";

    const tsvRows = dataToExport.map(parent => {
      const anakTerkaitTsv = parent.Anak_Terkait ? parent.Anak_Terkait.map(anak => anak.ID_Siswa).join('; ') : '';
      return [
        parent.ID_OrangTua,
        parent.Nama_Lengkap,
        parent.Username,
        parent.Email,
        parent.Nomor_Telepon || '',
        parent.Status_Aktif ? "Aktif" : "Tidak Aktif",
        anakTerkaitTsv,
        parent.Profil_Foto || ''
      ].map(escapeExcelField).join("\t");
    }).join("\r\n");

    const tsvString = "\uFEFF" + tsvHeaderString + tsvRows; // Add BOM

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
      title: "Ekspor Berhasil (Excel - format TSV)",
      description: "Data orang tua telah berhasil diekspor sebagai data_orang_tua.xlsx.",
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
        accept=".csv,.xlsx,.xls,.tsv"
      />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kelola Data Orang Tua</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <CardTitle className="text-xl">Manajemen Data Orang Tua (Excel - Format TSV)</CardTitle>
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
          <p className="text-xs text-muted-foreground">Catatan: Fitur impor saat ini adalah simulasi. Ekspor menghasilkan file .xlsx berisi TSV.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">Daftar Orang Tua</CardTitle>
            </div>
            <Dialog open={isAddParentDialogOpen} onOpenChange={setIsAddParentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" /> Tambah Orang Tua Baru
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Tambah Orang Tua Baru</DialogTitle>
                  <DialogDescription>
                    Lengkapi detail untuk orang tua baru.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddParent} className="space-y-4 py-2">
                  <div className="grid gap-2">
                    <Label htmlFor="new-parent-nama">Nama Lengkap</Label>
                    <Input id="new-parent-nama" value={newParentNamaLengkap} onChange={(e) => setNewParentNamaLengkap(e.target.value)} placeholder="Nama lengkap orang tua" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-parent-username">Username</Label>
                    <Input id="new-parent-username" value={newParentUsername} onChange={(e) => setNewParentUsername(e.target.value)} placeholder="Username unik" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-parent-email">Email</Label>
                    <Input id="new-parent-email" type="email" value={newParentEmail} onChange={(e) => setNewParentEmail(e.target.value)} placeholder="Email orang tua" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-parent-password">Password Awal</Label>
                    <Input id="new-parent-password" type="password" value={newParentPassword} onChange={(e) => setNewParentPassword(e.target.value)} placeholder="Min. 6 karakter" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-parent-telepon">Nomor Telepon (Opsional)</Label>
                    <Input id="new-parent-telepon" type="tel" value={newParentNomorTelepon} onChange={(e) => setNewParentNomorTelepon(e.target.value)} placeholder="Nomor telepon" />
                  </div>
                  <DialogFooter className="pt-4">
                    <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
                    <Button type="submit">Simpan Orang Tua</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/parents/${parent.ID_OrangTua}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => setParentToDelete(parent)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus data orang tua "{parentToDelete?.Nama_Lengkap}"? Tindakan ini tidak dapat diurungkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setParentToDelete(null)}>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteParent}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

    