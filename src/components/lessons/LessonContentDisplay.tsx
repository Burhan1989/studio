
"use client";

import type { Lesson } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, BarChart, ChevronLeft, ChevronRight, FileQuestion, MessageSquareText, Send } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';

interface LessonContentDisplayProps {
  lesson: Lesson;
  prevLessonId?: string;
  nextLessonId?: string;
}

interface MockComment {
  id: string;
  userName: string;
  avatarFallback: string;
  text: string;
  timestamp: string;
}

export default function LessonContentDisplay({ lesson, prevLessonId, nextLessonId }: LessonContentDisplayProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<MockComment[]>([]);

  // useEffect untuk mensimulasikan pemuatan komentar
  useEffect(() => {
    // Mensimulasikan pengambilan komentar
    const mockComments: MockComment[] = [
      { id: '1', userName: 'Budi S.', avatarFallback: 'BS', text: 'Materi yang sangat bermanfaat! Apakah ada contoh implementasi lebih lanjut untuk bagian X?', timestamp: '2 jam lalu' },
      { id: '2', userName: 'Citra W.', avatarFallback: 'CW', text: 'Penjelasannya mudah dipahami. Terima kasih!', timestamp: '1 jam lalu' },
    ];
    setComments(mockComments);
  }, [lesson.id]);

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const commentToAdd: MockComment = {
        id: String(Date.now()),
        userName: 'Pengguna Saat Ini', // Ganti dengan nama pengguna aktual
        avatarFallback: 'PS', // Ganti dengan fallback avatar pengguna aktual
        text: newComment,
        timestamp: 'Baru saja'
      };
      setComments(prevComments => [commentToAdd, ...prevComments]);
      setNewComment("");
      // Di aplikasi nyata, Anda akan mengirim ini ke backend
      console.log("Komentar dikirim:", commentToAdd);
    }
  };

  return (
    <>
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
                alt={`Video untuk ${lesson.title}`}
                width={600}
                height={338}
                className="w-full rounded-lg shadow-md"
                data-ai-hint="lesson video"
              />
            </div>
          )}
          {/* Menggunakan dangerouslySetInnerHTML untuk konten HTML sederhana dari data mock. 
              Untuk konten yang dibuat pengguna, pastikan sanitasi yang tepat. */}
          <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br />') }} />
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4 pt-6 border-t md:flex-row md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row">
           {prevLessonId && (
              <Button variant="outline" asChild>
                <Link href={`/lessons/${prevLessonId}`}>
                  <ChevronLeft className="w-4 h-4 mr-2" /> Pelajaran Sebelumnya
                </Link>
              </Button>
            )}
            {nextLessonId && (
              <Button variant="outline" asChild>
                <Link href={`/lessons/${nextLessonId}`}>
                  Pelajaran Berikutnya <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>
          {lesson.quizId && (
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href={`/quizzes/${lesson.quizId}`}>
                <FileQuestion className="w-4 h-4 mr-2" /> Ambil Kuis
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card className="w-full mt-8 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <MessageSquareText className="w-6 h-6 mr-3 text-primary" />
            Forum Diskusi Pelajaran
          </CardTitle>
          <CardDescription>Ada pertanyaan atau ingin berdiskusi tentang materi ini? Sampaikan di sini.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Textarea
                placeholder="Tulis komentar Anda..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2 min-h-[80px]"
              />
              <Button onClick={handleCommentSubmit} disabled={!newComment.trim()}>
                <Send className="w-4 h-4 mr-2" />
                Kirim Komentar
              </Button>
            </div>
            <Separator />
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="mt-1">
                      <AvatarImage src={`https://avatar.vercel.sh/${comment.userName}.png`} alt={comment.userName} />
                      <AvatarFallback>{comment.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 p-3 rounded-md bg-muted/50">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground">{comment.userName}</p>
                        <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                      </div>
                      <p className="mt-1 text-sm text-foreground/90">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-muted-foreground">Belum ada diskusi. Mulai diskusi baru!</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
