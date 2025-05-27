
import type { Lesson, Quiz, Question, StudentData, TeacherData, ParentData, UserProgress, LessonStatusCounts, SchoolProfileData, ClassData, MajorData, ScheduleItem } from './types';
import type { ChartConfig } from "@/components/ui/chart";

// --- Data Storage Keys for localStorage ---
const STUDENTS_STORAGE_KEY = 'adeptlearn-students';
const TEACHERS_STORAGE_KEY = 'adeptlearn-teachers';
const PARENTS_STORAGE_KEY = 'adeptlearn-parents';
const MAJORS_STORAGE_KEY = 'adeptlearn-majors';
const CLASSES_STORAGE_KEY = 'adeptlearn-classes';
const SCHEDULES_STORAGE_KEY = 'adeptlearn-schedules';
const QUIZZES_STORAGE_KEY = 'adeptlearn-quizzes';
const SCHOOL_PROFILE_STORAGE_KEY = 'adeptlearn-school-profile';
const LESSONS_STORAGE_KEY = 'adeptlearn-lessons';

// --- Helper Functions for localStorage ---
function loadDataFromStorage<T>(key: string, initialData: T, isSingleObject = false): T {
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (e) {
        console.error(`Gagal memparsing data dari localStorage (key: ${key}):`, e);
        localStorage.setItem(key, JSON.stringify(initialData));
        return initialData;
      }
    } else {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
  }
  return initialData;
}

function saveDataToStorage<T>(key: string, data: T) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// --- Initial Mock Data (Defaults if localStorage is empty) ---
const initialMockStudents: StudentData[] = [
  {
    ID_Siswa: "student001",
    Nama_Lengkap: "Siswa Rajin",
    Nama_Panggilan: "Siswa",
    Username: "siswarajin",
    Email: "student@example.com",
    NISN: "0098765432",
    Nomor_Induk: "S1004",
    Kelas: "Kelas 10A", // Pastikan ini cocok dengan salah satu Nama_Kelas di initialMockClasses
    Jenis_Kelamin: "Perempuan",
    Tanggal_Lahir: "2008-01-15",
    Alamat: "Jl. Belajar No. 5, Kota Ilmu",
    Nomor_Telepon: "081234567899",
    Program_Studi: "Ilmu Pengetahuan Alam (IPA)", // Pastikan ini cocok dengan jurusan Kelas 10A
    Tanggal_Daftar: "2023-08-01",
    Status_Aktif: true,
    Password_Hash: "password",
    Profil_Foto: "https://placehold.co/100x100.png?text=SR",
    ID_OrangTua_Terkait: "parent001"
  },
  {
    ID_Siswa: "siswa1",
    Nama_Lengkap: "Ahmad Zulkifli Zaini",
    Nama_Panggilan: "Zaini",
    Username: "ahmad.zaini",
    Email: "ahmad.z@example.com",
    NISN: "0012345678",
    Nomor_Induk: "S1001",
    Kelas: "Kelas 10A",
    Jenis_Kelamin: "Laki-laki",
    Tanggal_Lahir: "2007-08-17",
    Alamat: "Jl. Pelajar No. 10, Jakarta",
    Nomor_Telepon: "085678901234",
    Program_Studi: "Ilmu Pengetahuan Alam (IPA)",
    Tanggal_Daftar: "2023-07-01",
    Status_Aktif: true,
    Password_Hash: "hashed_password_siswa1",
    Profil_Foto: "https://placehold.co/100x100.png?text=AZ"
  },
];

