
import { mockLessons } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Clock, BarChart, ArrowRight } from 'lucide-react';

export default function LessonsListPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">Jelajahi Pelajaran Kami</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Selami berbagai topik yang dirancang untuk meningkatkan keahlian Anda.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockLessons.map((lesson) => (
          <Card key={lesson.id} className="flex flex-col overflow-hidden shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]">
            {lesson.videoUrl && (
               <div className="aspect-video overflow-hidden">
                <Image
                    src="https://placehold.co/400x225.png" // Using a generic placeholder for list view
                    alt={`Pratinjau untuk ${lesson.title}`}
                    width={400}
                    height={225}
                    className="object-cover w-full h-full"
                    data-ai-hint="lesson learning"
                />
               </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{lesson.title}</CardTitle>
              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {lesson.estimatedTime}
                </span>
                <span className="flex items-center gap-1">
                  <BarChart className="w-3 h-3 transform -scale-x-100" /> {lesson.difficulty}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {lesson.content.substring(0, 150).split('\n')[0]}...
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/lessons/${lesson.id}`}>
                  Mulai Pelajaran <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
