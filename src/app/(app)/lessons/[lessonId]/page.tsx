
// This should be a server component to fetch data
import LessonContentDisplay from '@/components/lessons/LessonContentDisplay';
import { getLessonById, getLessons as getAllLessons } from '@/lib/mockData'; // Changed to getLessons
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown } from 'lucide-react';
import { notFound } from 'next/navigation';

// Generate static paths for lessons if desired for performance
// export async function generateStaticParams() {
//   const lessons = getAllLessons(); // Use getAllLessons
//   return lessons.map((lesson) => ({
//     lessonId: lesson.id,
//   }));
// }
export const dynamic = 'force-dynamic'; // Ensure it re-fetches on navigation

export default async function LessonPage({ params }: { params: { lessonId: string } }) {
  const lesson = getLessonById(params.lessonId);
  const allLessons = getAllLessons(); // Get all lessons for next/prev logic

  if (!lesson) {
    notFound(); // Triggers the not-found.tsx or default Next.js 404 page
  }

  // Find previous and next lesson IDs
  const currentIndex = allLessons.findIndex(l => l.id === params.lessonId);
  const prevLessonId = currentIndex > 0 ? allLessons[currentIndex - 1].id : undefined;
  const nextLessonId = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1].id : undefined;
  
  return (
    <div className="max-w-4xl mx-auto">
      <LessonContentDisplay lesson={lesson} prevLessonId={prevLessonId} nextLessonId={nextLessonId} />
    </div>
  );
}

    