const initialMockTeachers: TeacherData[] = [
  {
    ID_Guru: "admin001",
    Nama_Lengkap: "Admin AdeptLearn",
    Username: "adminutama",
    Email: "admin@example.com",
    Mata_Pelajaran: "Administrasi Sistem",
    Kelas_Ajar: ["Semua Kelas"],
    Jenis_Kelamin: "Laki-laki",
    Tanggal_Lahir: "1990-01-01",
    Alamat: "Jl. Kantor Pusat No. 1",
    Nomor_Telepon: "081200000001",
    Status_Aktif: true,
    Password_Hash: "adminpassword",
    Tanggal_Pendaftaran: "2020-01-01",
    Jabatan: "Administrator Utama",
    Profil_Foto: "https://placehold.co/100x100.png?text=AD",
    isAdmin: true,
  },
  {
    ID_Guru: "teacher001",
    Nama_Lengkap: "Guru Inovatif, M.Pd.",
    Username: "guruinovatif",
    Email: "teacher@example.com",
    Mata_Pelajaran: "Kimia Terapan",
    Kelas_Ajar: ["Kelas 10A", "Kelas 11B"], // ID Kelas harus cocok dengan yang ada
    Jenis_Kelamin: "Laki-laki",
    Tanggal_Lahir: "1982-03-25",
    Alamat: "Jl. Mengajar No. 10, Kota Edukasi",
    Nomor_Telepon: "089876543210",
    Status_Aktif: true,
    Password_Hash: "password",
    Tanggal_Pendaftaran: "2015-06-01",
    Jabatan: "Guru Senior Kimia",
    Profil_Foto: "https://placehold.co/100x100.png?text=GI",
    isAdmin: false,
  },
];

const initialMockParents: ParentData[] = [
    {
        ID_OrangTua: "parent001",
        Nama_Lengkap: "Orang Tua Bijak",
        Username: "ortubijak",
        Email: "parent@example.com",
        Nomor_Telepon: "081122334455",
        Status_Aktif: true,
        Password_Hash: "password",
        Profil_Foto: "https://placehold.co/100x100.png?text=OB",
        Anak_Terkait: [
            { ID_Siswa: "student001", Nama_Siswa: "Siswa Rajin" },
        ]
    },
];

const initialMockMajors: MajorData[] = [
  { ID_Jurusan: "major001", Nama_Jurusan: "Ilmu Pengetahuan Alam (IPA)", Deskripsi_Jurusan: "Fokus pada studi sains seperti Fisika, Kimia, Biologi.", Nama_Kepala_Program: "Dr. Annisa Fitri, M.Si." },
  { ID_Jurusan: "major002", Nama_Jurusan: "Ilmu Pengetahuan Sosial (IPS)", Deskripsi_Jurusan: "Mempelajari aspek sosial, ekonomi, dan sejarah.", Nama_Kepala_Program: "Drs. Joko Susilo, M.Hum." },
];

const initialMockClasses: ClassData[] = [
  { ID_Kelas: 'kelasA', Nama_Kelas: 'Kelas 10A', ID_Guru: 'teacher001', jumlahSiswa: 30, jurusan: "Ilmu Pengetahuan Alam (IPA)" },
  { ID_Kelas: 'kelasB', Nama_Kelas: 'Kelas 11B', ID_Guru: 'teacher001', jumlahSiswa: 28, jurusan: "Ilmu Pengetahuan Sosial (IPS)" },
];

const initialMockSchedules: ScheduleItem[] = [
  {
    id: 'schedule1',
    title: 'Pelajaran Matematika: Aljabar Dasar',
    date: '2024-08-15',
    time: '08:00 - 09:30',
    classId: 'kelasA',
    teacherId: 'teacher001',
    description: 'Pembahasan Bab 1 dan latihan soal.',
    category: 'Pelajaran',
    lessonId: '1',
  },
];

const initialMockQuestionsQuiz1: Question[] = [
  { id: 'q1_1', text: 'Kata kunci mana yang digunakan untuk mendeklarasikan variabel dalam JavaScript modern yang dapat diubah nilainya?', type: 'multiple-choice', options: ['var', 'let', 'const', 'static'], correctAnswer: 'let', points: 10 },
  { id: 'q1_2', text: 'JavaScript utamanya adalah bahasa skrip sisi klien.', type: 'true-false', correctAnswer: true, points: 5 },
];
const initialMockQuestionsQuiz2: Question[] = [
  { id: 'q2_1', text: 'Hook mana yang akan Anda gunakan untuk menambahkan state ke komponen fungsi?', type: 'multiple-choice', options: ['useEffect', 'useContext', 'useState', 'useReducer'], correctAnswer: 'useState', points: 10 },
  { id: 'q2_2', text: '`useEffect` digunakan untuk mengelola kejadian siklus hidup komponen dan efek samping.', type: 'true-false', correctAnswer: true, points: 5 },
];
const initialMockQuizzes: Quiz[] = [
  { id: 'quiz1', title: 'Kuis Dasar JavaScript', lessonId: '1', teacherId: 'teacher001', questions: initialMockQuestionsQuiz1, description: "Kuis dasar untuk menguji pemahaman JavaScript awal.", assignedClassIds: ['kelasA'] },
  { id: 'quiz2', title: 'Dasar-Dasar React Hooks', lessonId: '3', teacherId: 'teacher001', questions: initialMockQuestionsQuiz2, description: "Kuis untuk menguji pemahaman tentang React Hooks.", assignedClassIds: ['kelasB'] },
];

