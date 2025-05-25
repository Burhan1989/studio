
'use server';

/**
 * @fileOverview Agen AI kustomisasi jalur belajar.
 *
 * - customizeLearningPath - Fungsi yang menangani proses kustomisasi jalur belajar.
 * - CustomizeLearningPathInput - Tipe input untuk fungsi customizeLearningPath.
 * - CustomizeLearningPathOutput - Tipe kembalian untuk fungsi customizeLearningPath.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomizeLearningPathInputSchema = z.object({
  userInteractions: z
    .string()
    .describe('Ringkasan interaksi pengguna dengan platform pembelajaran.'),
  quizPerformance: z
    .string()
    .describe('Ringkasan kinerja pengguna pada kuis.'),
  learningStylePreferences: z
    .string() 
    .describe('Gaya belajar yang disukai pengguna.'),
  topic: z.string().describe('Topik untuk kustomisasi jalur belajar.'),
});
export type CustomizeLearningPathInput = z.infer<typeof CustomizeLearningPathInputSchema>;

const LearningResourceSchema = z.object({
  resourceType: z.string().describe('Jenis sumber belajar (misalnya, kuis, video, artikel).'),
  resourceLink: z.string().describe('Tautan ke sumber belajar.'),
  description: z.string().describe('Deskripsi singkat sumber daya.'),
});

const CustomizeLearningPathOutputSchema = z.object({
  learningPathDescription: z
    .string()
    .describe('Deskripsi jalur belajar yang disesuaikan berdasarkan data pengguna.'),
  customQuizzes: z
    .array(LearningResourceSchema)
    .describe('Kuis khusus yang disesuaikan dengan gaya belajar.'),
  customLearningResources: z
    .array(LearningResourceSchema)
    .describe('Sumber belajar khusus yang disesuaikan dengan gaya belajar.'),
});

export type CustomizeLearningPathOutput = z.infer<typeof CustomizeLearningPathOutputSchema>;

export async function customizeLearningPath(input: CustomizeLearningPathInput): Promise<CustomizeLearningPathOutput> {
  return customizeLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customizeLearningPathPrompt',
  input: {schema: CustomizeLearningPathInputSchema},
  output: {schema: CustomizeLearningPathOutputSchema},
  prompt: `Anda adalah seorang ahli dalam pembelajaran adaptif dan pendidikan yang dipersonalisasi.

Anda akan menganalisis interaksi pengguna, kinerja kuis, preferensi gaya belajar, dan topik untuk membuat jalur belajar yang disesuaikan.

Interaksi Pengguna: {{{userInteractions}}}
Kinerja Kuis: {{{quizPerformance}}}
Preferensi Gaya Belajar: {{{learningStylePreferences}}}
Topik: {{{topic}}}

Berdasarkan informasi ini, buat deskripsi jalur belajar, kuis khusus, dan sumber belajar khusus yang disesuaikan dengan gaya belajar pengguna dan topik.

Pastikan kuis dan sumber belajar beragam dan menarik, mencakup berbagai aspek topik dan sesuai dengan gaya belajar yang disukai pengguna.

Pertimbangkan kekuatan dan kelemahan pengguna saat merancang kuis dan sumber belajar.

Keluaran dalam format JSON.
`,
});

const customizeLearningPathFlow = ai.defineFlow(
  {
    name: 'customizeLearningPathFlow',
    inputSchema: CustomizeLearningPathInputSchema,
    outputSchema: CustomizeLearningPathOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
