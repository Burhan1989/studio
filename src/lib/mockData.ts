
import type { Lesson, Quiz, Question, StudentData, TeacherData, ParentData, UserProgress, LessonStatusCounts, SchoolProfileData, ClassData, MajorData } from './types';
import type { ChartConfig } from "@/components/ui/chart";

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
    videoUrl: 'https://placehold.co/600x338.png',
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
    videoUrl: 'https://placehold.co/600x338.png',
    quizId: 'quiz2',
    estimatedTime: "1 jam",
    difficulty: "Menengah",
  },
];

export const mockQuestionsQuiz1: Question[] = [
  {
    id: 'q1_1',
    text: 'Kata kunci mana yang digunakan untuk mendeklarasikan variabel dalam JavaScript modern yang dapat diubah nilainya?',
    type: 'multiple-choice',
    options: ['var', 'let', 'const', 'static'],
    correctAnswer: 'let',
  },
  {
    id: 'q1_2',
    text: 'JavaScript utamanya adalah bahasa skrip sisi klien.',
    type: 'true-false',
    correctAnswer: true,
  },
  {
    id: 'q1_3',
    text: 'Apa tipe data dari `typeof "AdeptLearn"`?',
    type: 'multiple-choice',
    options: ['Number', 'String', 'Boolean', 'Object'],
    correctAnswer: 'String',
  },
];

export const mockQuestionsQuiz2: Question[] = [
  {
    id: 'q2_1',
    text: 'Hook mana yang akan Anda gunakan untuk menambahkan state ke komponen fungsi?',
    type: 'multiple-choice',
    options: ['useEffect', 'useContext', 'useState', 'useReducer'],
    correctAnswer: 'useState',
  },
  {
    id: 'q2_2',
    text: '`useEffect` digunakan untuk mengelola kejadian siklus hidup komponen dan efek samping.',
    type: 'true-false',
    correctAnswer: true,
  },
   {
    id: 'q2_3',
    text: 'Dapatkah Hook digunakan di dalam komponen kelas?',
    type: 'true-false',
    correctAnswer: false,
  },
];


export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz1',
    title: 'Kuis Dasar JavaScript',
    lessonId: '1',
    questions: mockQuestionsQuiz1,
  },
  {
    id: 'quiz2',
    title: 'Dasar-Dasar React Hooks',
    lessonId: '3',
    questions: mockQuestionsQuiz2,
  },
];

export const mockStudents: StudentData[] = [
  {
    ID_Siswa: "student001",
    Nama_Lengkap: "Siswa Rajin",
    Nama_Panggilan: "Siswa",
    Username: "siswarajin",
    Email: "student@example.com",
    NISN: "0098765432",
    Nomor_Induk: "S1004",
    Kelas: "Kelas 10A IPA", // Match one of the mockClassesForParent
    Jenis_Kelamin: "Perempuan",
    Tanggal_Lahir: "2008-01-15",
    Alamat: "Jl. Belajar No. 5, Kota Ilmu",
    Nomor_Telepon: "081234567899",
    Program_Studi: "IPA",
    Tanggal_Daftar: "2023-08-01",
    Status_Aktif: true,
    Password_Hash: "hashed_password_siswa_rajin",
    Profil_Foto: "https://placehold.co/100x100.png"
  },
  {
    ID_Siswa: "siswa1",
    Nama_Lengkap: "Ahmad Zulkifli Zaini",
    Nama_Panggilan: "Zaini",
    Username: "ahmad.zaini",
    Email: "ahmad.z@example.com",
    NISN: "0012345678",
    Nomor_Induk: "S1001",
    Kelas: "Kelas 10A IPA", // Match one of the mockClassesForParent
    Jenis_Kelamin: "Laki-laki",
    Tanggal_Lahir: "2007-08-17",
    Alamat: "Jl. Pelajar No. 10, Jakarta",
    Nomor_Telepon: "085678901234",
    Program_Studi: "IPA",
    Tanggal_Daftar: "2023-07-01",
    Status_Aktif: true,
    Password_Hash: "hashed_password_siswa1",
    Profil_Foto: "https://placehold.co/100x100.png"
  },
   {
    ID_Siswa: "siswa2",
    Nama_Lengkap: "Rina Amelia Putri",
    Nama_Panggilan: "Rina",
    Username: "rina.amelia",
    Email: "rina.a@example.com",
    NISN: "0023456789",
    Nomor_Induk: "S1002",
    Kelas: "Kelas 11B IPS", // Match one of the mockClassesForParent
    Jenis_Kelamin: "Perempuan",
    Tanggal_Lahir: "2006-05-22",
    Alamat: "Jl. Siswa No. 20, Bandung",
    Nomor_Telepon: "085678901235",
    Program_Studi: "IPS",
    Tanggal_Daftar: "2022-07-01",
    Status_Aktif: true,
    Password_Hash: "hashed_password_siswa2",
    Profil_Foto: "https://placehold.co/100x100.png"
  },
  {
    ID_Siswa: "siswa3",
    Nama_Lengkap: "Kevin Sanjaya",
    Nama_Panggilan: "Kevin",
    Username: "kevin.sanjaya",
    Email: "kevin.s@example.com",
    NISN: "0034567890",
    Nomor_Induk: "S1003",
    Kelas: "Kelas 12C Bahasa", // Match one of the mockClassesForParent
    Jenis_Kelamin: "Laki-laki",
    Tanggal_Lahir: "2005-02-10",
    Alamat: "Jl. Prestasi No. 30, Surabaya",
    Nomor_Telepon: "085678901236",
    Program_Studi: "Bahasa",
    Tanggal_Daftar: "2021-07-01",
    Status_Aktif: false,
    Password_Hash: "hashed_password_siswa3",
    Profil_Foto: "https://placehold.co/100x100.png"
  },
];

