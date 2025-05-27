
import type { Lesson, Quiz, Question, StudentData, TeacherData, ParentData, UserProgress, LessonStatusCounts, SchoolProfileData, ClassData, MajorData, ScheduleItem, LandingPageSlide, AnnouncementData } from './types';
import type { ChartConfig } from "@/components/ui/chart";
import { format } from 'date-fns';

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
const ANNOUNCEMENTS_STORAGE_KEY = 'adeptlearn-announcements';

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
    Kelas: "Kelas 10A",
    Jenis_Kelamin: "Perempuan",
    Tanggal_Lahir: "2008-01-15",
    Alamat: "Jl. Belajar No. 5, Kota Ilmu",
    Nomor_Telepon: "081234567899",
    Program_Studi: "Ilmu Pengetahuan Alam (IPA)",
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
    Password_Hash: "password",
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
    Kelas_Ajar: ["Kelas 10A", "Kelas 11B"],
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

const initialLandingPageSlides: LandingPageSlide[] = [
  { imageUrl: "https://placehold.co/1200x600.png?text=Slide+1+AdeptLearn", description: "Selamat Datang di Platform Pembelajaran Adaptif Kami!" },
  { imageUrl: "https://placehold.co/1200x600.png?text=Slide+2+Fitur+Unggulan", description: "Temukan jalur belajar yang dipersonalisasi khusus untuk Anda." },
  { imageUrl: "https://placehold.co/1200x600.png?text=Slide+3+Bergabunglah+Sekarang", description: "Mulai perjalanan Anda menuju penguasaan ilmu pengetahuan hari ini." },
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
  landingPageSlides: initialLandingPageSlides,
  visi: "Menjadi sekolah unggul yang berkarakter, berprestasi, dan berwawasan global.",
  misi: "1. Melaksanakan pembelajaran yang inovatif dan kreatif.\n2. Mengembangkan potensi siswa secara optimal.\n3. Membangun karakter siswa yang berakhlak mulia.",
};

const initialMockLessons: Lesson[] = [
  { id: '1', title: 'Pengenalan JavaScript', content: 'JavaScript adalah bahasa pemrograman serbaguna...', videoUrl: 'https://placehold.co/600x338.png?text=Video+JS', quizId: 'quiz1', estimatedTime: "30 menit", difficulty: "Pemula" },
  { id: '2', title: 'Variabel dan Tipe Data dalam JS', content: 'Dalam JavaScript, variabel dideklarasikan...', estimatedTime: "45 menit", difficulty: "Pemula" },
  { id: '3', title: 'Memahami React Hooks', content: 'Hook adalah fungsi yang memungkinkan Anda...', videoUrl: 'https://placehold.co/600x338.png?text=Video+React+Hooks', quizId: 'quiz2', estimatedTime: "1 jam", difficulty: "Menengah" },
];

const initialMockAnnouncements: AnnouncementData[] = [];


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
let announcements: AnnouncementData[] = loadDataFromStorage<AnnouncementData[]>(ANNOUNCEMENTS_STORAGE_KEY, initialMockAnnouncements);


