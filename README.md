# Veepresh (Expo SDK 57)

React Native + Expo SDK 57 (expo-router) quiz app, written in plain **JavaScript / JSX**.

## Run it

Use a current Node.js LTS (22.x or newer).

```bash
npm install
npm run setup      # installs every dependency at the exact versions SDK 57 expects
npx expo-doctor    # optional sanity check
npx expo start     # scan the QR code with Expo Go
```

The logo / app icon / splash are new, so if you already have a development build installed, rebuild it
(`eas build` or `npx expo run:android|ios`) to pick them up. In Expo Go only the in-app logo changes.

## What's new

### Quiz collections (continuous learning)
A set is now either a **single quiz** (unchanged) or a **collection**: a list of sections (e.g. chapters), each with a
title, short description and its own questions.

* Section 1 is open; every other section unlocks once you score **70%+** in the one before it, so you never see
  questions about parts you haven't studied yet. Change the pass mark with `SECTION_UNLOCK_PCT` in `src/theme.js`.
* Sections are asked in the author's order. Best score and attempts per section are saved on the device.
* Pass every section to unlock a mixed **final review** (`FINAL_REVIEW_COUNT` questions from all sections).
* Results tell you what happens next: next section unlocked, retake needed, or collection complete.
* Create one from scratch (**Create → New collection**), by importing JSON, or by uploading a PDF and choosing
  **By chapter** (the AI call is still mocked, see below).

### Public / private + marketplace
* Every quiz and collection is **private** by default. In the editor (or with the toggle on the Create tab) switch it to
  **public**. Going public checks the quiz is complete and publishes it. Going back to *Editing* makes it private again.
* The new **Market** tab lists public quizzes. Search by title, topic, author or section name, and filter by
  type and category. Open a listing to preview its outline, then **Add to my library** to get a private copy.
* Quizzes you add from the marketplace can't be re-published as public (only the original author can).

### Logo, sign up and log in
* New logo (a "V" that doubles as a check mark) in `assets/images/`, used on the login, signup, onboarding and home
  screens, plus the app icon, adaptive icon, splash and notification icon (`app.json`).
* The signup and login screens already existed; they now show the logo. Auth is still **demo only**: any valid email
  and password works and the account lives on the device.

### TSX → JSX
Everything under `app/` and `src/` is now `.jsx` / `.js`, TypeScript is removed, `tsconfig.json` is gone.
`src/types.js` documents the data shapes in comments.

## Data files (hardcoded for now)

| File | What it is |
|---|---|
| `src/data/marketplace.json` | Demo marketplace listings by other authors (3 collections and 3 single quizzes) |
| `src/data/demoCollection.json` | What the mock AI returns for "By chapter": *Introduction to Python*, 5 chapters |
| `src/data/questions.js` | The 248 original questions (used for single quizzes) |

### JSON format (import screen, marketplace and the AI response all use it)

```jsonc
// single quiz
{ "title": "...", "category": "...", "description": "...",
  "questions": [ { "text": "...", "options": ["A","B","C","D"], "correct": 2, "points": 5, "feedback": "..." } ] }

// collection
{ "type": "collection", "title": "...", "category": "...", "description": "...",
  "sections": [ { "title": "Chapter 1", "description": "...", "questions": [ /* same as above */ ] } ] }
```
`correct` can be an option number from 0, a letter such as `"C"`, or the exact answer text.

## Going real with a backend

* **AI generation:** `generateQuestionSet()` in `src/services/ai.js`. Replace its body with an upload to your server
  and return the JSON above (a commented example is in the file). Keep your AI key on the server.
* **Marketplace:** `getMarketListings()` in `src/lib/market.js` builds the list from the JSON file plus the user's own
  public quizzes. Replace it with an API call that returns the same listing shape; `listingToSet()` already turns a
  listing into a library copy.
* **Auth:** `signIn` / `signUp` in `src/context/AppContext.jsx`.

## Project map

| Feature | Where |
|---|---|
| Home (sets + progress) | `app/(app)/(tabs)/index.jsx` |
| Marketplace tab / listing page | `app/(app)/(tabs)/market.jsx`, `app/(app)/listing/[id].jsx` |
| Create (new quiz, new collection, import, PDF) | `app/(app)/(tabs)/create.jsx`, `import-json.jsx`, `upload.jsx` |
| Editor (questions, sections, status, visibility) | `app/(app)/editor/[id].jsx` |
| Single quiz page / collection page with locked sections | `app/(app)/set/[id].jsx` |
| Quiz runner / results | `app/(app)/quiz.jsx`, `results.jsx` |
| Section unlock logic | `src/lib/collection.js` |
| JSON parsing, validation, export | `src/lib/quizSchema.js` |
| App state + persistence (AsyncStorage) | `src/context/AppContext.jsx` |

## Notes

* PDF preview: iOS renders in-app via WebView; Android opens the file in the phone's PDF viewer.
* Only multiple-choice questions are supported.
* Data saved by the previous version is migrated automatically (old quizzes become private single quizzes).
