import { SECTION_UNLOCK_PCT } from '../theme';

/**
 * A "set" is either:
 *   kind: 'single'      -> { questions: [...] }                       (the original quiz)
 *   kind: 'collection'  -> { sections: [{ id, title, description, questions: [...] }] }
 * Old data saved before collections existed has no `kind`, so anything that isn't a collection is a single quiz.
 */
export const isCollection = (set) => set?.kind === 'collection';
export const getSections = (set) => (isCollection(set) ? set.sections ?? [] : []);
export const getAllQuestions = (set) => (isCollection(set) ? getSections(set).flatMap((s) => s.questions) : set?.questions ?? []);
export const countQuestions = (set) => getAllQuestions(set).length;

/**
 * Where the learner is in a collection. Section 1 is always open; every other section opens
 * once the section before it has been passed (>= SECTION_UNLOCK_PCT).
 *
 * `setProgress` is `{ [sectionId]: { best, passed, attempts, at } }` (see AppContext.recordSectionResult).
 * status: 'completed' | 'available' | 'locked'
 */
export function getSectionStates(set, setProgress = {}) {
  let previousPassed = true;
  return getSections(set).map((section, index) => {
    const p = setProgress[section.id];
    const passed = !!p?.passed;
    const status = passed ? 'completed' : previousPassed ? 'available' : 'locked';
    previousPassed = passed;
    return { section, index, status, best: p?.best ?? null, attempts: p?.attempts ?? 0 };
  });
}

export function getCollectionProgress(set, setProgress = {}) {
  const states = getSectionStates(set, setProgress);
  const done = states.filter((s) => s.status === 'completed').length;
  const total = states.length;
  return {
    states,
    done,
    total,
    pct: total ? Math.round((done / total) * 100) : 0,
    complete: total > 0 && done === total,
    current: states.find((s) => s.status === 'available') ?? null, // the section to do next
  };
}

/** Applies `fn(questions, sectionId | null)` to every list of questions in the set and returns the patch to save. */
export function mapQuestionLists(set, fn) {
  if (isCollection(set)) return { sections: getSections(set).map((s) => ({ ...s, questions: fn(s.questions, s.id) })) };
  return { questions: fn(set.questions, null) };
}

export { SECTION_UNLOCK_PCT };
