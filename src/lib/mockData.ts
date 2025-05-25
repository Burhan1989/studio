
import type { Lesson, Quiz, Question, StudentData, TeacherData } from './types';

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
    videoUrl: 'https://placehold.co/600x338.png', // Placeholder for video ID / URL
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

// Mock Students Data - ensure one matches student@example.com
export const mockStudents: StudentData[] = [
  {
    ID_Siswa: "student001",
    Nama_Lengkap: "Siswa Rajin",
    Nama_Panggilan: "Siswa",
    Username: "siswarajin",
    Email: "student@example.com", // Match with login
    NISN: "0098765432",
    Nomor_Induk: "S1004",
    Kelas: "Kelas 10B",
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
    Kelas: "Kelas 10A",
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
];

// Mock Teachers Data - ensure one matches teacher@example.com
export const mockTeachers: TeacherData[] = [
  {
    ID_Guru: "teacher001",
    Nama_Lengkap: "Guru Inovatif, M.Pd.",
    Username: "guruinovatif",
    Email: "teacher@example.com", // Match with login
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
];


export function getLessonById(id: string): Lesson | undefined {
  return mockLessons.find(lesson => lesson.id === id);
}

export function getQuizById(id: string): Quiz | undefined {
  return mockQuizzes.find(quiz => quiz.id === id);
}
