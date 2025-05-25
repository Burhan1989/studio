
import type { Lesson, Quiz, Question } from './types';

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

export function getLessonById(id: string): Lesson | undefined {
  return mockLessons.find(lesson => lesson.id === id);
}

export function getQuizById(id: string): Quiz | undefined {
  return mockQuizzes.find(quiz => quiz.id === id);
}
