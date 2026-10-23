import DEMO_COLLECTION from '../data/demoCollection.json';
import { SAMPLE_QUESTIONS } from '../data/questions';
import { buildSet, parseQuizData } from '../lib/quizSchema';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SINGLE_STAGES = [
  'Reading your document…',
  'Finding the key concepts…',
  'Writing questions…',
  'Checking the answers…',
];

const COLLECTION_STAGES = [
  'Reading your document…',
  'Splitting it into chapters…',
  'Writing questions for each chapter…',
  'Checking the answers…',
];

export const generationStages = (kind) => (kind === 'collection' ? COLLECTION_STAGES : SINGLE_STAGES);

/**
 * MOCK: nothing is uploaded anywhere. After a short fake delay it returns hardcoded questions:
 *   kind 'single'     -> the 248 questions from the original HTML quiz
 *   kind 'collection' -> src/data/demoCollection.json ("Introduction to Python", 5 chapters)
 *
 * To make this real later, replace the body with something like:
 *
 *   const form = new FormData();
 *   form.append('file', { uri: doc.uri, name: doc.name, type: 'application/pdf' });
 *   form.append('kind', kind);
 *   const res = await fetch(`${API_URL}/generate-questions`, { method: 'POST', body: form });
 *   const data = await res.json();
 *
 * where `data` is the same JSON the "Import from JSON" screen reads:
 *   single:      { title, description, questions: [{ text, options, correct, points, feedback }] }
 *   collection:  { type: 'collection', title, description,
 *                  sections: [{ title, description, questions: [...] }] }       // one section per chapter
 *
 * Then run it through parseQuizData(data) + buildSet(...) exactly like below and keep the returned shape.
 * Keep your AI API key on the server, never in the app.
 */
export async function generateQuestionSet({ doc, title, kind = 'single', onStage }) {
  const stages = generationStages(kind);
  for (let i = 0; i < stages.length; i++) {
    onStage?.(i);
    await sleep(700);
  }

  const cleanName = doc.name.replace(/\.pdf$/i, '');
  const finalTitle = title?.trim() || cleanName;

  if (kind === 'collection') {
    const parsed = parseQuizData(DEMO_COLLECTION);
    if (!parsed.ok) throw new Error(parsed.errors.join('\n'));
    return buildSet(
      {
        ...parsed,
        title: finalTitle,
        category: 'AI generated',
        description: `Chapter-by-chapter questions generated from "${doc.name}". Pass each section to unlock the next one.`,
      },
      { status: 'published', origin: 'ai', sourceFile: doc.name }
    );
  }

  const id = `set_${Date.now()}`;
  return {
    id,
    kind: 'single',
    category: 'AI generated',
    title: finalTitle,
    description: `Questions generated from "${doc.name}". Test your understanding of the key ideas in this document.`,
    sourceFile: doc.name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    status: 'published',
    visibility: 'private',
    origin: 'ai',
    questions: SAMPLE_QUESTIONS.map((q) => ({ ...q, id: `${id}_${q.id}` })),
  };
}
