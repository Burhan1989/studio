
import QuizView from '@/components/quizzes/QuizView';
import { getQuizById } from '@/lib/mockData';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic'; // Menjadikan halaman ini sepenuhnya dinamis

// export async function generateStaticParams() {
//   // If you have many quizzes, consider fetching them dynamically
//   // For now, using mockQuizzes directly if it's small.
//   const { mockQuizzes } = await import('@/lib/mockData');
//   return mockQuizzes.map((quiz) => ({
//     quizId: quiz.id,
//   }));
// }

export default async function QuizPage({ params }: { params: { quizId: string } }) {
  const quiz = getQuizById(params.quizId);

  if (!quiz) {
    notFound();
  }

  return (
    <div>
      <QuizView quiz={quiz} />
    </div>
  );
}