const initialMockSchoolProfile: SchoolProfileData = {
  namaSekolah: "SMA Negeri 1 Teladan Bangsa",
  npsn: "12345678",
  jenjang: "SMA",
  statusSekolah: "Negeri",
  akreditasi: "A (Unggul)",
  namaKepalaSekolah: "Dr. H. Budi Santoso, M.Pd.",
  alamatJalan: "Jl. Pendidikan No. 1",
  kota: "Jakarta Selatan",
  provinsi: "DKI Jakarta",
  kodePos: "12345",
  nomorTelepon: "021-1234567",
  emailSekolah: "info@sman1teladan.sch.id",
  websiteSekolah: "https://sman1teladan.sch.id",
  logo: "https://placehold.co/160x40.png?text=Logo+Sekolah",
  landingPageImageUrl: "https://placehold.co/600x400.png", // URL gambar landing page
  visi: "Menjadi sekolah unggul yang berkarakter, berprestasi, dan berwawasan global.",
  misi: "1. Melaksanakan pembelajaran yang inovatif dan kreatif.\n2. Mengembangkan potensi siswa secara optimal.\n3. Membangun karakter siswa yang berakhlak mulia.",
};

const initialMockLessons: Lesson[] = [
  { id: '1', title: 'Pengenalan JavaScript', content: 'JavaScript adalah bahasa pemrograman serbaguna...', videoUrl: 'https://placehold.co/600x338.png?text=Video+JS', quizId: 'quiz1', estimatedTime: "30 menit", difficulty: "Pemula" },
  { id: '2', title: 'Variabel dan Tipe Data dalam JS', content: 'Dalam JavaScript, variabel dideklarasikan...', estimatedTime: "45 menit", difficulty: "Pemula" },
  { id: '3', title: 'Memahami React Hooks', content: 'Hook adalah fungsi yang memungkinkan Anda...', videoUrl: 'https://placehold.co/600x338.png?text=Video+React+Hooks', quizId: 'quiz2', estimatedTime: "1 jam", difficulty: "Menengah" },
];


// --- Active Data (Loaded from localStorage or initialized) ---
let students: StudentData[] = loadDataFromStorage<StudentData[]>(STUDENTS_STORAGE_KEY, initialMockStudents);
let teachers: TeacherData[] = loadDataFromStorage<TeacherData[]>(TEACHERS_STORAGE_KEY, initialMockTeachers);
let parents: ParentData[] = loadDataFromStorage<ParentData[]>(PARENTS_STORAGE_KEY, initialMockParents);
let majors: MajorData[] = loadDataFromStorage<MajorData[]>(MAJORS_STORAGE_KEY, initialMockMajors);
let classes: ClassData[] = loadDataFromStorage<ClassData[]>(CLASSES_STORAGE_KEY, initialMockClasses);
let schedules: ScheduleItem[] = loadDataFromStorage<ScheduleItem[]>(SCHEDULES_STORAGE_KEY, initialMockSchedules);
let quizzes: Quiz[] = loadDataFromStorage<Quiz[]>(QUIZZES_STORAGE_KEY, initialMockQuizzes);
let schoolProfile: SchoolProfileData = loadDataFromStorage<SchoolProfileData>(SCHOOL_PROFILE_STORAGE_KEY, initialMockSchoolProfile, true);
let lessons: Lesson[] = loadDataFromStorage<Lesson[]>(LESSONS_STORAGE_KEY, initialMockLessons);


