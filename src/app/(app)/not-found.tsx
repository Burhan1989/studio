
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center bg-background">
      <SearchX className="w-20 h-20 mb-6 text-primary" />
      <h1 className="mb-4 text-4xl font-bold text-foreground">Halaman Tidak Ditemukan</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.
      </p>
      <Button asChild>
        <Link href="/dashboard">Ke Dasbor</Link>
      </Button>
    </div>
  )
}
