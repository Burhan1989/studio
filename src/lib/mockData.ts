
import type { Lesson, Quiz, Question } from './types';

export const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to JavaScript',
    content: `
JavaScript is a versatile and widely used programming language, primarily known for its role in web development. 
It allows you to add interactivity to websites, build web servers, create mobile apps, and much more.

### Key Concepts:
- **Variables**: Containers for storing data values. (e.g., \`let name = "AdeptLearn";\`)
- **Data Types**: Types of data that can be stored, such as strings, numbers, booleans.
- **Operators**: Symbols that perform operations on operands (e.g., \`+\`, \`-\`, \`*\`, \`/\`).
- **Control Flow**: Structures like \`if...else\` statements and loops (\`for\`, \`while\`) that control the execution order of code.
- **Functions**: Reusable blocks of code that perform a specific task.

This lesson will cover the very basics to get you started.
    `,
    videoUrl: 'https://placehold.co/600x338.png', // Placeholder for video ID / URL
    quizId: 'quiz1',
    estimatedTime: "30 minutes",
    difficulty: "Beginner",
  },
  {
    id: '2',
    title: 'Variables and Data Types in JS',
    content: `
In JavaScript, variables are declared using \`let\`, \`const\`, or (less commonly now) \`var\`.
- \`let\`: Declares a block-scoped local variable, optionally initializing it to a value.
- \`const\`: Declares a block-scoped, read-only named constant. Its value cannot be reassigned.

### Common Data Types:
- **String**: Textual data (e.g., \`"Hello, World!"\`).
- **Number**: Numerical data, including integers and floating-point numbers (e.g., \`42\`, \`3.14\`).
- **Boolean**: Logical data type that can have only two values: \`true\` or \`false\`.
- **Object**: A collection of key-value pairs.
- **Array**: An ordered list of values.
- **null**: Represents the intentional absence of any object value.
- **undefined**: Indicates that a variable has been declared but not yet assigned a value.
    `,
    estimatedTime: "45 minutes",
    difficulty: "Beginner",
  },
  {
    id: '3',
    title: 'Understanding React Hooks',
    content: `
Hooks are functions that let you “hook into” React state and lifecycle features from function components.
Hooks don’t work inside classes — they let you use React without classes.

### Common Hooks:
- **useState**: Lets you add React state to function components.
- **useEffect**: Lets you perform side effects in function components (e.g., data fetching, subscriptions, manually changing the DOM).
- **useContext**: Accepts a context object (the value returned from \`React.createContext\`) and returns the current context value for that context.
- **useReducer**: An alternative to \`useState\`. Accepts a reducer of type \`(state, action) => newState\`, and returns the current state paired with a \`dispatch\` method.
    `,
    videoUrl: 'https://placehold.co/600x338.png',
    quizId: 'quiz2',
    estimatedTime: "1 hour",
    difficulty: "Intermediate",
  },
];

export const mockQuestionsQuiz1: Question[] = [
  {
    id: 'q1_1',
    text: 'Which keyword is used to declare a variable in modern JavaScript that can be reassigned?',
    type: 'multiple-choice',
    options: ['var', 'let', 'const', 'static'],
    correctAnswer: 'let',
  },
  {
    id: 'q1_2',
    text: 'JavaScript is primarily a client-side scripting language.',
    type: 'true-false',
    correctAnswer: true,
  },
  {
    id: 'q1_3',
    text: 'What is the data type of `typeof "AdeptLearn"`?',
    type: 'multiple-choice',
    options: ['Number', 'String', 'Boolean', 'Object'],
    correctAnswer: 'String',
  },
];

export const mockQuestionsQuiz2: Question[] = [
  {
    id: 'q2_1',
    text: 'Which Hook would you use to add state to a function component?',
    type: 'multiple-choice',
    options: ['useEffect', 'useContext', 'useState', 'useReducer'],
    correctAnswer: 'useState',
  },
  {
    id: 'q2_2',
    text: '`useEffect` is used for managing component lifecycle events and side effects.',
    type: 'true-false',
    correctAnswer: true,
  },
   {
    id: 'q2_3',
    text: 'Can Hooks be used inside class components?',
    type: 'true-false',
    correctAnswer: false,
  },
];


export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz1',
    title: 'JavaScript Basics Quiz',
    lessonId: '1',
    questions: mockQuestionsQuiz1,
  },
  {
    id: 'quiz2',
    title: 'React Hooks Fundamentals',
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
