import type { Question } from '../types';
import { SECONDS_PER_QUESTION } from '../theme';

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick `count` random questions and shuffle each question's options (keeps `correct` in sync). */
export function buildQuiz(questions: Question[], count: number): Question[] {
  const n = Math.min(Math.max(count, 1), questions.length);
  return shuffle(questions)
    .slice(0, n)
    .map((q) => {
      const opts = shuffle(q.options.map((option, i) => ({ option, isCorrect: i === q.correct })));
      return {
        ...q,
        options: opts.map((o) => o.option),
        correct: opts.findIndex((o) => o.isCorrect),
      };
    });
}

export const estimateMinutes = (count: number) => Math.ceil((count * SECONDS_PER_QUESTION) / 60);

export const pad = (n: number) => String(n).padStart(2, '0');

export function formatBytes(bytes?: number) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
