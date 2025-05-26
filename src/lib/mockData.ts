
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

// --- Initial Mock Data (Defaults if localStorage is empty) ---
const initialMockStudents: StudentData[] = [
  {
    ID_Siswa: "student001",
    Nama_Lengkap: "Siswa Rajin",
    Nama_Panggilan: "Siswa",
    Username: "siswarajin",
    Email: "student@example.com",
    NISN: "0098765432", // 10 digits
    Nomor_Induk: "S1004",
    Kelas: "Kelas 10A IPA",
    Jenis_Kelamin: "Perempuan",
    Tanggal_Lahir: "2008-01-15",
    Alamat: "Jl. Belajar No. 5, Kota Ilmu",
    Nomor_Telepon: "081234567899",
    Program_Studi: "IPA",
    Tanggal_Daftar: "2023-08-01",
    Status_Aktif: true,
    Password_Hash: "password",
    Profil_Foto: "https://placehold.co/100x100.png?text=SR"
  },
  {
    ID_Siswa: "siswa1",
    Nama_Lengkap: "Ahmad Zulkifli Zaini",
    Nama_Panggilan: "Zaini",
    Username: "ahmad.zaini",
    Email: "ahmad.z@example.com",
    NISN: "0012345678", // 10 digits
    Nomor_Induk: "S1001",
    Kelas: "Kelas 10A IPA",
    Jenis_Kelamin: "Laki-laki",
    Tanggal_Lahir: "2007-08-17",
    Alamat: "Jl. Pelajar No. 10, Jakarta",
    Nomor_Telepon: "085678901234",
    Program_Studi: "IPA",
    Tanggal_Daftar: "2023-07-01",
    Status_Aktif: true,
    Password_Hash: "hashed_password_siswa1",
    Profil_Foto: "https://placehold.co/100x100.png?text=AZ"
  },
   {
    ID_Siswa: "siswa2",
    Nama_Lengkap: "Rina Amelia Putri",
    Nama_Panggilan: "Rina",
    Username: "rina.amelia",
    Email: "rina.a@example.com",
    NISN: "0023456789", // 10 digits
    Nomor_Induk: "S1002",
    Kelas: "Kelas 11B IPS",
    Jenis_Kelamin: "Perempuan",
    Tanggal_Lahir: "2006-05-22",
    Alamat: "Jl. Siswa No. 20, Bandung",
    Nomor_Telepon: "085678901235",
    Program_Studi: "IPS",
    Tanggal_Daftar: "2022-07-01",
    Status_Aktif: true,
    Password_Hash: "hashed_password_siswa2",
    Profil_Foto: "https://placehold.co/100x100.png?text=RP"
  },
  {
    ID_Siswa: "siswa3",
    Nama_Lengkap: "Kevin Sanjaya",
    Nama_Panggilan: "Kevin",
    Username: "kevin.sanjaya",
    Email: "kevin.s@example.com",
    NISN: "0034567890", // 10 digits
    Nomor_Induk: "S1003",
    Kelas: "Kelas 12C Bahasa",
    Jenis_Kelamin: "Laki-laki",
    Tanggal_Lahir: "2005-02-10",
    Alamat: "Jl. Prestasi No. 30, Surabaya",
    Nomor_Telepon: "085678901236",
    Program_Studi: "Bahasa",
    Tanggal_Daftar: "2021-07-01",
    Status_Aktif: false,
    Password_Hash: "hashed_password_siswa3",
    Profil_Foto: "https://placehold.co/100x100.png?text=KS"
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
    Kelas_Ajar: ["Kelas 11C", "Kelas 12A"],
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
  { ID_Jurusan: "major003", Nama_Jurusan: "Bahasa dan Sastra", Deskripsi_Jurusan: "Mendalami bahasa dan karya sastra.", Nama_Kepala_Program: "Prof. Dr. Ratih Ayu, M.A." },
];

const initialMockClasses: ClassData[] = [
  { ID_Kelas: 'kelasA', Nama_Kelas: 'Kelas 10A', ID_Guru: 'teacher001', jumlahSiswa: 30, jurusan: "IPA" },
  { ID_Kelas: 'kelasB', Nama_Kelas: 'Kelas 11B', ID_Guru: 'teacher001', jumlahSiswa: 28, jurusan: "IPS" },
  { ID_Kelas: 'kelasC', Nama_Kelas: 'Kelas 12C', ID_Guru: 'teacher001', jumlahSiswa: 32, jurusan: "Bahasa" },
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
  {
    id: 'schedule2',
    title: 'Kuis Sejarah Indonesia',
    date: '2024-08-16',
    time: '10:00 - 11:00',
    classId: 'kelasB',
    teacherId: 'teacher001',
    description: 'Kuis mencakup periode pra-kolonial hingga kemerdekaan.',
    category: 'Kuis',
    quizId: 'quiz2', // Assuming quiz2 exists
  },
];

const initialMockQuestionsQuiz1: Question[] = [
  {
    id: 'q1_1',
    text: 'Kata kunci mana yang digunakan untuk mendeklarasikan variabel dalam JavaScript modern yang dapat diubah nilainya?',
    type: 'multiple-choice',
    options: ['var', 'let', 'const', 'static'],
    correctAnswer: 'let',
    points: 10,
  },
  {
    id: 'q1_2',
    text: 'JavaScript utamanya adalah bahasa skrip sisi klien.',
    type: 'true-false',
    correctAnswer: true,
    points: 5,
  },
  {
    id: 'q1_3',
    text: 'Apa tipe data dari `typeof "AdeptLearn"`?',
    type: 'multiple-choice',
    options: ['Number', 'String', 'Boolean', 'Object'],
    correctAnswer: 'String',
    points: 10,
  },
];

const initialMockQuestionsQuiz2: Question[] = [
  {
    id: 'q2_1',
    text: 'Hook mana yang akan Anda gunakan untuk menambahkan state ke komponen fungsi?',
    type: 'multiple-choice',
    options: ['useEffect', 'useContext', 'useState', 'useReducer'],
    correctAnswer: 'useState',
    points: 10,
  },
  {
    id: 'q2_2',
    text: '`useEffect` digunakan untuk mengelola kejadian siklus hidup komponen dan efek samping.',
    type: 'true-false',
    correctAnswer: true,
    points: 5,
  },
   {
    id: 'q2_3',
    text: 'Dapatkah Hook digunakan di dalam komponen kelas?',
    type: 'true-false',
    correctAnswer: false,
    points: 5,
  },
];

const initialMockQuizzes: Quiz[] = [
  {
    id: 'quiz1',
    title: 'Kuis Dasar JavaScript',
    lessonId: '1',
    teacherId: 'teacher001',
    questions: initialMockQuestionsQuiz1,
    description: "Kuis dasar untuk menguji pemahaman JavaScript awal.",
    assignedClassIds: ['kelasA'],
  },
  {
    id: 'quiz2',
    title: 'Dasar-Dasar React Hooks',
    lessonId: '3',
    teacherId: 'teacher001',
    questions: initialMockQuestionsQuiz2,
    description: "Kuis untuk menguji pemahaman tentang React Hooks.",
    assignedClassIds: ['kelasB', 'kelasC'],
  },
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
  visi: "Menjadi sekolah unggul yang berkarakter, berprestasi, dan berwawasan global.",
  misi: "1. Melaksanakan pembelajaran yang inovatif dan kreatif.\n2. Mengembangkan potensi siswa secara optimal.\n3. Membangun karakter siswa yang berakhlak mulia.",
};

// --- localStorage Helper Functions ---
function loadDataFromStorage<T>(key: string, initialData: T, isSingleObject = false): T {
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (e) {
        console.error(`Gagal memparsing data dari localStorage (key: ${key}):`, e);
        localStorage.setItem(key, JSON.stringify(initialData)); // Simpan data awal jika parsing gagal
        return initialData;
      }
    } else {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
  }
  return initialData; // For SSR or if window is not available
}

