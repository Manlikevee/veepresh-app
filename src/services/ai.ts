import { SAMPLE_QUESTIONS } from '../data/questions';
import type { PickedDoc, QuestionSet } from '../types';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const GENERATION_STAGES = [
  'Reading your document…',
  'Finding the key concepts…',
  'Writing questions…',
  'Checking the answers…',
];

export type GenerateOptions = {
  doc: PickedDoc;
  title?: string;
  onStage?: (stageIndex: number) => void;
};

/**
 * MOCK: nothing is uploaded anywhere. After a short fake delay it returns the
 * hardcoded questions from the original HTML quiz.
 *
 * To make this real later, replace the body with something like:
 *
 *   const form = new FormData();
 *   form.append('file', { uri: doc.uri, name: doc.name, type: 'application/pdf' } as any);
 *   const res = await fetch(`${API_URL}/generate-questions`, { method: 'POST', body: form });
 *   const { questions } = await res.json();
 *
 * and keep the same return shape (QuestionSet).
 */
export async function generateQuestionSet({ doc, title, onStage }: GenerateOptions): Promise<QuestionSet> {
  for (let i = 0; i < GENERATION_STAGES.length; i++) {
    onStage?.(i);
    await sleep(700);
  }

  const id = `set_${Date.now()}`;
  const cleanName = doc.name.replace(/\.pdf$/i, '');
  return {
    id,
    category: 'AI generated',
    title: title?.trim() || cleanName,
    description: `Questions generated from "${doc.name}". Test your understanding of the key ideas in this document.`,
    sourceFile: doc.name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    status: 'published',
    origin: 'ai',
    questions: SAMPLE_QUESTIONS.map((q) => ({ ...q, id: `${id}_${q.id}` })),
  };
}
