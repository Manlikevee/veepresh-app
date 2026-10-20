import type { QuestionSet } from '../types';
import { SAMPLE_QUESTIONS } from './questions';

export const SAMPLE_SET: QuestionSet = {
  id: 'sample',
  category: 'STC 323 · Industrial Chemistry',
  title: 'Industrial Chemistry',
  description:
    'Test your understanding of industrial chemistry, including raw materials, industrial processes, chemical manufacturing, separation techniques, fertilizers, cement, glass, polymers, petroleum refining, reactors, quality control, environmental management, industrial safety, and large-scale chemical production.',
  questions: SAMPLE_QUESTIONS,
  status: 'published',
  origin: 'sample',
  isSample: true,
  createdAt: 0,
};
