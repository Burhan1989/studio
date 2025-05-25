'use server';

/**
 * @fileOverview A learning path customization AI agent.
 *
 * - customizeLearningPath - A function that handles the learning path customization process.
 * - CustomizeLearningPathInput - The input type for the customizeLearningPath function.
 * - CustomizeLearningPathOutput - The return type for the customizeLearningPath function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomizeLearningPathInputSchema = z.object({
  userInteractions: z
    .string()
    .describe('A summary of the user interactions with the learning platform.'),
  quizPerformance: z
    .string()
    .describe('A summary of the user performance on quizzes.'),
  learningStylePreferences: z
    .string() // Consider making this an optional field with a default value
    .describe('The preferred learning style of the user.'),
  topic: z.string().describe('The topic for learning path customization.'),
});
export type CustomizeLearningPathInput = z.infer<typeof CustomizeLearningPathInputSchema>;

const LearningResourceSchema = z.object({
  resourceType: z.string().describe('The type of learning resource (e.g., quiz, video, article).'),
  resourceLink: z.string().describe('The link to the learning resource.'),
  description: z.string().describe('A short description of the resource.'),
});

const CustomizeLearningPathOutputSchema = z.object({
  learningPathDescription: z
    .string()
    .describe('A description of the customized learning path based on the user data.'),
  customQuizzes: z
    .array(LearningResourceSchema)
    .describe('Custom quizzes tailored to the learning style.'),
  customLearningResources: z
    .array(LearningResourceSchema)
    .describe('Custom learning resources tailored to the learning style.'),
});

export type CustomizeLearningPathOutput = z.infer<typeof CustomizeLearningPathOutputSchema>;

export async function customizeLearningPath(input: CustomizeLearningPathInput): Promise<CustomizeLearningPathOutput> {
  return customizeLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customizeLearningPathPrompt',
  input: {schema: CustomizeLearningPathInputSchema},
  output: {schema: CustomizeLearningPathOutputSchema},
  prompt: `You are an expert in adaptive learning and personalized education.

You will analyze the user's interactions, quiz performance, learning style preferences, and the topic to create a customized learning path.

User Interactions: {{{userInteractions}}}
Quiz Performance: {{{quizPerformance}}}
Learning Style Preferences: {{{learningStylePreferences}}}
Topic: {{{topic}}}

Based on this information, create a learning path description, custom quizzes, and custom learning resources tailored to the user's learning style and the topic.

Ensure that the quizzes and learning resources are diverse and engaging, covering different aspects of the topic and catering to the user's preferred learning style.

Consider the user's strengths and weaknesses when designing the quizzes and learning resources.

Output in JSON format.
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
