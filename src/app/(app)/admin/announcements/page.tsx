
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash2, Megaphone } from "lucide-react";
import Link from "next/link";
import { getAnnouncements, deleteAnnouncement, getClasses } from "@/lib/mockData";
import type { AnnouncementData, ClassData } from "@/lib/types";
import { format, parseISO } from 'date-fns';
import { id as LocaleID } from 'date-fns/locale';
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

export default function AdminAnnouncementsPage() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [classesMap, setClassesMap] = useState<Record<string, string>>({});
  const [announcementToDelete, setAnnouncementToDelete] = useState<AnnouncementData | null>(null);

  const fetchAnnouncementsAndClasses = () => {
    const classData = getClasses();
    const newClassesMap: Record<string, string> = {};
    classData.forEach(cls => {
      newClassesMap[cls.ID_Kelas] = `${cls.Nama_Kelas} (${cls.jurusan})`;
    });
    setClassesMap(newClassesMap);
    setAnnouncements(getAnnouncements().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  useEffect(() => {
    fetchAnnouncementsAndClasses();
  }, []);

  const handleDeleteAnnouncement = () => {
    if (announcementToDelete) {
      const success = deleteAnnouncement(announcementToDelete.id);
      if (success) {
        toast({
          title: "Pengumuman Dihapus",
          description: `Pengumuman "${announcementToDelete.title}" telah berhasil dihapus.`,
        });
        fetchAnnouncementsAndClasses();
      } else {
        toast({
          title: "Gagal Menghapus",
          description: `Pengumuman "${announcementToDelete.title}" tidak ditemukan atau gagal dihapus.`,
          variant: "destructive",
        });
      }
      setAnnouncementToDelete(null);
    }
  };

  const getTargetAudienceDisplay = (ann: AnnouncementData) => {
    switch (ann.targetAudience) {
      case 'all_teachers':
        return 'Semua Guru';
      case 'all_students':
        return 'Semua Siswa';
      case 'specific_class':
        return ann.targetClassId ? classesMap[ann.targetClassId] || ann.targetClassId : 'Kelas Tertentu (Tidak Spesifik)';
      default:
        return 'Tidak Diketahui';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Megaphone className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Manajemen Pengumuman</h1>
        </div>
        <Button asChild>
          <Link href="/admin/announcements/new">
            <PlusCircle className="w-4 h-4 mr-2" /> Buat Pengumuman Baru
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Daftar Pengumuman</CardTitle>
          <CardDescription>Kelola semua pengumuman yang dikirim ke pengguna.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Target Audiens</TableHead>
                <TableHead>Isi (Singkat)</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((ann) => (
                <TableRow key={ann.id}>
                  <TableCell className="font-medium">{ann.title}</TableCell>
                  <TableCell>{getTargetAudienceDisplay(ann)}</TableCell>
                  <TableCell className="max-w-xs truncate">{ann.content}</TableCell>
                  <TableCell>{format(parseISO(ann.createdAt), 'dd MMM yyyy, HH:mm', { locale: LocaleID })}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => setAnnouncementToDelete(ann)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus pengumuman "{announcementToDelete?.title}"? Tindakan ini tidak dapat diurungkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setAnnouncementToDelete(null)}>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAnnouncement}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
              {announcements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Belum ada pengumuman.
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
