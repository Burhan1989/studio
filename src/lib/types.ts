
export interface User {
  id: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
  username?: string; // Added username for basic user auth if needed
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
  content: string; 
  videoUrl?: string;
  quizId?: string;
  estimatedTime: string;
  difficulty: 'Pemula' | 'Menengah' | 'Mahir';
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false';
  options?: string[];
  correctAnswer: string | boolean;
}

export interface Quiz {
  id: string;
  title: string;
  lessonId?: string;
  questions: Question[];
}

export interface UserProgress {
  userId: string;
  completedLessons: string[];
  quizScores: Array<{ quizId: string; score: number; totalQuestions: number }>;
  currentLearningPath?: CustomizedLearningPath;
}

// Detailed Student Data Structure
export interface StudentData {
  ID_Siswa: string; // Primary Key (Integer / UUID)
  Nama_Lengkap: string; // Varchar(100)
  Nama_Panggilan?: string; // Varchar(50), opsional
  Jenis_Kelamin: 'Laki-laki' | 'Perempuan'; // Varchar(10)
  Tanggal_Lahir: string; // Date (string for simplicity in mock data, can be Date object)
  Alamat: string; // Varchar(200)
  Email: string; // Varchar(100)
  Nomor_Telepon: string; // Varchar(20)
  Program_Studi: string; // Varchar(50) - This will be displayed as "Jurusan"
  Kelas: string; // Varchar(50)
  Tanggal_Daftar: string; // Date
  Status_Aktif: boolean; // Boolean
  Profil_Foto?: string; // Varchar(200), path or URL
  Username: string; // Added
  Password_Hash: string; // Varchar(100) - Storing hash, not plaintext
  NISN: string; // Added
  Nomor_Induk: string; // Added
}

// Detailed Teacher Data Structure
export interface TeacherData {
  ID_Guru: string; // Primary Key (Integer / UUID)
  Nama_Lengkap: string; // Varchar(100)
  Jenis_Kelamin: 'Laki-laki' | 'Perempuan'; // Varchar(10)
  Tanggal_Lahir: string; // Date
  Alamat: string; // Varchar(200)
  Email: string; // Varchar(100)
  Nomor_Telepon: string; // Varchar(20)
  Mata_Pelajaran: string; // Varchar(50)
  Kelas_Ajar: string[]; // Varchar(50) - Can be an array of class names/IDs
  Status_Aktif: boolean; // Boolean
  Profil_Foto?: string; // Varchar(200)
  Username: string; // Added
  Password_Hash: string; // Varchar(100) - Storing hash, not plaintext
  Tanggal_Pendaftaran: string; // Date
  Jabatan?: string; // Varchar(50), opsional
}

// Example for Class Table (Relational Data)
export interface ClassData {
  ID_Kelas: string; // Primary Key
  Nama_Kelas: string;
  ID_Guru: string; // Foreign Key to TeacherData
  Deskripsi_Kelas?: string;
  Waktu_Kelas?: string;
  jurusan?: string; // Added Jurusan to ClassData
  jumlahSiswa?: number; // Added for mock data consistency
}

// Example for Grades Table (Relational Data)
export interface GradeData {
  ID_Nilai: string; // Primary Key
  ID_Siswa: string; // Foreign Key to StudentData
  ID_Kelas: string; // Foreign Key to ClassData
  Nilai_Tugas?: number;
  Nilai_Ujian?: number;
  Nilai_Akhir?: number;
}
