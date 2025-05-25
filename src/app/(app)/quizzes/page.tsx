
import { mockQuizzes, getLessonById } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileQuestion, BookText, ArrowRight } from 'lucide-react';

export default function QuizzesListPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">Uji Pengetahuan Anda</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Tantang diri Anda dengan kuis kami dan perkuat pemahaman Anda.
        </p>
      </div>

      {mockQuizzes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockQuizzes.map((quiz) => {
            const relatedLesson = quiz.lessonId ? getLessonById(quiz.lessonId) : null;
            return (
              <Card key={quiz.id} className="flex flex-col overflow-hidden shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]">
                <CardHeader>
                  <div className="p-3 mb-3 rounded-full bg-primary/10 text-primary w-fit">
                    <FileQuestion className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  {relatedLesson && (
                     <CardDescription className="flex items-center gap-1 text-sm">
                        <BookText className="w-4 h-4"/> Terkait dengan: {relatedLesson.title}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">
                    Berisi {quiz.questions.length} pertanyaan untuk menguji pemahaman Anda. Siap untuk memulai?
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/quizzes/${quiz.id}`}>
                      Ambil Kuis <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">Tidak ada kuis yang tersedia saat ini. Periksa kembali nanti!</p>
      )}
    </div>
  );
}
