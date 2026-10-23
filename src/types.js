/**
 * Data shapes used across the app (documentation only: this project is plain JavaScript).
 *
 * Question      { id, text, options: string[], correct: number, points: number, feedback: string }
 *
 * Section       { id, title, description, questions: Question[] }
 *
 * QuestionSet   {
 *   id, title, category, description,
 *   kind: 'single' | 'collection',          // missing on old data -> treated as 'single'
 *   questions: Question[],                  // single quizzes (empty for collections)
 *   sections?: Section[],                   // collections
 *   status: 'draft' | 'published',          // draft = "editing" mode, not takeable
 *   visibility: 'private' | 'public',       // public + published = listed in the marketplace
 *   origin: 'sample' | 'ai' | 'custom' | 'json' | 'market',
 *   sourceFile?, sourceId?, author?, isSample?, createdAt, updatedAt?
 * }
 *
 * Progress      { [setId]: { [sectionId]: { best: number, passed: boolean, attempts: number, at: number } } }
 *
 * QuizResult    { setId, sectionId?, sectionTitle?, count, total, correct, incorrect, skipped,
 *                 points, maxPoints, pct, passed, review: { text, status }[] }
 *
 * Attempt       { id, setId, title, pct, passed, total, at }
 * Reminder      { id, setId, setTitle, hour, minute, days: number[], enabled, notificationIds: string[] }
 * User          { name, email }
 */
export {};