function saveDataToStorage<T>(key: string, data: T) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// --- Active Data Arrays & Objects (Loaded from localStorage or initialized) ---
let students: StudentData[] = loadDataFromStorage<StudentData[]>(STUDENTS_STORAGE_KEY, initialMockStudents);
let teachers: TeacherData[] = loadDataFromStorage<TeacherData[]>(TEACHERS_STORAGE_KEY, initialMockTeachers);
let parents: ParentData[] = loadDataFromStorage<ParentData[]>(PARENTS_STORAGE_KEY, initialMockParents);
let majors: MajorData[] = loadDataFromStorage<MajorData[]>(MAJORS_STORAGE_KEY, initialMockMajors);
let classes: ClassData[] = loadDataFromStorage<ClassData[]>(CLASSES_STORAGE_KEY, initialMockClasses);
let schedules: ScheduleItem[] = loadDataFromStorage<ScheduleItem[]>(SCHEDULES_STORAGE_KEY, initialMockSchedules);
let quizzes: Quiz[] = loadDataFromStorage<Quiz[]>(QUIZZES_STORAGE_KEY, initialMockQuizzes);
let schoolProfile: SchoolProfileData = loadDataFromStorage<SchoolProfileData>(SCHOOL_PROFILE_STORAGE_KEY, initialMockSchoolProfile, true);

