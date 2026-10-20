export type Question = {
  id: string;
  text: string;
  options: string[];
  correct: number; // index into options
  points: number;
  feedback: string;
};

export type SetStatus = 'draft' | 'published';
export type SetOrigin = 'sample' | 'ai' | 'custom' | 'json';

export type QuestionSet = {
  id: string;
  category: string;
  title: string;
  description: string;
  questions: Question[];
  status: SetStatus; // draft = "editing" mode (not takeable), published = visible & takeable
  origin: SetOrigin;
  isSample?: boolean;
  sourceFile?: string;
  createdAt: number;
  updatedAt?: number;
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

export type Attempt = { id: string; setId: string; title: string; pct: number; passed: boolean; total: number; at: number };

/** Weekdays use 1 = Sunday … 7 = Saturday (same as expo-notifications). Empty `days` = every day. */
export type Reminder = {
  id: string;
  setId: string;
  setTitle: string;
  hour: number; // 0-23
  minute: number;
  days: number[];
  enabled: boolean;
  notificationIds: string[];
};

export type User = { name: string; email: string };
