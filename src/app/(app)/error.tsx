
"use client"; 

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center bg-background">
      <AlertTriangle className="w-16 h-16 mb-4 text-destructive" />
      <h2 className="mb-4 text-2xl font-semibold text-foreground">Ups, Terjadi Kesalahan!</h2>
      <p className="mb-6 text-muted-foreground">
        Kami menemukan masalah tak terduga. Silakan coba lagi.
      </p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Coba Lagi
      </Button>
    </div>
  );
}