export const mockTeachers: TeacherData[] = [
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
    Password_Hash: "hashed_password_guru_inovatif",
    Tanggal_Pendaftaran: "2015-06-01",
    Jabatan: "Guru Senior Kimia",
    Profil_Foto: "https://placehold.co/100x100.png"
  },
  {
    ID_Guru: "guru1",
    Nama_Lengkap: "Dr. Budi Darmawan, S.Kom., M.Cs.",
    Username: "budi.darmawan",
    Email: "budi.d@example.com",
    Mata_Pelajaran: "Matematika Lanjut",
    Kelas_Ajar: ["Kelas 11A", "Kelas 12B"],
    Jenis_Kelamin: "Laki-laki",
    Tanggal_Lahir: "1980-05-15",
    Alamat: "Jl. Pendidikan No. 1, Jakarta",
    Nomor_Telepon: "081234567890",
    Status_Aktif: true,
    Password_Hash: "hashed_password_guru1",
    Tanggal_Pendaftaran: "2010-08-01",
    Jabatan: "Guru Senior Matematika",
    Profil_Foto: "https://placehold.co/100x100.png"
  },
  {
    ID_Guru: "guru2",
    Nama_Lengkap: "Siti Nurhaliza, M.Pd.",
    Username: "siti.nurhaliza",
    Email: "siti.n@example.com",
    Mata_Pelajaran: "Bahasa Indonesia",
    Kelas_Ajar: ["Kelas 10A", "Kelas 10C"],
    Jenis_Kelamin: "Perempuan",
    Tanggal_Lahir: "1985-11-20",
    Alamat: "Jl. Cendekia No. 5, Bandung",
    Nomor_Telepon: "081234567891",
    Status_Aktif: true,
    Password_Hash: "hashed_password_guru2",
    Tanggal_Pendaftaran: "2012-07-15",
    Jabatan: "Guru Bahasa Indonesia",
    Profil_Foto: "https://placehold.co/100x100.png"
  },
  {
    ID_Guru: "guru3",
    Nama_Lengkap: "Prof. Dr. Agus Salim, M.Sc.",
    Username: "agus.salim",
    Email: "agus.s@example.com",
    Mata_Pelajaran: "Fisika Dasar",
    Kelas_Ajar: ["Kelas 11B"],
    Jenis_Kelamin: "Laki-laki",
    Tanggal_Lahir: "1975-03-10",
    Alamat: "Jl. Ilmuwan No. 12, Surabaya",
    Nomor_Telepon: "081234567892",
    Status_Aktif: false,
    Password_Hash: "hashed_password_guru3",
    Tanggal_Pendaftaran: "2005-01-20",
    Jabatan: "Kepala Jurusan IPA",
    Profil_Foto: "https://placehold.co/100x100.png"
  },
];

