
"use client";

import type { Lesson } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, BarChart, ChevronLeft, ChevronRight, FileQuestion } from 'lucide-react';

interface LessonContentDisplayProps {
  lesson: Lesson;
  prevLessonId?: string;
  nextLessonId?: string;
}

export default function LessonContentDisplay({ lesson, prevLessonId, nextLessonId }: LessonContentDisplayProps) {
  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">{lesson.title}</CardTitle>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {lesson.estimatedTime}
          </span>
          <span className="flex items-center gap-1">
            <BarChart className="w-4 h-4 transform -scale-x-100" /> {lesson.difficulty}
          </span>
        </div>
      </CardHeader>
      <CardContent className="prose prose-blue max-w-none dark:prose-invert">
        {lesson.videoUrl && (
          <div className="my-6 aspect-video">
            <Image
              src={lesson.videoUrl}
              alt={`Video for ${lesson.title}`}
              width={600}
              height={338}
              className="w-full rounded-lg shadow-md"
              data-ai-hint="lesson video"
            />
          </div>
        )}
        {/* Using dangerouslySetInnerHTML for simple HTML content from mock data. 
            For user-generated content, ensure proper sanitization. */}
        <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br />') }} />
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-4 pt-6 border-t md:flex-row md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row">
         {prevLessonId && (
            <Button variant="outline" asChild>
              <Link href={`/lessons/${prevLessonId}`}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous Lesson
              </Link>
            </Button>
          )}
          {nextLessonId && (
            <Button variant="outline" asChild>
              <Link href={`/lessons/${nextLessonId}`}>
                Next Lesson <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
        {lesson.quizId && (
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href={`/quizzes/${lesson.quizId}`}>
              <FileQuestion className="w-4 h-4 mr-2" /> Take Quiz
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
