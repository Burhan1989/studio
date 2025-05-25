
// This should be a server component to fetch data
import LessonContentDisplay from '@/components/lessons/LessonContentDisplay';
import { getLessonById, mockLessons } from '@/lib/mockData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown } from 'lucide-react';
import { notFound } from 'next/navigation';

// Generate static paths for lessons if desired for performance
// export async function generateStaticParams() {
//   return mockLessons.map((lesson) => ({
//     lessonId: lesson.id,
//   }));
// }

export default async function LessonPage({ params }: { params: { lessonId: string } }) {
  const lesson = getLessonById(params.lessonId);

  if (!lesson) {
    notFound(); // Triggers the not-found.tsx or default Next.js 404 page
  }

  // Find previous and next lesson IDs
  const currentIndex = mockLessons.findIndex(l => l.id === params.lessonId);
  const prevLessonId = currentIndex > 0 ? mockLessons[currentIndex - 1].id : undefined;
  const nextLessonId = currentIndex < mockLessons.length - 1 ? mockLessons[currentIndex + 1].id : undefined;
  
  return (
    <div className="max-w-4xl mx-auto">
      <LessonContentDisplay lesson={lesson} prevLessonId={prevLessonId} nextLessonId={nextLessonId} />
    </div>
  );
}
