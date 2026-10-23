import SEED from '../data/marketplace.json';
import { buildSet, parseQuizData } from './quizSchema';
import { countQuestions, getSections, isCollection } from './collection';

/**
 * The marketplace is a flat list of "listings":
 *   { id, kind, title, category, description, author, downloads, publishedAt, sections?, questions?, mine? }
 *
 * For now it is built from two places, so everything works without a backend:
 *   1. src/data/marketplace.json  (demo listings by other authors)
 *   2. the user's own quizzes that are published AND public
 * Later, replace `getMarketListings` with a call to your API and keep the same shape.
 */
const fromSeed = (item) => ({
  id: item.id,
  kind: item.type === 'collection' || Array.isArray(item.sections) ? 'collection' : 'single',
  title: item.title,
  category: item.category ?? '',
  description: item.description ?? '',
  author: item.author ?? 'Unknown',
  downloads: item.downloads ?? 0,
  publishedAt: item.publishedAt ?? '',
  sections: item.sections,
  questions: item.questions,
  mine: false,
});

const fromMine = (set, user) => ({
  id: set.id,
  kind: isCollection(set) ? 'collection' : 'single',
  title: set.title,
  category: set.category,
  description: set.description,
  author: user?.name ?? 'You',
  downloads: 0,
  publishedAt: new Date(set.updatedAt ?? set.createdAt).toISOString().slice(0, 10),
  sections: set.sections,
  questions: set.questions,
  mine: true,
});

export function getMarketListings(sets, user) {
  const mine = sets.filter((s) => !s.isSample && s.status === 'published' && s.visibility === 'public').map((s) => fromMine(s, user));
  return [...mine, ...SEED.map(fromSeed)];
}

export const listingQuestionCount = (l) => countQuestions({ kind: l.kind, questions: l.questions ?? [], sections: l.sections ?? [] });
export const listingSections = (l) => getSections({ kind: l.kind, sections: l.sections ?? [] });

/** Copies a listing into the user's library as a new, private, ready-to-take quiz with fresh ids. */
export function listingToSet(listing) {
  const parsed = parseQuizData(
    listing.kind === 'collection'
      ? { type: 'collection', title: listing.title, category: listing.category, description: listing.description, sections: listing.sections }
      : { title: listing.title, category: listing.category, description: listing.description, questions: listing.questions }
  );
  if (!parsed.ok) throw new Error(parsed.errors.join('\n'));
  return buildSet(parsed, {
    status: 'published',
    origin: 'market',
    visibility: 'private',
    sourceId: listing.id,
    author: listing.author,
  });
}
