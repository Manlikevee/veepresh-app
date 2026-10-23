import { getSections, isCollection } from './collection';

export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 6;

export const newId = (prefix = 'q') => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const emptyQuestion = () => ({
  id: newId(),
  text: '',
  options: ['', '', '', ''],
  correct: 0,
  points: 5,
  feedback: '',
});

export const emptySection = () => ({
  id: newId('sec'),
  title: '',
  description: '',
  questions: [emptyQuestion()],
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

export const STARTER_COLLECTION_JSON = JSON.stringify(
  {
    type: 'collection',
    title: 'My first collection',
    category: 'General knowledge',
    description: 'Learn step by step. Each section unlocks after you pass the one before it.',
    visibility: 'private',
    sections: [
      {
        title: 'Section 1 · The basics',
        description: 'Warm-up questions.',
        questions: [
          {
            text: 'What is the capital of France?',
            options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
            correct: 2,
            points: 5,
            feedback: 'Paris has been the capital of France for centuries.',
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
      {
        title: 'Section 2 · Going further',
        description: 'Unlocks once you pass section 1.',
        questions: [
          {
            text: 'Which planet is known as the Red Planet?',
            options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
            correct: 1,
            points: 5,
            feedback: 'Iron oxide on its surface gives Mars its red colour.',
          },
        ],
      },
    ],
  },
  null,
  2
);

function resolveCorrect(value, options) {
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

const str = (v) => String(v ?? '').trim();

/** Parses a list of raw questions. `label(n)` builds the error prefix, e.g. "Question 3" or "Section 2 · Question 3". */
function parseQuestionList(list, label) {
  const errors = [];
  const questions = [];
  list.forEach((item, i) => {
    const n = label(i + 1);
    const text = str(item?.text ?? item?.question);
    const options = Array.isArray(item?.options) ? item.options.map((o) => String(o ?? '').trim()) : [];
    let bad = false;
    if (!text) { errors.push(`${n}: missing "text".`); bad = true; }
    if (options.length < MIN_OPTIONS || options.length > MAX_OPTIONS) {
      errors.push(`${n}: "options" needs ${MIN_OPTIONS}–${MAX_OPTIONS} items.`); bad = true;
    } else if (options.some((o) => !o)) {
      errors.push(`${n}: options can't be empty.`); bad = true;
    }
    const correct = bad ? 0 : resolveCorrect(item?.correct, options);
    if (!bad && correct === -1) {
      errors.push(`${n}: "correct" must be an option number starting at 0, a letter like "B", or the exact answer text.`);
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
      feedback: str(item?.feedback),
    });
  });
  return { questions, errors };
}

/**
 * Accepts, as an object (already JSON.parse'd):
 *   single quiz  { title, category, description, questions: [...] }   (or a bare array of questions)
 *   collection   { type: 'collection', title, category, description, sections: [{ title, description, questions: [...] }] }
 * A file with a "sections" array is treated as a collection even without "type".
 */
export function parseQuizData(data) {
  const isArr = Array.isArray(data);
  const collection = !isArr && (data?.type === 'collection' || Array.isArray(data?.sections));
  const visibility = !isArr && data?.visibility === 'public' ? 'public' : 'private';

  if (collection) {
    const rawSections = data?.sections;
    if (!Array.isArray(rawSections) || rawSections.length === 0) {
      return { ok: false, errors: ['A collection needs a "sections" array with at least one section.'] };
    }
    const errors = [];
    const sections = [];
    rawSections.forEach((sec, i) => {
      const where = `Section ${i + 1}`;
      const title = str(sec?.title);
      if (!title) errors.push(`${where}: missing "title".`);
      if (!Array.isArray(sec?.questions) || sec.questions.length === 0) {
        errors.push(`${where}: needs a "questions" array with at least one question.`);
        return;
      }
      const res = parseQuestionList(sec.questions, (n) => `${where} · Question ${n}`);
      errors.push(...res.errors);
      sections.push({ id: newId('sec'), title, description: str(sec?.description), questions: res.questions });
    });
    if (errors.length) return { ok: false, errors };
    return {
      ok: true,
      kind: 'collection',
      title: str(data?.title) || 'Imported collection',
      category: str(data?.category) || 'Custom collection',
      description: str(data?.description),
      visibility,
      sections,
    };
  }

  const list = isArr ? data : data?.questions;
  if (!Array.isArray(list) || list.length === 0) {
    return { ok: false, errors: ['Expected a "questions" array (or a "sections" array for a collection) with at least one item.'] };
  }
  const res = parseQuestionList(list, (n) => `Question ${n}`);
  if (res.errors.length) return { ok: false, errors: res.errors };
  return {
    ok: true,
    kind: 'single',
    title: str(data?.title) || 'Imported quiz',
    category: str(data?.category) || 'Custom quiz',
    description: str(data?.description),
    visibility,
    questions: res.questions,
  };
}

export function parseQuizJson(raw) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return { ok: false, errors: [`That is not valid JSON (${e.message}).`] };
  }
  return parseQuizData(data);
}

/** Turns a successful parse result into a full set object with fresh ids. */
export function buildSet(parsed, overrides = {}) {
  const now = Date.now();
  return {
    id: newId('set'),
    kind: parsed.kind,
    category: parsed.category,
    title: parsed.title,
    description: parsed.description,
    questions: parsed.kind === 'single' ? parsed.questions : [],
    ...(parsed.kind === 'collection' ? { sections: parsed.sections } : {}),
    visibility: 'private',
    status: 'draft',
    origin: 'json',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/** Returns a message if the question isn't ready to be published, otherwise null. */
export function validateQuestion(q) {
  if (!q.text.trim()) return 'Add the question text.';
  const filled = q.options.filter((o) => o.trim());
  if (q.options.length < MIN_OPTIONS || filled.length !== q.options.length) return 'Fill in every answer option (or remove empty ones).';
  if (q.correct < 0 || q.correct >= q.options.length) return 'Mark the correct answer.';
  return null;
}

/**
 * `firstInvalid` says where the editor should jump to: `{ kind: 'section' | 'question', id }` (or null).
 */
export function validateForPublish(set) {
  const errors = [];
  let firstInvalid = null;
  const flag = (kind, id) => { if (!firstInvalid) firstInvalid = { kind, id }; };
  const collection = isCollection(set);

  if (!set.title.trim()) errors.push(collection ? 'Give your collection a title.' : 'Give your quiz a title.');

  if (collection) {
    const sections = getSections(set);
    if (sections.length === 0) errors.push('Add at least one section.');
    sections.forEach((sec, si) => {
      const where = `Section ${si + 1}`;
      if (!sec.title.trim()) { errors.push(`${where}: give it a title.`); flag('section', sec.id); }
      if (sec.questions.length === 0) { errors.push(`${where}: add at least one question.`); flag('section', sec.id); }
      sec.questions.forEach((q, i) => {
        const msg = validateQuestion(q);
        if (msg) { errors.push(`${where}, question ${i + 1}: ${msg}`); flag('question', q.id); }
      });
    });
  } else {
    if (set.questions.length === 0) errors.push('Add at least one question.');
    set.questions.forEach((q, i) => {
      const msg = validateQuestion(q);
      if (msg) { errors.push(`Question ${i + 1}: ${msg}`); flag('question', q.id); }
    });
  }
  return { errors, firstInvalid };
}

const exportQuestion = (q) => ({ text: q.text, options: q.options, correct: q.correct, points: q.points, feedback: q.feedback });

/** Plain JSON users can copy out of the editor (same format the importer reads). */
export function exportSetJson(set) {
  const base = { title: set.title, category: set.category, description: set.description, visibility: set.visibility ?? 'private' };
  const body = isCollection(set)
    ? {
        type: 'collection',
        ...base,
        sections: getSections(set).map((s) => ({ title: s.title, description: s.description, questions: s.questions.map(exportQuestion) })),
      }
    : { ...base, questions: set.questions.map(exportQuestion) };
  return JSON.stringify(body, null, 2);
}
