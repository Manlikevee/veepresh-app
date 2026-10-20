import type { Question, QuestionSet } from '../types';

export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 6;

export const newId = (prefix = 'q') => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const emptyQuestion = (): Question => ({
  id: newId(),
  text: '',
  options: ['', '', '', ''],
  correct: 0,
  points: 5,
  feedback: '',
});

export const STARTER_JSON = JSON.stringify(
  {
    title: 'My first quiz',
    category: 'General knowledge',
    description: 'A short starter quiz. Edit the JSON or replace it with your own questions.',
    questions: [
      {
        text: 'What is the capital of France?',
        options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        correct: 2,
        points: 5,
        feedback: 'Paris has been the capital of France for centuries.',
      },
      {
        text: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
        correct: 1,
        points: 5,
        feedback: 'Iron oxide on its surface gives Mars its red colour.',
      },
      {
        text: 'What is 7 × 8?',
        options: ['54', '56', '58', '64'],
        correct: 1,
        points: 5,
        feedback: '7 × 8 = 56.',
      },
    ],
  },
  null,
  2
);

function resolveCorrect(value: unknown, options: string[]): number {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < options.length) return value;
  if (typeof value === 'string') {
    const v = value.trim();
    if (/^\d+$/.test(v)) {
      const n = Number(v);
      if (n < options.length) return n;
    }
    if (/^[A-Fa-f]$/.test(v)) {
      const n = v.toUpperCase().charCodeAt(0) - 65;
      if (n < options.length) return n;
    }
    const byText = options.findIndex((o) => o.toLowerCase() === v.toLowerCase());
    if (byText !== -1) return byText;
  }
  return -1;
}

export type ParseResult =
  | { ok: true; title: string; category: string; description: string; questions: Question[] }
  | { ok: false; errors: string[] };

/** Accepts either `{ title, category, description, questions: [...] }` or a bare array of questions. */
export function parseQuizJson(raw: string): ParseResult {
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return { ok: false, errors: [`That is not valid JSON (${(e as Error).message}).`] };
  }
  const list = Array.isArray(data) ? data : data?.questions;
  if (!Array.isArray(list) || list.length === 0) {
    return { ok: false, errors: ['Expected a "questions" array with at least one question.'] };
  }

  const errors: string[] = [];
  const questions: Question[] = [];
  list.forEach((item: any, i: number) => {
    const n = i + 1;
    const text = String(item?.text ?? item?.question ?? '').trim();
    const options: string[] = Array.isArray(item?.options) ? item.options.map((o: unknown) => String(o ?? '').trim()) : [];
    let bad = false;
    if (!text) { errors.push(`Question ${n}: missing "text".`); bad = true; }
    if (options.length < MIN_OPTIONS || options.length > MAX_OPTIONS) {
      errors.push(`Question ${n}: "options" needs ${MIN_OPTIONS}–${MAX_OPTIONS} items.`); bad = true;
    } else if (options.some((o) => !o)) {
      errors.push(`Question ${n}: options can't be empty.`); bad = true;
    }
    const correct = bad ? 0 : resolveCorrect(item?.correct, options);
    if (!bad && correct === -1) {
      errors.push(`Question ${n}: "correct" must be an option number starting at 0, a letter like "B", or the exact answer text.`);
      bad = true;
    }
    if (bad) return;
    const pts = Number(item?.points);
    questions.push({
      id: newId(),
      text,
      options,
      correct,
      points: Number.isFinite(pts) && pts > 0 ? Math.round(pts) : 5,
      feedback: String(item?.feedback ?? '').trim(),
    });
  });

  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    title: String(data?.title ?? '').trim() || 'Imported quiz',
    category: String(data?.category ?? '').trim() || 'Custom quiz',
    description: String(data?.description ?? '').trim(),
    questions,
  };
}

/** Returns a message if the question isn't ready to be published, otherwise null. */
export function validateQuestion(q: Question): string | null {
  if (!q.text.trim()) return 'Add the question text.';
  const filled = q.options.filter((o) => o.trim());
  if (q.options.length < MIN_OPTIONS || filled.length !== q.options.length) return 'Fill in every answer option (or remove empty ones).';
  if (q.correct < 0 || q.correct >= q.options.length) return 'Mark the correct answer.';
  return null;
}

export function validateForPublish(set: QuestionSet): { errors: string[]; firstInvalid: number } {
  const errors: string[] = [];
  let firstInvalid = -1;
  if (!set.title.trim()) errors.push('Give your quiz a title.');
  if (set.questions.length === 0) errors.push('Add at least one question.');
  set.questions.forEach((q, i) => {
    const msg = validateQuestion(q);
    if (msg) {
      errors.push(`Question ${i + 1}: ${msg}`);
      if (firstInvalid === -1) firstInvalid = i;
    }
  });
  return { errors, firstInvalid };
}

/** Plain JSON users can copy out of the editor. */
export function exportSetJson(set: QuestionSet): string {
  return JSON.stringify(
    {
      title: set.title,
      category: set.category,
      description: set.description,
      questions: set.questions.map((q) => ({ text: q.text, options: q.options, correct: q.correct, points: q.points, feedback: q.feedback })),
    },
    null,
    2
  );
}