// --- Student Data Functions ---
export function getStudents(): StudentData[] {
  // Re-load from storage if array is empty on client, to catch updates from other tabs/sessions (basic)
  if (typeof window !== 'undefined' && (!students || students.length === 0) && localStorage.getItem(STUDENTS_STORAGE_KEY)) {
    students = loadDataFromStorage<StudentData[]>(STUDENTS_STORAGE_KEY, initialMockStudents);
  }
  return [...(students || [])];
}

export function getStudentById(id: string): StudentData | undefined {
  const currentStudents = getStudents();
  return currentStudents.find(student => student.ID_Siswa === id);
}

export function addStudent(studentData: Omit<StudentData, 'ID_Siswa' | 'Tanggal_Daftar' | 'Profil_Foto'>): StudentData {
  const newStudent: StudentData = {
    ID_Siswa: `siswa${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...studentData,
    Profil_Foto: `https://placehold.co/100x100.png?text=${studentData.Nama_Lengkap.substring(0,2).toUpperCase()}`,
    Tanggal_Daftar: new Date().toISOString().split('T')[0],
  };
  students = [...getStudents(), newStudent];
  saveDataToStorage(STUDENTS_STORAGE_KEY, students);
  return newStudent;
}

export function updateStudent(updatedStudent: StudentData): boolean {
  let currentStudents = getStudents();
  const index = currentStudents.findIndex(student => student.ID_Siswa === updatedStudent.ID_Siswa);
  if (index !== -1) {
    currentStudents[index] = updatedStudent;
    students = currentStudents;
    saveDataToStorage(STUDENTS_STORAGE_KEY, students);
    return true;
  }
  return false;
}

export function deleteStudentById(studentId: string): boolean {
  let currentStudents = getStudents();
  const initialLength = currentStudents.length;
  students = currentStudents.filter(student => student.ID_Siswa !== studentId);
  if (students.length < initialLength) {
    saveDataToStorage(STUDENTS_STORAGE_KEY, students);
    return true;
  }
  return false;
}

// --- Teacher Data Functions ---
export function getTeachers(): TeacherData[] {
  if (typeof window !== 'undefined' && (!teachers || teachers.length === 0) && localStorage.getItem(TEACHERS_STORAGE_KEY)) {
     teachers = loadDataFromStorage<TeacherData[]>(TEACHERS_STORAGE_KEY, initialMockTeachers);
  }
  return [...(teachers || [])];
}

