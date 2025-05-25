
export interface User {
  id: string;
  email: string;
  name?: string;
  isAdmin?: boolean; // Tambahkan properti isAdmin
}

export interface LearningResource {
  resourceType: string;
  resourceLink: string;
  description: string;
}

export interface CustomizedLearningPath {
  learningPathDescription: string;
  customQuizzes: LearningResource[];
  customLearningResources: LearningResource[];
}

export interface Lesson {
  id: string;
  title: string;
  // Content can be a string (e.g. markdown) or a more structured format
  content: string; 
  videoUrl?: string; // Placeholder for video URLs
  quizId?: string;   // Optional: ID of a quiz associated with this lesson
  estimatedTime: string; // e.g., "45 minutes"
  difficulty: 'Pemula' | 'Menengah' | 'Mahir'; // Updated to Indonesian
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false';
  options?: string[]; // For multiple-choice questions
  correctAnswer: string | boolean; // string for MCQ index/value, boolean for T/F
}

export interface Quiz {
  id: string;
  title: string;
  lessonId?: string; // Optional: ID of the lesson this quiz belongs to
  questions: Question[];
}

export interface UserProgress {
  userId: string;
  completedLessons: string[]; // Array of lesson IDs
  quizScores: Array<{ quizId: string; score: number; totalQuestions: number }>;
  currentLearningPath?: CustomizedLearningPath; // Store the AI generated path
}