// --- Student Data Functions ---
export function getStudents(): StudentData[] {
  return [...students];
}
export function getStudentById(id: string): StudentData | undefined {
  return students.find(student => student.ID_Siswa === id);
}
export function addStudent(studentData: Omit<StudentData, 'ID_Siswa' | 'Tanggal_Daftar' | 'Profil_Foto' | 'Status_Aktif'>): StudentData {
  const newStudent: StudentData = {
    ID_Siswa: `siswa${Date.now()}${Math.floor(Math.random() * 100)}`,
    Nama_Lengkap: studentData.Nama_Lengkap,
    Nama_Panggilan: studentData.Nama_Panggilan,
    Jenis_Kelamin: studentData.Jenis_Kelamin,
    Tanggal_Lahir: studentData.Tanggal_Lahir,
    Alamat: studentData.Alamat,
    Email: studentData.Email,
    Nomor_Telepon: studentData.Nomor_Telepon,
    Program_Studi: studentData.Program_Studi,
    Kelas: studentData.Kelas,
    Username: studentData.Username,
    Password_Hash: studentData.Password_Hash,
    NISN: studentData.NISN,
    Nomor_Induk: studentData.Nomor_Induk,
    ID_OrangTua_Terkait: studentData.ID_OrangTua_Terkait,
    Profil_Foto: `https://placehold.co/100x100.png?text=${studentData.Nama_Lengkap.substring(0,2).toUpperCase()}`,
    Tanggal_Daftar: new Date().toISOString().split('T')[0],
    Status_Aktif: true,
  };
  students = [...students, newStudent];
  saveDataToStorage(STUDENTS_STORAGE_KEY, students);
  return newStudent;
}
export function updateStudent(updatedStudent: StudentData): boolean {
  const index = students.findIndex(student => student.ID_Siswa === updatedStudent.ID_Siswa);
  if (index !== -1) {
    students[index] = updatedStudent;
    saveDataToStorage(STUDENTS_STORAGE_KEY, students);
    return true;
  }
  return false;
}
export function deleteStudentById(studentId: string): boolean {
  const initialLength = students.length;
  students = students.filter(student => student.ID_Siswa !== studentId);
  if (students.length < initialLength) {
    saveDataToStorage(STUDENTS_STORAGE_KEY, students);
    return true;
  }
  return false;
}

// --- Teacher Data Functions ---
export function getTeachers(): TeacherData[] {
  return [...teachers];
}
export function getTeacherById(id: string): TeacherData | undefined {
  return teachers.find(teacher => teacher.ID_Guru === id);
}
export function addTeacher(teacherData: Omit<TeacherData, 'ID_Guru' | 'Tanggal_Pendaftaran' | 'Profil_Foto' | 'isAdmin'>): TeacherData {
  const newTeacher: TeacherData = {
    ID_Guru: `guru${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...teacherData,
    isAdmin: false,
    Profil_Foto: `https://placehold.co/100x100.png?text=${teacherData.Nama_Lengkap.substring(0,2).toUpperCase()}`,
    Tanggal_Pendaftaran: new Date().toISOString().split('T')[0],
  };
  teachers = [...teachers, newTeacher];
  saveDataToStorage(TEACHERS_STORAGE_KEY, teachers);
  return newTeacher;
}
export function updateTeacher(updatedTeacher: TeacherData): boolean {
  const index = teachers.findIndex(teacher => teacher.ID_Guru === updatedTeacher.ID_Guru);
  if (index !== -1) {
    teachers[index] = updatedTeacher;
    saveDataToStorage(TEACHERS_STORAGE_KEY, teachers);
    return true;
  }
  return false;
}
export function deleteTeacherById(teacherId: string): boolean {
  const initialLength = teachers.length;
  teachers = teachers.filter(teacher => teacher.ID_Guru !== teacherId);
  if (teachers.length < initialLength) {
    saveDataToStorage(TEACHERS_STORAGE_KEY, teachers);
    return true;
  }
  return false;
}
export function addAdminUser(newAdminData: Omit<TeacherData, 'ID_Guru' | 'Tanggal_Pendaftaran' | 'Profil_Foto'>): TeacherData | null {
    const emailExists = teachers.some(teacher => teacher.Email === newAdminData.Email);
    const usernameExists = teachers.some(teacher => teacher.Username === newAdminData.Username);

    if (emailExists) {
        console.warn(`Gagal menambahkan admin: Email ${newAdminData.Email} sudah digunakan.`);
        return null;
    }
    if (usernameExists) {
        console.warn(`Gagal menambahkan admin: Username ${newAdminData.Username} sudah digunakan.`);
        return null;
    }
    const newAdmin: TeacherData = {
      ID_Guru: `admin${Date.now()}${Math.floor(Math.random() * 100)}`,
      ...newAdminData,
      isAdmin: true,
      Profil_Foto: `https://placehold.co/100x100.png?text=${newAdminData.Nama_Lengkap.substring(0,2).toUpperCase()}`,
      Tanggal_Pendaftaran: new Date().toISOString().split('T')[0],
    };
    teachers = [...teachers, newAdmin];
    saveDataToStorage(TEACHERS_STORAGE_KEY, teachers);
    return newAdmin;
}