export function getTeacherById(id: string): TeacherData | undefined {
  const currentTeachers = getTeachers();
  return currentTeachers.find(teacher => teacher.ID_Guru === id);
}

export function addTeacher(teacherData: Omit<TeacherData, 'ID_Guru' | 'Tanggal_Pendaftaran' | 'Profil_Foto' | 'isAdmin'>): TeacherData {
  const newTeacher: TeacherData = {
    ID_Guru: `guru${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...teacherData,
    isAdmin: false,
    Profil_Foto: `https://placehold.co/100x100.png?text=${teacherData.Nama_Lengkap.substring(0,2).toUpperCase()}`,
    Tanggal_Pendaftaran: new Date().toISOString().split('T')[0],
  };
  teachers = [...getTeachers(), newTeacher];
  saveDataToStorage(TEACHERS_STORAGE_KEY, teachers);
  return newTeacher;
}

export function updateTeacher(updatedTeacher: TeacherData): boolean {
  let currentTeachers = getTeachers();
  const index = currentTeachers.findIndex(teacher => teacher.ID_Guru === updatedTeacher.ID_Guru);
  if (index !== -1) {
    currentTeachers[index] = updatedTeacher;
    teachers = currentTeachers;
    saveDataToStorage(TEACHERS_STORAGE_KEY, teachers);
    return true;
  }
  return false;
}

