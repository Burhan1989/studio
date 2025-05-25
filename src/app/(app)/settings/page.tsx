
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react'; // Renamed to avoid conflict if Settings component is used

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <SettingsIcon className="w-12 h-12 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Pengaturan Aplikasi</h1>
          <p className="text-muted-foreground">
            Sesuaikan preferensi aplikasi dan notifikasi Anda di sini.
          </p>
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Preferensi Umum</CardTitle>
          <CardDescription>Atur preferensi umum aplikasi.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Opsi pengaturan umum akan segera hadir...</p>
          {/* Placeholder for general settings like language, theme, etc. */}
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Notifikasi</CardTitle>
          <CardDescription>Kelola preferensi notifikasi Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Pengaturan notifikasi akan segera hadir...</p>
          {/* Placeholder for notification settings */}
        </CardContent>
      </Card>
    </div>
  );
}