// --- Parent Data Functions ---
export function getParents(): ParentData[] {
  return [...parents];
}
export function getParentById(id: string): ParentData | undefined {
  return parents.find(p => p.ID_OrangTua === id);
}
export function addParent(parentData: Omit<ParentData, 'ID_OrangTua' | 'Profil_Foto' | 'Status_Aktif' | 'Anak_Terkait'>): ParentData {
  const newParent: ParentData = {
    ID_OrangTua: `parent${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...parentData,
    Status_Aktif: true,
    Anak_Terkait: [],
    Profil_Foto: `https://placehold.co/100x100.png?text=${parentData.Nama_Lengkap.substring(0,2).toUpperCase()}`,
  };
  parents = [...parents, newParent];
  saveDataToStorage(PARENTS_STORAGE_KEY, parents);
  return newParent;
}
export function updateParent(updatedParent: ParentData): boolean {
  const index = parents.findIndex(p => p.ID_OrangTua === updatedParent.ID_OrangTua);
  if (index !== -1) {
    parents[index] = updatedParent;
    saveDataToStorage(PARENTS_STORAGE_KEY, parents);
    return true;
  }
  return false;
}
export function deleteParentById(parentId: string): boolean {
  const initialLength = parents.length;
  parents = parents.filter(p => p.ID_OrangTua !== parentId);
  if (parents.length < initialLength) {
    saveDataToStorage(PARENTS_STORAGE_KEY, parents);
    return true;
  }
  return false;
}

