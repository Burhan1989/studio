
"use client";

import type { Quiz, Question } from '@/lib/types';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { submitQuizAction, type QuizSubmissionState } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, Send } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface QuizViewProps {
  quiz: Quiz;
}

export default function QuizView({ quiz }: QuizViewProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | boolean>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const initialState: QuizSubmissionState = { message: null, errors: {} };
  const [state, formAction] = useFormState(submitQuizAction, initialState);

  const handleAnswerChange = (questionId: string, value: string | boolean) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" className="w-full md:w-auto" disabled={pending || Object.keys(selectedAnswers).length !== quiz.questions.length}>
        {pending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
        Kirim Kuis
      </Button>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;


  if (state.message && state.score !== undefined) {
    const isSuccess = state.score >= quiz.questions.length / 2; // Example success condition
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Hasil Kuis: {quiz.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant={isSuccess ? "default" : "destructive"} className={isSuccess ? "bg-accent/20 border-accent" : ""}>
            {isSuccess ? <CheckCircle className="w-5 h-5 text-accent-foreground" /> : <XCircle className="w-5 h-5" />}
            <AlertTitle className={isSuccess ? "text-accent-foreground" : ""}>{isSuccess ? "Selamat!" : "Perlu Peningkatan"}</AlertTitle>
            <AlertDescription>
              {state.message} Anda mendapat skor {state.score} dari {state.totalQuestions}.
            </AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()} variant="outline" className="w-full mt-6">
            Ulangi Kuis (Contoh)
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">{quiz.title}</CardTitle>
        <CardDescription>
          Pertanyaan {currentQuestionIndex + 1} dari {quiz.questions.length}
        </CardDescription>
        <Progress value={progressPercentage} className="w-full mt-2 h-2" />
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <input type="hidden" name="quizId" value={quiz.id} />
          <input type="hidden" name="answers" value={JSON.stringify(selectedAnswers)} />

          <div key={currentQuestion.id} className="p-4 mb-6 border rounded-lg bg-background">
            <p className="mb-4 text-lg font-medium text-foreground">{currentQuestion.text}</p>
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <RadioGroup
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                value={selectedAnswers[currentQuestion.id] as string | undefined}
                className="space-y-2"
              >
                {currentQuestion.options.map((option, index) => (
                  <FormItem key={index} className="flex items-center p-3 space-x-3 transition-colors border rounded-md hover:bg-muted/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                    <FormControl>
                      <RadioGroupItem value={option} id={`${currentQuestion.id}-option-${index}`} />
                    </FormControl>
                    <Label htmlFor={`${currentQuestion.id}-option-${index}`} className="font-normal cursor-pointer">
                      {option}
                    </Label>
                  </FormItem>
                ))}
              </RadioGroup>
            )}
            {currentQuestion.type === 'true-false' && (
              <RadioGroup
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value === 'true')}
                value={selectedAnswers[currentQuestion.id] !== undefined ? String(selectedAnswers[currentQuestion.id]) : undefined}
                className="space-y-2"
              >
                <FormItem className="flex items-center p-3 space-x-3 transition-colors border rounded-md hover:bg-muted/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                  <FormControl>
                    <RadioGroupItem value="true" id={`${currentQuestion.id}-true`} />
                  </FormControl>
                  <Label htmlFor={`${currentQuestion.id}-true`} className="font-normal cursor-pointer">Benar</Label>
                </FormItem>
                <FormItem className="flex items-center p-3 space-x-3 transition-colors border rounded-md hover:bg-muted/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                  <FormControl>
                    <RadioGroupItem value="false" id={`${currentQuestion.id}-false`} />
                  </FormControl>
                  <Label htmlFor={`${currentQuestion.id}-false`} className="font-normal cursor-pointer">Salah</Label>
                </FormItem>
              </RadioGroup>
            )}
          </div>
          
          {state.errors?._form && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="w-4 h-4" />
              <AlertTitle>Kesalahan</AlertTitle>
              <AlertDescription>{state.errors._form.join(', ')}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between mt-8">
            <Button type="button" variant="outline" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
              Sebelumnya
            </Button>
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <Button type="button" onClick={handleNextQuestion} disabled={selectedAnswers[currentQuestion.id] === undefined}>
                Berikutnya
              </Button>
            ) : (
              <SubmitButton />
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Pastikan semua pertanyaan dijawab sebelum mengirim.
      </CardFooter>
    </Card>
  );
}

// Need to include FormItem and FormControl for RadioGroup structure
import { FormItem, FormControl } from "@/components/ui/form";
