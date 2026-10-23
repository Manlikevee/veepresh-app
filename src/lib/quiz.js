import { SECONDS_PER_QUESTION } from '../theme';

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build the list of questions for one run and shuffle each question's options (keeps `correct` in sync).
 * Single quizzes pick `count` random questions; sections of a collection keep the author's order (`ordered`).
 */
export function buildQuiz(questions, count, ordered = false) {
  const n = Math.min(Math.max(count, 1), questions.length);
  const picked = ordered ? questions.slice(0, n) : shuffle(questions).slice(0, n);
  return picked.map((q) => {
    const opts = shuffle(q.options.map((option, i) => ({ option, isCorrect: i === q.correct })));
    return {
      ...q,
      options: opts.map((o) => o.option),
      correct: opts.findIndex((o) => o.isCorrect),
    };
  });
}

export const estimateMinutes = (count) => Math.ceil((count * SECONDS_PER_QUESTION) / 60);

export const pad = (n) => String(n).padStart(2, '0');

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
