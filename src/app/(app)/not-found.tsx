
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center bg-background">
      <SearchX className="w-20 h-20 mb-6 text-primary" />
      <h1 className="mb-4 text-4xl font-bold text-foreground">Page Not Found</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Sorry, the page you are looking for does not exist or may have been moved.
      </p>
      <Button asChild>
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  )
}