// --- Student Data Functions ---
export function getStudents(): StudentData[] {
  if (typeof window !== 'undefined') { 
    students = loadDataFromStorage<StudentData[]>(STUDENTS_STORAGE_KEY, initialMockStudents);
  }
  return [...students];
}
export function getStudentById(id: string): StudentData | undefined {
  return getStudents().find(student => student.ID_Siswa === id);
}
export function addStudent(studentData: Omit<StudentData, 'ID_Siswa' | 'Tanggal_Daftar' | 'Profil_Foto' | 'Status_Aktif'>): StudentData {
  const currentStudents = getStudents();
  const newStudent: StudentData = {
    ID_Siswa: `siswa${Date.now()}${Math.floor(Math.random() * 100)}`,
    Nama_Lengkap: studentData.Nama_Lengkap,
    Nama_Panggilan: studentData.Nama_Panggilan,
    Jenis_Kelamin: studentData.Jenis_Kelamin,
    Tanggal_Lahir: studentData.Tanggal_Lahir,
    Alamat: studentData.Alamat || "",
    Email: studentData.Email,
    Nomor_Telepon: studentData.Nomor_Telepon || "",
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
  students = [...currentStudents, newStudent];
  saveDataToStorage(STUDENTS_STORAGE_KEY, students);
  return newStudent;
}
export function updateStudent(updatedStudent: StudentData): boolean {
  let currentStudents = getStudents();
  const index = currentStudents.findIndex(student => student.ID_Siswa === updatedStudent.ID_Siswa);
  if (index !== -1) {
    currentStudents[index] = updatedStudent;
    saveDataToStorage(STUDENTS_STORAGE_KEY, currentStudents);
    students = currentStudents; 
    return true;
  }
  return false;
}
export function deleteStudentById(studentId: string): boolean {
  let currentStudents = getStudents();
  const initialLength = currentStudents.length;
  currentStudents = currentStudents.filter(student => student.ID_Siswa !== studentId);
  if (currentStudents.length < initialLength) {
    saveDataToStorage(STUDENTS_STORAGE_KEY, currentStudents);
    students = currentStudents; 
    return true;
  }
  return false;
}

// --- Teacher Data Functions ---
export function getTeachers(): TeacherData[] {
  if (typeof window !== 'undefined') {
    teachers = loadDataFromStorage<TeacherData[]>(TEACHERS_STORAGE_KEY, initialMockTeachers);
  }
  return [...teachers];
}
export function getTeacherById(id: string): TeacherData | undefined {
  return getTeachers().find(teacher => teacher.ID_Guru === id);
}
export function addTeacher(teacherData: Omit<TeacherData, 'ID_Guru' | 'Tanggal_Pendaftaran' | 'Profil_Foto' | 'isAdmin'>): TeacherData {
  const currentTeachers = getTeachers();
  const newTeacher: TeacherData = {
    ID_Guru: `guru${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...teacherData,
    isAdmin: false,
    Profil_Foto: `https://placehold.co/100x100.png?text=${teacherData.Nama_Lengkap.substring(0,2).toUpperCase()}`,
    Tanggal_Pendaftaran: new Date().toISOString().split('T')[0],
  };
  teachers = [...currentTeachers, newTeacher];
  saveDataToStorage(TEACHERS_STORAGE_KEY, teachers);
  return newTeacher;
}
export function updateTeacher(updatedTeacher: TeacherData): boolean {
  let currentTeachers = getTeachers();
  const index = currentTeachers.findIndex(teacher => teacher.ID_Guru === updatedTeacher.ID_Guru);
  if (index !== -1) {
    currentTeachers[index] = updatedTeacher;
    saveDataToStorage(TEACHERS_STORAGE_KEY, currentTeachers);
    teachers = currentTeachers; 
    return true;
  }
  return false;
}
export function deleteTeacherById(teacherId: string): boolean {
  let currentTeachers = getTeachers();
  const initialLength = currentTeachers.length;
  currentTeachers = currentTeachers.filter(teacher => teacher.ID_Guru !== teacherId);
  if (currentTeachers.length < initialLength) {
    saveDataToStorage(TEACHERS_STORAGE_KEY, currentTeachers);
    teachers = currentTeachers; 
    return true;
  }
  return false;
}
export function addAdminUser(newAdminData: Omit<TeacherData, 'ID_Guru' | 'Tanggal_Pendaftaran' | 'Profil_Foto'>): TeacherData | null {
    let currentTeachers = getTeachers();
    const emailExists = currentTeachers.some(teacher => teacher.Email === newAdminData.Email);
    const usernameExists = currentTeachers.some(teacher => teacher.Username === newAdminData.Username);

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
    currentTeachers = [...currentTeachers, newAdmin];
    saveDataToStorage(TEACHERS_STORAGE_KEY, currentTeachers);
    teachers = currentTeachers; 
    return newAdmin;
}

// --- Parent Data Functions ---
export function getParents(): ParentData[] {
  if (typeof window !== 'undefined') {
    parents = loadDataFromStorage<ParentData[]>(PARENTS_STORAGE_KEY, initialMockParents);
  }
  return [...parents];
}
export function getParentById(id: string): ParentData | undefined {
  return getParents().find(p => p.ID_OrangTua === id);
}
export function addParent(parentData: Omit<ParentData, 'ID_OrangTua' | 'Profil_Foto' | 'Status_Aktif' | 'Anak_Terkait'>): ParentData {
  const currentParents = getParents();
  const newParent: ParentData = {
    ID_OrangTua: `parent${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...parentData,
    Status_Aktif: true,
    Anak_Terkait: [],
    Profil_Foto: `https://placehold.co/100x100.png?text=${parentData.Nama_Lengkap.substring(0,2).toUpperCase()}`,
  };
  parents = [...currentParents, newParent];
  saveDataToStorage(PARENTS_STORAGE_KEY, parents);
  return newParent;
}
export function updateParent(updatedParent: ParentData): boolean {
  let currentParents = getParents();
  const index = currentParents.findIndex(p => p.ID_OrangTua === updatedParent.ID_OrangTua);
  if (index !== -1) {
    currentParents[index] = updatedParent;
    saveDataToStorage(PARENTS_STORAGE_KEY, currentParents);
    parents = currentParents; 
    return true;
  }
  return false;
}
export function deleteParentById(parentId: string): boolean {
  let currentParents = getParents();
  const initialLength = currentParents.length;
  currentParents = currentParents.filter(p => p.ID_OrangTua !== parentId);
  if (currentParents.length < initialLength) {
    saveDataToStorage(PARENTS_STORAGE_KEY, currentParents);
    parents = currentParents; 
    return true;
  }
  return false;
}

// --- Major Data Functions ---
export function getMajors(): MajorData[] {
  if (typeof window !== 'undefined') {
    majors = loadDataFromStorage<MajorData[]>(MAJORS_STORAGE_KEY, initialMockMajors);
  }
  return [...majors];
}
export function getMajorById(id: string): MajorData | undefined {
  return getMajors().find(major => major.ID_Jurusan === id);
}
export function addMajor(newMajorData: Omit<MajorData, 'ID_Jurusan'>): MajorData {
  const currentMajors = getMajors();
  const newMajor: MajorData = {
    ID_Jurusan: `major${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...newMajorData,
  };
  majors = [...currentMajors, newMajor];
  saveDataToStorage(MAJORS_STORAGE_KEY, majors);
  return newMajor;
}
export function updateMajor(updatedMajor: MajorData): boolean {
  let currentMajors = getMajors();
  const index = currentMajors.findIndex(major => major.ID_Jurusan === updatedMajor.ID_Jurusan);
  if (index !== -1) {
    currentMajors[index] = updatedMajor;
    saveDataToStorage(MAJORS_STORAGE_KEY, currentMajors);
    majors = currentMajors; 
    return true;
  }
  return false;
}
export function deleteMajorById(majorId: string): boolean {
  let currentMajors = getMajors();
  const initialLength = currentMajors.length;
  currentMajors = currentMajors.filter(major => major.ID_Jurusan !== majorId);
  if (currentMajors.length < initialLength) {
    saveDataToStorage(MAJORS_STORAGE_KEY, currentMajors);
    majors = currentMajors; 
    return true;
  }
  return false;
}

// --- Class Data Functions ---
export function getClasses(): ClassData[] {
  if (typeof window !== 'undefined') {
    classes = loadDataFromStorage<ClassData[]>(CLASSES_STORAGE_KEY, initialMockClasses);
  }
  return [...classes];
}
export function getClassById(id: string): ClassData | undefined {
  return getClasses().find(kelas => kelas.ID_Kelas === id);
}
export function addClass(classData: Omit<ClassData, 'ID_Kelas'>): ClassData {
  const currentClasses = getClasses();
  const newClass: ClassData = {
    ID_Kelas: `class${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...classData,
  };
  classes = [...currentClasses, newClass];
  saveDataToStorage(CLASSES_STORAGE_KEY, classes);
  return newClass;
}
export function updateClass(updatedClass: ClassData): boolean {
  let currentClasses = getClasses();
  const index = currentClasses.findIndex(kelas => kelas.ID_Kelas === updatedClass.ID_Kelas);
  if (index !== -1) {
    currentClasses[index] = updatedClass;
    saveDataToStorage(CLASSES_STORAGE_KEY, currentClasses);
    classes = currentClasses; 
    return true;
  }
  return false;
}
export function deleteClassById(classId: string): boolean {
  let currentClasses = getClasses();
  const initialLength = currentClasses.length;
  currentClasses = currentClasses.filter(kelas => kelas.ID_Kelas !== classId);
  if (currentClasses.length < initialLength) {
    saveDataToStorage(CLASSES_STORAGE_KEY, currentClasses);
    classes = currentClasses; 
    return true;
  }
  return false;
}

// --- Schedule Data Functions ---
export function getSchedules(): ScheduleItem[] {
  if (typeof window !== 'undefined') {
    schedules = loadDataFromStorage<ScheduleItem[]>(SCHEDULES_STORAGE_KEY, initialMockSchedules);
  }
  return [...schedules].map(schedule => {
      const classInfo = schedule.classId ? getClasses().find(c => c.ID_Kelas === schedule.classId) : null;
      const teacherInfo = schedule.teacherId ? getTeachers().find(t => t.ID_Guru === schedule.teacherId) : null;
      return {
        ...schedule,
        className: classInfo ? `${classInfo.Nama_Kelas} - ${classInfo.jurusan}` : (schedule.classId ? schedule.className || 'Info Kelas Hilang' : 'Umum (Semua Kelas)'),
        teacherName: teacherInfo ? teacherInfo.Nama_Lengkap : (schedule.teacherId ? schedule.teacherName || 'Info Guru Hilang' : 'Tidak Ditentukan'),
      };
    });
}
export function getScheduleById(id: string): ScheduleItem | undefined {
  // getSchedules() sudah mengembalikan data yang diperkaya, jadi kita cari di sana
  return getSchedules().find(schedule => schedule.id === id);
}

export function updateSchedule(updatedSchedule: ScheduleItem): boolean {
  let rawSchedules = loadDataFromStorage<ScheduleItem[]>(SCHEDULES_STORAGE_KEY, initialMockSchedules);
  const index = rawSchedules.findIndex(schedule => schedule.id === updatedSchedule.id);

  if (index !== -1) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { className, teacherName, ...dataToSave } = updatedSchedule; 
    rawSchedules[index] = dataToSave;
    saveDataToStorage(SCHEDULES_STORAGE_KEY, rawSchedules);
    schedules = rawSchedules; 
    return true;
  }
  return false;
}
export function addSchedule(newScheduleData: Omit<ScheduleItem, 'id' | 'className' | 'teacherName'>): ScheduleItem {
  let rawSchedules = loadDataFromStorage<ScheduleItem[]>(SCHEDULES_STORAGE_KEY, initialMockSchedules);
  const newScheduleBase: Omit<ScheduleItem, 'className' | 'teacherName'> = {
    id: `schedule${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...newScheduleData,
  };
  rawSchedules = [...rawSchedules, newScheduleBase];
  saveDataToStorage(SCHEDULES_STORAGE_KEY, rawSchedules);
  schedules = rawSchedules; 

  const classInfo = newScheduleBase.classId ? getClasses().find(c => c.ID_Kelas === newScheduleBase.classId) : null;
  const teacherInfo = newScheduleBase.teacherId ? getTeachers().find(t => t.ID_Guru === newScheduleBase.teacherId) : null;
  return {
    ...newScheduleBase,
    className: classInfo ? `${classInfo.Nama_Kelas} - ${classInfo.jurusan}` : (newScheduleBase.classId ? 'Info Kelas Hilang' : 'Umum (Semua Kelas)'),
    teacherName: teacherInfo ? teacherInfo.Nama_Lengkap : (newScheduleBase.teacherId ? 'Info Guru Hilang' : 'Tidak Ditentukan'),
  };
}
export function deleteScheduleById(scheduleId: string): boolean {
  let rawSchedules = loadDataFromStorage<ScheduleItem[]>(SCHEDULES_STORAGE_KEY, initialMockSchedules);
  const initialLength = rawSchedules.length;
  rawSchedules = rawSchedules.filter(schedule => schedule.id !== scheduleId);
  if (rawSchedules.length < initialLength) {
    saveDataToStorage(SCHEDULES_STORAGE_KEY, rawSchedules);
    schedules = rawSchedules; 
    return true;
  }
  return false;
}

// --- Quiz Data Functions ---
export function getQuizzes(): Quiz[] {
  if (typeof window !== 'undefined') {
    quizzes = loadDataFromStorage<Quiz[]>(QUIZZES_STORAGE_KEY, initialMockQuizzes);
  }
  return [...quizzes];
}
export function getQuizById(id: string): Quiz | undefined {
  return getQuizzes().find(quiz => quiz.id === id);
}
export function getQuizzesByTeacherId(teacherId: string): Quiz[] {
  return getQuizzes().filter(quiz => quiz.teacherId === teacherId);
}
export function addQuiz(quizData: Omit<Quiz, 'id'> & { teacherId?: string }): Quiz {
  const currentQuizzes = getQuizzes();
  const newQuiz: Quiz = {
    id: `quiz${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...quizData,
  };
  quizzes = [...currentQuizzes, newQuiz];
  saveDataToStorage(QUIZZES_STORAGE_KEY, quizzes);
  return newQuiz;
}
export function updateQuiz(updatedQuiz: Quiz): boolean {
  let currentQuizzes = getQuizzes();
  const index = currentQuizzes.findIndex(quiz => quiz.id === updatedQuiz.id);
  if (index !== -1) {
    currentQuizzes[index] = {
      ...currentQuizzes[index],
      ...updatedQuiz,
      questions: updatedQuiz.questions.map(q => ({
        ...q,
        id: q.id || `q_updated_${Date.now()}${Math.random().toString(36).substring(2,7)}`,
      })),
    };
    saveDataToStorage(QUIZZES_STORAGE_KEY, currentQuizzes);
    quizzes = currentQuizzes; 
    return true;
  }
  return false;
}
export function deleteQuizById(quizId: string): boolean {
  let currentQuizzes = getQuizzes();
  const initialLength = currentQuizzes.length;
  currentQuizzes = currentQuizzes.filter(quiz => quiz.id !== quizId);
  if (currentQuizzes.length < initialLength) {
    saveDataToStorage(QUIZZES_STORAGE_KEY, currentQuizzes);
    quizzes = currentQuizzes; 
    return true;
  }
  return false;
}

// --- School Profile Functions ---
export function getSchoolProfile(): SchoolProfileData {
  if (typeof window !== 'undefined') {
    schoolProfile = loadDataFromStorage<SchoolProfileData>(SCHOOL_PROFILE_STORAGE_KEY, initialMockSchoolProfile, true);
  }
  return schoolProfile;
}
export function updateSchoolProfile(updatedProfile: SchoolProfileData): SchoolProfileData {
  saveDataToStorage(SCHOOL_PROFILE_STORAGE_KEY, updatedProfile);
  schoolProfile = updatedProfile; 
  return schoolProfile;
}

// --- Lesson Data Functions ---
export function getLessons(): Lesson[] {
  if (typeof window !== 'undefined') {
    lessons = loadDataFromStorage<Lesson[]>(LESSONS_STORAGE_KEY, initialMockLessons);
  }
  return [...lessons];
}
export function getLessonById(id: string): Lesson | undefined {
  return getLessons().find(lesson => lesson.id === id);
}
export function addLesson(lessonData: Omit<Lesson, 'id'>): Lesson {
  const currentLessons = getLessons();
  const newLesson: Lesson = {
    id: `lesson${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...lessonData,
  };
  lessons = [...currentLessons, newLesson];
  saveDataToStorage(LESSONS_STORAGE_KEY, lessons);
  return newLesson;
}
export function updateLesson(updatedLesson: Lesson): boolean {
  let currentLessons = getLessons();
  const index = currentLessons.findIndex(lesson => lesson.id === updatedLesson.id);
  if (index !== -1) {
    currentLessons[index] = updatedLesson;
    saveDataToStorage(LESSONS_STORAGE_KEY, currentLessons);
    lessons = currentLessons; 
    return true;
  }
  return false;
}
export function deleteLesson(lessonId: string): boolean {
  let currentLessons = getLessons();
  const initialLength = currentLessons.length;
  currentLessons = currentLessons.filter(lesson => lesson.id !== lessonId);
  if (currentLessons.length < initialLength) {
    saveDataToStorage(LESSONS_STORAGE_KEY, currentLessons);
    lessons = currentLessons; 
    return true;
  }
  return false;
}

// --- Announcement Data Functions ---
export function getAnnouncements(): AnnouncementData[] {
  if (typeof window !== 'undefined') {
    announcements = loadDataFromStorage<AnnouncementData[]>(ANNOUNCEMENTS_STORAGE_KEY, initialMockAnnouncements);
  }
  return [...announcements];
}

export function addAnnouncement(announcementData: Omit<AnnouncementData, 'id' | 'createdAt'>): AnnouncementData {
  const currentAnnouncements = getAnnouncements();
  const newAnnouncement: AnnouncementData = {
    id: `announcement${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...announcementData,
    createdAt: new Date().toISOString(),
  };
  announcements = [...currentAnnouncements, newAnnouncement];
  saveDataToStorage(ANNOUNCEMENTS_STORAGE_KEY, announcements);
  return newAnnouncement;
}

export function deleteAnnouncement(announcementId: string): boolean {
  let currentAnnouncements = getAnnouncements();
  const initialLength = currentAnnouncements.length;
  currentAnnouncements = currentAnnouncements.filter(ann => ann.id !== announcementId);
  if (currentAnnouncements.length < initialLength) {
    saveDataToStorage(ANNOUNCEMENTS_STORAGE_KEY, currentAnnouncements);
    announcements = currentAnnouncements;
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

const totalLessonsCount = getLessons().length;
const completedCount = mockUserProgress ? mockUserProgress.completedLessons.length : 0;
const inProgressCount = mockUserProgress && mockUserProgress.inProgressLessons ? mockUserProgress.inProgressLessons.length : 0;
const notStartedCount = totalLessonsCount - completedCount - inProgressCount;

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