export function deleteTeacherById(teacherId: string): boolean {
  let currentTeachers = getTeachers();
  const initialLength = currentTeachers.length;
  teachers = currentTeachers.filter(teacher => teacher.ID_Guru !== teacherId);
  if (teachers.length < initialLength) {
    saveDataToStorage(TEACHERS_STORAGE_KEY, teachers);
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

    teachers = [...currentTeachers, newAdmin];
    saveDataToStorage(TEACHERS_STORAGE_KEY, teachers);
    return newAdmin;
}

// --- Parent Data Functions ---
export function getParents(): ParentData[] {
  if (typeof window !== 'undefined' && (!parents || parents.length === 0) && localStorage.getItem(PARENTS_STORAGE_KEY)) {
     parents = loadDataFromStorage<ParentData[]>(PARENTS_STORAGE_KEY, initialMockParents);
  }
  return [...(parents || [])];
}

export function addParent(parentData: Omit<ParentData, 'ID_OrangTua' | 'Profil_Foto'>): ParentData {
  const newParent: ParentData = {
    ID_OrangTua: `parent${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...parentData,
    Profil_Foto: `https://placehold.co/100x100.png?text=${parentData.Nama_Lengkap.substring(0,2).toUpperCase()}`,
  };
  parents = [...getParents(), newParent];
  saveDataToStorage(PARENTS_STORAGE_KEY, parents);
  return newParent;
}

export function updateParent(updatedParent: ParentData): boolean {
  let currentParents = getParents();
  const index = currentParents.findIndex(p => p.ID_OrangTua === updatedParent.ID_OrangTua);
  if (index !== -1) {
    currentParents[index] = updatedParent;
    parents = currentParents;
    saveDataToStorage(PARENTS_STORAGE_KEY, parents);
    return true;
  }
  return false;
}

export function deleteParentById(parentId: string): boolean {
  let currentParents = getParents();
  const initialLength = currentParents.length;
  parents = currentParents.filter(p => p.ID_OrangTua !== parentId);
  if (parents.length < initialLength) {
    saveDataToStorage(PARENTS_STORAGE_KEY, parents);
    return true;
  }
  return false;
}

// --- Major Data Functions ---
export function getMajors(): MajorData[] {
  if (typeof window !== 'undefined' && (!majors || majors.length === 0) && localStorage.getItem(MAJORS_STORAGE_KEY)) {
    majors = loadDataFromStorage<MajorData[]>(MAJORS_STORAGE_KEY, initialMockMajors);
  }
  return [...(majors || [])];
}

export function addMajor(newMajorData: Omit<MajorData, 'ID_Jurusan'>): MajorData {
  const newMajor: MajorData = {
    ID_Jurusan: `major${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...newMajorData,
  };
  majors = [...getMajors(), newMajor];
  saveDataToStorage(MAJORS_STORAGE_KEY, majors);
  return newMajor;
}

export function getMajorById(id: string): MajorData | undefined {
  const currentMajors = getMajors();
  return currentMajors.find(major => major.ID_Jurusan === id);
}

export function updateMajor(updatedMajor: MajorData): boolean {
  let currentMajors = getMajors();
  const index = currentMajors.findIndex(major => major.ID_Jurusan === updatedMajor.ID_Jurusan);
  if (index !== -1) {
    currentMajors[index] = updatedMajor;
    majors = currentMajors;
    saveDataToStorage(MAJORS_STORAGE_KEY, majors);
    return true;
  }
  return false;
}

export function deleteMajorById(majorId: string): boolean {
  let currentMajors = getMajors();
  const initialLength = currentMajors.length;
  majors = currentMajors.filter(major => major.ID_Jurusan !== majorId);
  if (majors.length < initialLength) {
    saveDataToStorage(MAJORS_STORAGE_KEY, majors);
    return true;
  }
  return false;
}

// --- Class Data Functions ---
export function getClasses(): ClassData[] {
  if (typeof window !== 'undefined' && (!classes || classes.length === 0) && localStorage.getItem(CLASSES_STORAGE_KEY)) {
    classes = loadDataFromStorage<ClassData[]>(CLASSES_STORAGE_KEY, initialMockClasses);
  }
  return [...(classes || [])];
}

export function getClassById(id: string): ClassData | undefined {
  const currentClasses = getClasses();
  return currentClasses.find(kelas => kelas.ID_Kelas === id);
}

export function updateClass(updatedClass: ClassData): boolean {
  let currentClasses = getClasses();
  const index = currentClasses.findIndex(kelas => kelas.ID_Kelas === updatedClass.ID_Kelas);
  if (index !== -1) {
    currentClasses[index] = updatedClass;
    classes = currentClasses;
    saveDataToStorage(CLASSES_STORAGE_KEY, classes);
    return true;
  }
  return false;
}

// --- Schedule Data Functions ---
export function getSchedules(): ScheduleItem[] {
  if (typeof window !== 'undefined' && (!schedules || schedules.length === 0) && localStorage.getItem(SCHEDULES_STORAGE_KEY)) {
    schedules = loadDataFromStorage<ScheduleItem[]>(SCHEDULES_STORAGE_KEY, initialMockSchedules);
  }
  const allCls = getClasses();
  const allTchrs = getTeachers();
  return (schedules || []).map(schedule => {
      const classInfo = schedule.classId ? allCls.find(c => c.ID_Kelas === schedule.classId) : null;
      const teacherInfo = schedule.teacherId ? allTchrs.find(t => t.ID_Guru === schedule.teacherId) : null;
      return {
        ...schedule,
        className: classInfo ? `${classInfo.Nama_Kelas} - ${classInfo.jurusan}` : (schedule.classId ? schedule.className || 'Info Kelas Hilang' : 'Umum (Semua Kelas)'),
        teacherName: teacherInfo ? teacherInfo.Nama_Lengkap : (schedule.teacherId ? schedule.teacherName || 'Info Guru Hilang' : 'Tidak Ditentukan'),
      };
    });
}

export function getScheduleById(id: string): ScheduleItem | undefined {
  const currentSchedules = getSchedules();
  const sch = currentSchedules.find(schedule => schedule.id === id);
  // Enrichment for className and teacherName is handled by getSchedules itself
  return sch;
}

export function updateSchedule(updatedSchedule: ScheduleItem): boolean {
  let currentSchedules = loadDataFromStorage<ScheduleItem[]>(SCHEDULES_STORAGE_KEY, initialMockSchedules); // Load fresh from storage
  const index = currentSchedules.findIndex(schedule => schedule.id === updatedSchedule.id);
  if (index !== -1) {
    // Remove enrichment before saving
    const { className, teacherName, ...dataToSave } = updatedSchedule;
    currentSchedules[index] = dataToSave;
    schedules = currentSchedules;
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
  schedules = [...loadDataFromStorage<ScheduleItem[]>(SCHEDULES_STORAGE_KEY, initialMockSchedules), newScheduleBase];
  saveDataToStorage(SCHEDULES_STORAGE_KEY, schedules);
  
  // Return enriched schedule
  const allCls = getClasses();
  const allTchrs = getTeachers();
  const classInfo = newScheduleBase.classId ? allCls.find(c => c.ID_Kelas === newScheduleBase.classId) : null;
  const teacherInfo = newScheduleBase.teacherId ? allTchrs.find(t => t.ID_Guru === newScheduleBase.teacherId) : null;
  return {
    ...newScheduleBase,
    className: classInfo ? `${classInfo.Nama_Kelas} - ${classInfo.jurusan}` : (newScheduleBase.classId ? 'Info Kelas Hilang' : 'Umum (Semua Kelas)'),
    teacherName: teacherInfo ? teacherInfo.Nama_Lengkap : (newScheduleBase.teacherId ? 'Info Guru Hilang' : 'Tidak Ditentukan'),
  };
}

// --- Quiz Data Functions ---
export function getQuizzes(): Quiz[] {
  if (typeof window !== 'undefined' && (!quizzes || quizzes.length === 0) && localStorage.getItem(QUIZZES_STORAGE_KEY)) {
    quizzes = loadDataFromStorage<Quiz[]>(QUIZZES_STORAGE_KEY, initialMockQuizzes);
  }
  return [...(quizzes || [])];
}

export function getQuizById(id: string): Quiz | undefined {
  const currentQuizzes = getQuizzes();
  return currentQuizzes.find(quiz => quiz.id === id);
}

export function getQuizzesByTeacherId(teacherId: string): Quiz[] {
  const currentQuizzes = getQuizzes();
  return currentQuizzes.filter(quiz => quiz.teacherId === teacherId);
}

export function addQuiz(quizData: Omit<Quiz, 'id'> & { teacherId: string }): Quiz {
  const newQuiz: Quiz = {
    id: `quiz${Date.now()}${Math.floor(Math.random() * 100)}`,
    ...quizData,
  };
  quizzes = [...getQuizzes(), newQuiz];
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
    quizzes = currentQuizzes;
    saveDataToStorage(QUIZZES_STORAGE_KEY, quizzes);
    return true;
  }
  return false;
}

// --- School Profile Functions ---
export function getSchoolProfile(): SchoolProfileData {
  if (typeof window !== 'undefined' && (!schoolProfile || Object.keys(schoolProfile).length === 0) && localStorage.getItem(SCHOOL_PROFILE_STORAGE_KEY)) {
    schoolProfile = loadDataFromStorage<SchoolProfileData>(SCHOOL_PROFILE_STORAGE_KEY, initialMockSchoolProfile, true);
  }
  return schoolProfile || initialMockSchoolProfile; // Fallback if still null
}

export function updateSchoolProfile(updatedProfile: SchoolProfileData): SchoolProfileData {
  schoolProfile = updatedProfile;
  saveDataToStorage(SCHOOL_PROFILE_STORAGE_KEY, schoolProfile);
  return schoolProfile;
}


// --- Lesson Data (Still Static, not using localStorage for now) ---
export const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Pengenalan JavaScript',
    content: `
JavaScript adalah bahasa pemrograman serbaguna yang banyak digunakan, terutama dikenal karena perannya dalam pengembangan web.
Ini memungkinkan Anda untuk menambahkan interaktivitas ke situs web, membangun server web, membuat aplikasi seluler, dan banyak lagi.

### Konsep Utama:
- **Variabel**: Wadah untuk menyimpan nilai data. (misalnya, \`let nama = "AdeptLearn";\`)
- **Tipe Data**: Jenis data yang dapat disimpan, seperti string (teks), angka, boolean (logika).
- **Operator**: Simbol yang melakukan operasi pada operan (misalnya, \`+\`, \`-\`, \`*\`, \`/\`).
- **Alur Kontrol**: Struktur seperti pernyataan \`if...else\` dan loop (\`for\`, \`while\`) yang mengontrol urutan eksekusi kode.
- **Fungsi**: Blok kode yang dapat digunakan kembali yang melakukan tugas tertentu.

Pelajaran ini akan membahas dasar-dasarnya untuk memulai.
    `,
    videoUrl: 'https://placehold.co/600x338.png?text=Video+JS',
    quizId: 'quiz1',
    estimatedTime: "30 menit",
    difficulty: "Pemula",
  },
  {
    id: '2',
    title: 'Variabel dan Tipe Data dalam JS',
    content: `
Dalam JavaScript, variabel dideklarasikan menggunakan \`let\`, \`const\`, atau (lebih jarang sekarang) \`var\`.
- \`let\`: Mendeklarasikan variabel lokal lingkup blok, secara opsional menginisialisasinya ke suatu nilai.
- \`const\`: Mendeklarasikan konstanta bernama lingkup blok yang hanya bisa dibaca. Nilainya tidak dapat diubah.

### Tipe Data Umum:
- **String (Teks)**: Data tekstual (misalnya, \`"Halo, Dunia!"\`).
- **Number (Angka)**: Data numerik, termasuk bilangan bulat dan bilangan titik-mengambang (misalnya, \`42\`, \`3.14\`).
- **Boolean (Logika)**: Tipe data logis yang hanya dapat memiliki dua nilai: \`true\` atau \`false\`.
- **Object (Objek)**: Kumpulan pasangan kunci-nilai.
- **Array (Larik)**: Daftar nilai yang terurut.
- **null (Nihil)**: Mewakili ketiadaan yang disengaja dari nilai objek apa pun.
- **undefined (Tidak Terdefinisi)**: Menunjukkan bahwa variabel telah dideklarasikan tetapi belum diberi nilai.
    `,
    estimatedTime: "45 menit",
    difficulty: "Pemula",
  },
  {
    id: '3',
    title: 'Memahami React Hooks',
    content: `
Hook adalah fungsi yang memungkinkan Anda "mengaitkan diri" ke status React dan fitur siklus hidup dari komponen fungsi.
Hook tidak bekerja di dalam kelas — mereka memungkinkan Anda menggunakan React tanpa kelas.

### Hook Umum:
- **useState (Mengelola State)**: Memungkinkan Anda menambahkan status React ke komponen fungsi.
- **useEffect (Efek Samping)**: Memungkinkan Anda melakukan efek samping dalam komponen fungsi (misalnya, pengambilan data, langganan, mengubah DOM secara manual).
- **useContext (Konteks)**: Menerima objek konteks (nilai yang dikembalikan dari \`React.createContext\`) dan mengembalikan nilai konteks saat ini untuk konteks tersebut.
- **useReducer (Alternatif State)**: Alternatif untuk \`useState\`. Menerima reducer tipe \`(state, action) => newState\`, dan mengembalikan status saat ini yang dipasangkan dengan metode \`dispatch\`.
    `,
    videoUrl: 'https://placehold.co/600x338.png?text=Video+React+Hooks',
    quizId: 'quiz2',
    estimatedTime: "1 jam",
    difficulty: "Menengah",
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return mockLessons.find(lesson => lesson.id === id);
}


// --- User Progress & Chart Data (Masih statis, karena biasanya sangat dinamis dari backend) ---
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

const totalMockLessons = mockLessons.length;
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

    