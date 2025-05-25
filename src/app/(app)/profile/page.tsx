
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <UserCircle className="w-12 h-12 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Profil Pengguna</h1>
          <p className="text-muted-foreground">
            Kelola informasi pribadi Anda dan lacak kemajuan pembelajaran Anda di sini.
          </p>
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Informasi Akun</CardTitle>
          <CardDescription>Detail akun Anda akan ditampilkan di sini.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Konten profil pengguna akan segera hadir...</p>
          {/* Placeholder for user details, preferences, etc. */}
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Kemajuan Pembelajaran</CardTitle>
          <CardDescription>Ringkasan pencapaian dan kursus yang diikuti.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Data kemajuan akan ditampilkan di sini...</p>
          {/* Placeholder for progress tracking */}
        </CardContent>
      </Card>
    </div>
  );
}
