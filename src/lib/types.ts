
export interface User {
  id: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
  username?: string;
  role?: UserRole;
  Profil_Foto?: string;
}

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface LoginHistoryEntry {
  email: string;
  name?: string;
  role?: UserRole;
  loginTime: string;
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
  id:string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  options?: string[];
  correctAnswer?: string | boolean;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  lessonId?: string;
  teacherId?: string; // Bisa ID guru atau string khusus seperti "admin-created"
  questions: Question[];
  description?: string;
  assignedClassIds?: string[];
}

export interface UserProgress {
  userId: string;
  completedLessons: string[];
  inProgressLessons?: string[];
  quizScores: Array<{ quizId: string; score: number; totalQuestions: number }>;
  currentLearningPath?: CustomizedLearningPath;
}

export interface LessonStatusCounts {
  name: 'Selesai' | 'Dikerjakan' | 'Belum Dimulai';
  value: number;
  fill: string;
}

export interface StudentData {
  ID_Siswa: string;
  Nama_Lengkap: string;
  Nama_Panggilan?: string;
  Jenis_Kelamin: 'Laki-laki' | 'Perempuan' | '';
  Tanggal_Lahir: string;
  Alamat: string;
  Email: string;
  Nomor_Telepon: string;
  Program_Studi: string;
  Kelas: string;
  Tanggal_Daftar: string;
  Status_Aktif: boolean;
  Profil_Foto?: string;
  Username: string;
  Password_Hash: string;
  NISN: string;
  Nomor_Induk: string;
  ID_OrangTua_Terkait?: string;
}

export interface TeacherData {
  ID_Guru: string;
  Nama_Lengkap: string;
  Jenis_Kelamin: 'Laki-laki' | 'Perempuan' | '';
  Tanggal_Lahir: string;
  Alamat: string;
  Email: string;
  Nomor_Telepon: string;
  Mata_Pelajaran: string;
  Kelas_Ajar: string[];
  Status_Aktif: boolean;
  Profil_Foto?: string;
  Username: string;
  Password_Hash: string;
  Tanggal_Pendaftaran: string;
  Jabatan?: string;
  isAdmin?: boolean;
}

export interface ParentData {
  ID_OrangTua: string;
  Nama_Lengkap: string;
  Username: string;
  Email: string;
  Nomor_Telepon?: string;
  Status_Aktif: boolean;
  Password_Hash: string;
  Profil_Foto?: string;
  Anak_Terkait?: Array<{ ID_Siswa: string, Nama_Siswa: string }>;
}


export interface ClassData {
  ID_Kelas: string;
  Nama_Kelas: string;
  ID_Guru: string;
  Deskripsi_Kelas?: string;
  Waktu_Kelas?: string;
  jurusan: string;
  jumlahSiswa?: number;
}

export interface GradeData {
  ID_Nilai: string;
  ID_Siswa: string;
  ID_Kelas: string;
  Nilai_Tugas?: number;
  Nilai_Ujian?: number;
  Nilai_Akhir?: number;
}

export interface LandingPageSlide {
  imageUrl: string;
  description: string;
}

export interface SchoolProfileData {
  namaSekolah: string;
  npsn: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'Lainnya' | '';
  statusSekolah: 'Negeri' | 'Swasta' | '';
  akreditasi: string;
  namaKepalaSekolah: string;
  alamatJalan: string;
  kota: string;
  provinsi: string;
  kodePos: string;
  nomorTelepon: string;
  emailSekolah: string;
  websiteSekolah?: string;
  visi?: string;
  misi?: string;
  logo?: File | string;
  landingPageSlides?: LandingPageSlide[]; // Diubah dari landingPageImageUrl
}

export interface MajorData {
  ID_Jurusan: string;
  Nama_Jurusan: string;
  Deskripsi_Jurusan?: string;
  Nama_Kepala_Program?: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  date: string;
  time: string;
  classId?: string;
  className?: string;
  lessonId?: string;
  quizId?: string;
  teacherId?: string;
  teacherName?: string;
  description?: string;
  category: 'Pelajaran' | 'Kuis' | 'Tugas' | 'Diskusi' | 'Lainnya';
}

export interface ChartConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  );
}
