export type Question = {
  id: string;
  text: string;
  options: string[];
  correct: number; // index into options
  points: number;
  feedback: string;
};

export type QuestionSet = {
  id: string;
  category: string;
  title: string;
  description: string;
  questions: Question[];
  isSample?: boolean;
  sourceFile?: string;
  createdAt: number;
};

export type PickedDoc = {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
};

export type ReviewItem = { text: string; status: 'correct' | 'incorrect' | 'skipped' };

export type QuizResult = {
  setId: string;
  count: number;
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  points: number;
  maxPoints: number;
  pct: number;
  passed: boolean;
  review: ReviewItem[];
};

export type User = { name: string; email: string };