export const mockParents: ParentData[] = [
    {
        ID_OrangTua: "parent001",
        Nama_Lengkap: "Orang Tua Bijak",
        Username: "ortubijak",
        Email: "parent@example.com",
        Nomor_Telepon: "081122334455",
        Status_Aktif: true,
        Password_Hash: "hashed_password_parent",
        Profil_Foto: "https://placehold.co/100x100.png",
        Anak_Terkait: [
            { ID_Siswa: "student001", Nama_Siswa: "Siswa Rajin" },
        ]
    },
    {
        ID_OrangTua: "parent002",
        Nama_Lengkap: "Ayah Zaini",
        Username: "ayahzaini",
        Email: "ayah.zaini@example.com",
        Nomor_Telepon: "085566778899",
        Status_Aktif: true,
        Password_Hash: "hashed_password_parent2",
        Profil_Foto: "https://placehold.co/100x100.png",
        Anak_Terkait: [
            { ID_Siswa: "siswa1", Nama_Siswa: "Ahmad Zulkifli Zaini" },
        ]
    },
    {
        ID_OrangTua: "parent003",
        Nama_Lengkap: "Bunda Rina",
        Username: "bundarina",
        Email: "bunda.rina@example.com",
        Nomor_Telepon: "087711223344",
        Status_Aktif: false,
        Password_Hash: "hashed_password_parent3",
        Profil_Foto: "https://placehold.co/100x100.png",
        Anak_Terkait: [
            { ID_Siswa: "siswa2", Nama_Siswa: "Rina Amelia Putri" },
        ]
    }
];

export let mockClasses: ClassData[] = [
  { ID_Kelas: 'kelasA', Nama_Kelas: 'Kelas 10A', ID_Guru: 'guru1', jumlahSiswa: 30, jurusan: "IPA" },
  { ID_Kelas: 'kelasB', Nama_Kelas: 'Kelas 11B', ID_Guru: 'guru2', jumlahSiswa: 28, jurusan: "IPS" },
  { ID_Kelas: 'kelasC', Nama_Kelas: 'Kelas 12C', ID_Guru: 'guru3', jumlahSiswa: 32, jurusan: "Bahasa" },
  { ID_Kelas: 'kelasD', Nama_Kelas: 'Kelas 10B', ID_Guru: 'guru1', jumlahSiswa: 29, jurusan: "IPA" },
  { ID_Kelas: 'kelasE', Nama_Kelas: 'Kelas 11A', ID_Guru: 'guru2', jumlahSiswa: 31, jurusan: "IPS" },
];


export const mockSchoolProfile: SchoolProfileData = {
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
  visi: "Menjadi sekolah unggul yang berkarakter, berprestasi, dan berwawasan global.",
  misi: "1. Melaksanakan pembelajaran yang inovatif dan kreatif.\n2. Mengembangkan potensi siswa secara optimal.\n3. Membangun karakter siswa yang berakhlak mulia.",
  logo: "https://placehold.co/160x40.png?text=Logo+Sekolah" // Placeholder URL for the logo
};


// Mock user progress data
export const mockUserProgress: UserProgress = {
  userId: 'student001', // Corresponds to the mock logged-in student "Siswa Rajin"
  completedLessons: ['1', '2'], // IDs of completed lessons from mockData.ts
  inProgressLessons: ['3'], // Example of lessons started but not finished
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

// Calculate lesson status counts
const totalMockLessons = mockLessons.length;
// Ensure mockUserProgress is defined before accessing its properties
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
};

export const mockMajors: MajorData[] = [
  { ID_Jurusan: "major001", Nama_Jurusan: "Ilmu Pengetahuan Alam (IPA)", Deskripsi_Jurusan: "Fokus pada studi sains seperti Fisika, Kimia, Biologi." },
  { ID_Jurusan: "major002", Nama_Jurusan: "Ilmu Pengetahuan Sosial (IPS)", Deskripsi_Jurusan: "Fokus pada studi sosial seperti Sejarah, Ekonomi, Geografi." },
  { ID_Jurusan: "major003", Nama_Jurusan: "Bahasa dan Budaya", Deskripsi_Jurusan: "Fokus pada studi bahasa, sastra, dan budaya." },
  { ID_Jurusan: "major004", Nama_Jurusan: "Teknik Komputer dan Jaringan (TKJ)", Deskripsi_Jurusan: "Untuk SMK, fokus pada teknologi informasi dan jaringan." },
  { ID_Jurusan: "major005", Nama_Jurusan: "Akuntansi dan Keuangan Lembaga (AKL)", Deskripsi_Jurusan: "Untuk SMK, fokus pada akuntansi dan keuangan." },
];


export function getLessonById(id: string): Lesson | undefined {
  return mockLessons.find(lesson => lesson.id === id);
}

export function getQuizById(id: string): Quiz | undefined {
  return mockQuizzes.find(quiz => quiz.id === id);
}

export function getClassById(id: string): ClassData | undefined {
  return mockClasses.find(kelas => kelas.ID_Kelas === id);
}

// Function to update a class in the mockClasses array
// This directly mutates the mockClasses array.
// In a real app, this would involve an API call and state update.
export function updateClass(updatedClass: ClassData): boolean {
  const index = mockClasses.findIndex(kelas => kelas.ID_Kelas === updatedClass.ID_Kelas);
  if (index !== -1) {
    mockClasses[index] = updatedClass;
    return true; // Indicate success
  }
  return false; // Indicate class not found
}
