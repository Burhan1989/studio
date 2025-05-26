"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { getClasses, getStudents } from '@/lib/mockData';
import type { ClassData, StudentData } from '@/lib/types';
import { Contact } from 'lucide-react';

export default function AdminClassContactsPage() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);

  useEffect(() => {
    setClasses(getClasses());
    setStudents(getStudents());
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      const selectedClass = classes.find(c => c.ID_Kelas === selectedClassId);
      if (selectedClass) {
        // Filter students based on selected class name and major
        const studentsInClass = students.filter(
          (student) => student.Kelas === selectedClass.Nama_Kelas && student.Program_Studi === selectedClass.jurusan
        );
        setFilteredStudents(studentsInClass);
      } else {
        setFilteredStudents([]);
      }
    } else {
      setFilteredStudents([]);
    }
  }, [selectedClassId, classes, students]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Contact className="w-10 h-10 text-primary" />
        <h1 className="text-3xl font-bold">Kontak Siswa per Kelas</h1>
      </div>
      <CardDescription>
        Pilih kelas untuk melihat daftar kontak siswa di kelas tersebut.
      </CardDescription>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Pilih Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm">
            <Label htmlFor="select-class">Kelas</Label>
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger id="select-class">
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.ID_Kelas} value={cls.ID_Kelas}>
                    {cls.Nama_Kelas} - {cls.jurusan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedClassId && (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle>Daftar Kontak Siswa</CardTitle>
            <CardDescription>
              Menampilkan siswa untuk kelas yang dipilih.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStudents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Nomor Telepon</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.ID_Siswa}>
                      <TableCell className="font-medium">{student.Nama_Lengkap}</TableCell>
                      <TableCell>{student.Nomor_Telepon || '-'}</TableCell>
                      <TableCell>{student.Email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground">
                Tidak ada siswa di kelas ini atau kelas belum dipilih.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