// --- Major Data Functions ---
export function getMajors(): MajorData[] {
  return [...majors];
}
export function getMajorById(id: string): MajorData | undefined {
  return majors.find(major => major.ID_Jurusan === id);
}
export function addMajor(newMajorData: Omit<MajorData, 'ID_Jurusan'>): MajorData {
  const newMajor: MajorData = {
    ID_Jurusan: `major${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...newMajorData,
  };
  majors = [...majors, newMajor];
  saveDataToStorage(MAJORS_STORAGE_KEY, majors);
  return newMajor;
}
export function updateMajor(updatedMajor: MajorData): boolean {
  const index = majors.findIndex(major => major.ID_Jurusan === updatedMajor.ID_Jurusan);
  if (index !== -1) {
    majors[index] = updatedMajor;
    saveDataToStorage(MAJORS_STORAGE_KEY, majors);
    return true;
  }
  return false;
}
export function deleteMajorById(majorId: string): boolean {
  const initialLength = majors.length;
  majors = majors.filter(major => major.ID_Jurusan !== majorId);
  if (majors.length < initialLength) {
    saveDataToStorage(MAJORS_STORAGE_KEY, majors);
    return true;
  }
  return false;
}

// --- Class Data Functions ---
export function getClasses(): ClassData[] {
  return [...classes];
}
export function getClassById(id: string): ClassData | undefined {
  return classes.find(kelas => kelas.ID_Kelas === id);
}
export function addClass(classData: Omit<ClassData, 'ID_Kelas'>): ClassData {
  const newClass: ClassData = {
    ID_Kelas: `class${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...classData,
  };
  classes = [...classes, newClass];
  saveDataToStorage(CLASSES_STORAGE_KEY, classes);
  return newClass;
}
export function updateClass(updatedClass: ClassData): boolean {
  const index = classes.findIndex(kelas => kelas.ID_Kelas === updatedClass.ID_Kelas);
  if (index !== -1) {
    classes[index] = updatedClass;
    saveDataToStorage(CLASSES_STORAGE_KEY, classes);
    return true;
  }
  return false;
}
export function deleteClassById(classId: string): boolean {
  const initialLength = classes.length;
  classes = classes.filter(kelas => kelas.ID_Kelas !== classId);
  if (classes.length < initialLength) {
    saveDataToStorage(CLASSES_STORAGE_KEY, classes);
    return true;
  }
  return false;
}

// --- Schedule Data Functions ---
export function getSchedules(): ScheduleItem[] {
  return [...schedules].map(schedule => {
      const classInfo = schedule.classId ? classes.find(c => c.ID_Kelas === schedule.classId) : null;
      const teacherInfo = schedule.teacherId ? teachers.find(t => t.ID_Guru === schedule.teacherId) : null;
      return {
        ...schedule,
        className: classInfo ? `${classInfo.Nama_Kelas} - ${classInfo.jurusan}` : (schedule.classId ? schedule.className || 'Info Kelas Hilang' : 'Umum (Semua Kelas)'),
        teacherName: teacherInfo ? teacherInfo.Nama_Lengkap : (schedule.teacherId ? schedule.teacherName || 'Info Guru Hilang' : 'Tidak Ditentukan'),
      };
    });
}
export function getScheduleById(id: string): ScheduleItem | undefined {
  return schedules.find(schedule => schedule.id === id);
}
export function updateSchedule(updatedSchedule: ScheduleItem): boolean {
  const index = schedules.findIndex(schedule => schedule.id === updatedSchedule.id);
  if (index !== -1) {
    const { className, teacherName, ...dataToSave } = updatedSchedule;
    schedules[index] = dataToSave;
    saveDataToStorage(SCHEDULES_STORAGE_KEY, schedules);
    return true;
  }
  return false;
}
export function addSchedule(newScheduleData: Omit<ScheduleItem, 'id' | 'className' | 'teacherName'>): ScheduleItem {
  const newScheduleBase: Omit<ScheduleItem, 'className' | 'teacherName'> = {
    id: `schedule${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...newScheduleData,
  };
  schedules = [...schedules, newScheduleBase];
  saveDataToStorage(SCHEDULES_STORAGE_KEY, schedules);

  const classInfo = newScheduleBase.classId ? classes.find(c => c.ID_Kelas === newScheduleBase.classId) : null;
  const teacherInfo = newScheduleBase.teacherId ? teachers.find(t => t.ID_Guru === newScheduleBase.teacherId) : null;
  return {
    ...newScheduleBase,
    className: classInfo ? `${classInfo.Nama_Kelas} - ${classInfo.jurusan}` : (newScheduleBase.classId ? 'Info Kelas Hilang' : 'Umum (Semua Kelas)'),
    teacherName: teacherInfo ? teacherInfo.Nama_Lengkap : (newScheduleBase.teacherId ? 'Info Guru Hilang' : 'Tidak Ditentukan'),
  };
}
export function deleteScheduleById(scheduleId: string): boolean {
  const initialLength = schedules.length;
  schedules = schedules.filter(schedule => schedule.id !== scheduleId);
  if (schedules.length < initialLength) {
    saveDataToStorage(SCHEDULES_STORAGE_KEY, schedules);
    return true;
  }
  return false;
}

// --- Quiz Data Functions ---
export function getQuizzes(): Quiz[] {
  return [...quizzes];
}
export function getQuizById(id: string): Quiz | undefined {
  return quizzes.find(quiz => quiz.id === id);
}
export function getQuizzesByTeacherId(teacherId: string): Quiz[] {
  return quizzes.filter(quiz => quiz.teacherId === teacherId);
}
export function addQuiz(quizData: Omit<Quiz, 'id'> & { teacherId?: string }): Quiz {
  const newQuiz: Quiz = {
    id: `quiz${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...quizData,
  };
  quizzes = [...quizzes, newQuiz];
  saveDataToStorage(QUIZZES_STORAGE_KEY, quizzes);
  return newQuiz;
}
export function updateQuiz(updatedQuiz: Quiz): boolean {
  const index = quizzes.findIndex(quiz => quiz.id === updatedQuiz.id);
  if (index !== -1) {
    quizzes[index] = {
      ...quizzes[index],
      ...updatedQuiz,
      questions: updatedQuiz.questions.map(q => ({
        ...q,
        id: q.id || `q_updated_${Date.now()}${Math.random().toString(36).substring(2,7)}`,
      })),
    };
    saveDataToStorage(QUIZZES_STORAGE_KEY, quizzes);
    return true;
  }
  return false;
}
export function deleteQuizById(quizId: string): boolean {
  const initialLength = quizzes.length;
  quizzes = quizzes.filter(quiz => quiz.id !== quizId);
  if (quizzes.length < initialLength) {
    saveDataToStorage(QUIZZES_STORAGE_KEY, quizzes);
    return true;
  }
  return false;
}

// --- School Profile Functions ---
export function getSchoolProfile(): SchoolProfileData {
  return schoolProfile;
}
export function updateSchoolProfile(updatedProfile: SchoolProfileData): SchoolProfileData {
  schoolProfile = updatedProfile;
  saveDataToStorage(SCHOOL_PROFILE_STORAGE_KEY, schoolProfile);
  return schoolProfile;
}

// --- Lesson Data Functions ---
export function getLessons(): Lesson[] {
  return [...lessons];
}
export function getLessonById(id: string): Lesson | undefined {
  return lessons.find(lesson => lesson.id === id);
}
export function addLesson(lessonData: Omit<Lesson, 'id'>): Lesson {
  const newLesson: Lesson = {
    id: `lesson${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...lessonData,
  };
  lessons = [...lessons, newLesson];
  saveDataToStorage(LESSONS_STORAGE_KEY, lessons);
  return newLesson;
}
export function updateLesson(updatedLesson: Lesson): boolean {
  const index = lessons.findIndex(lesson => lesson.id === updatedLesson.id);
  if (index !== -1) {
    lessons[index] = updatedLesson;
    saveDataToStorage(LESSONS_STORAGE_KEY, lessons);
    return true;
  }
  return false;
}
export function deleteLesson(lessonId: string): boolean {
  const initialLength = lessons.length;
  lessons = lessons.filter(lesson => lesson.id !== lessonId);
  if (lessons.length < initialLength) {
    saveDataToStorage(LESSONS_STORAGE_KEY, lessons);
    return true;
  }
  return false;
}

// --- User Progress & Chart Data (Static, not localStorage for now) ---
export const mockUserProgress: UserProgress = {
  userId: 'student001',
  completedLessons: ['1', '2'],
  inProgressLessons: ['3'],
  quizScores: [
    { quizId: 'quiz1', score: 2, totalQuestions: 3 },
    { quizId: 'quiz2', score: 3, totalQuestions: 3 },
  ],
  currentLearningPath: {
    learningPathDescription: "Jalur ramah pemula yang berfokus pada dasar-dasar JavaScript, diikuti oleh pengenalan React.",
    customQuizzes: [
      { resourceType: "Kuis Interaktif", resourceLink: "#", description: "Uji pengetahuan inti JS Anda." }
    ],
    customLearningResources: [
      { resourceType: "Tutorial Video", resourceLink: "#", description: "Selami lebih dalam closure JS." },
      { resourceType: "Artikel", resourceLink: "#", description: "Memahami fitur ES6." }
    ]
  }
};

const totalMockLessons = initialMockLessons.length;
const completedCount = mockUserProgress ? mockUserProgress.completedLessons.length : 0;
const inProgressCount = mockUserProgress && mockUserProgress.inProgressLessons ? mockUserProgress.inProgressLessons.length : 0;
const notStartedCount = totalMockLessons - completedCount - inProgressCount;

export const lessonStatusData: LessonStatusCounts[] = [
  { name: 'Selesai', value: completedCount, fill: 'hsl(var(--chart-1))' },
  { name: 'Dikerjakan', value: inProgressCount, fill: 'hsl(var(--chart-2))' },
  { name: 'Belum Dimulai', value: notStartedCount, fill: 'hsl(var(--chart-3))' },
];
export const lessonStatusChartConfig: ChartConfig = {
  Selesai: { label: 'Selesai', color: 'hsl(var(--chart-1))' },
  Dikerjakan: { label: 'Dikerjakan', color: 'hsl(var(--chart-2))' },
  'Belum Dimulai': { label: 'Belum Dimulai', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig;
