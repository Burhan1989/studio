
"use server";

import { z } from "zod";
import { 
  customizeLearningPath, 
  type CustomizeLearningPathInput, 
  type CustomizeLearningPathOutput 
} from "@/ai/flows/learning-path-customization";
import { revalidatePath } from "next/cache";

// Schema for learning path customization form
const CustomizeLearningPathInputSchema = z.object({
  userInteractions: z.string().min(10, "Mohon berikan detail lebih lanjut tentang interaksi pengguna."),
  quizPerformance: z.string().min(10, "Mohon deskripsikan performa kuis lebih detail."),
  learningStylePreferences: z.string().min(1, "Mohon pilih preferensi gaya belajar."),
  topic: z.string().min(3, "Topik minimal harus 3 karakter."),
});

export interface LearningPathFormState {
  message: string | null;
  data?: CustomizeLearningPathOutput;
  errors?: {
    userInteractions?: string[];
    quizPerformance?: string[];
    learningStylePreferences?: string[];
    topic?: string[];
    _form?: string[]; // For general form errors
  };
  timestamp?: number; // To force re-render on success
}

export async function generateCustomizedLearningPathAction(
  prevState: LearningPathFormState,
  formData: FormData
): Promise<LearningPathFormState> {
  const rawFormData = {
    userInteractions: formData.get("userInteractions") as string,
    quizPerformance: formData.get("quizPerformance") as string,
    learningStylePreferences: formData.get("learningStylePreferences") as string,
    topic: formData.get("topic") as string,
  };

  const validatedFields = CustomizeLearningPathInputSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validasi gagal. Silakan periksa input Anda.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Type assertion needed here as schema is validated
    const result = await customizeLearningPath(validatedFields.data as CustomizeLearningPathInput);
    revalidatePath("/learning-path"); // If you want to ensure fresh data if path is re-used
    return { 
      message: "Jalur belajar berhasil dibuat!", 
      data: result,
      timestamp: Date.now(), // Add timestamp to trigger re-render of display component
    };
  } catch (error) {
    console.error("Kesalahan saat membuat jalur belajar:", error);
    let errorMessage = "Terjadi kesalahan tak terduga.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { 
      message: "Gagal membuat jalur belajar.",
      errors: { _form: [errorMessage] } 
    };
  }
}


// Mock Quiz Submission Action
const QuizSubmissionSchema = z.object({
  quizId: z.string(),
  answers: z.record(z.string(), z.union([z.string(), z.boolean()])), // questionId: answer
});

export interface QuizSubmissionState {
  message: string | null;
  score?: number;
  totalQuestions?: number;
  errors?: {
    _form?: string[];
  };
}

export async function submitQuizAction(
  prevState: QuizSubmissionState,
  formData: FormData
): Promise<QuizSubmissionState> {
  // This is a mock. In a real app, you'd fetch the quiz, compare answers, and save progress.
  const quizId = formData.get("quizId") as string;
  const answersData = formData.get("answers") as string; // Assuming answers are stringified JSON

  if (!quizId || !answersData) {
    return { message: "Data pengiriman tidak valid.", errors: { _form: ["ID Kuis atau jawaban tidak ada."] } };
  }
  
  let answers;
  try {
    answers = JSON.parse(answersData);
  } catch (e) {
    return { message: "Format jawaban tidak valid.", errors: { _form: ["Jawaban tidak dapat diproses."] } };
  }


  // Simulate scoring
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  // Mock score
  const score = Math.floor(Math.random() * 5) + 1; // Random score out of 5
  const totalQuestions = 5; // Assuming 5 questions for this mock

  console.log(`Kuis ${quizId} dikirim dengan jawaban:`, answers);
  revalidatePath(`/quizzes/${quizId}`);
  revalidatePath('/reports'); // Revalidate reports page
  
  return {
    message: "Kuis berhasil dikirim!",
    score,
    totalQuestions,
  };
}
