# Veepresh (Expo SDK 57)

React Native + Expo SDK 57 (expo-router) version of the Veepresh quiz app. Works with the current Expo Go.

## Run it

Use a current Node.js LTS (22.x or newer).

```bash
npm install
npm run setup      # installs every dependency at the exact versions SDK 57 expects
npx expo-doctor    # optional sanity check
npx expo start     # scan the QR code with Expo Go
```

## Upgrading to SDK 58 later

```bash
npx expo install expo@^58.0.0 --fix
```
SDK 58 also adds `File.preview()`, which can replace the WebView / intent-launcher preview screen.

## What's inside

| Feature | Where |
|---|---|
| Onboarding slider (3 slides, skip/next) | `app/onboarding.tsx` |
| Dummy login / signup (any valid email works, stored on-device only) | `app/(auth)/` |
| Home with sample set + generated sets | `app/(app)/index.tsx` |
| PDF upload, replace, preview | `app/(app)/upload.tsx`, `preview.tsx` |
| Mock AI generation (returns the hardcoded HTML-quiz questions) | `src/services/ai.ts` |
| Question count picker (min 10), quiz, timer, feedback, results | `app/(app)/set/[id].tsx`, `quiz.tsx`, `results.tsx` |
| 248 original questions | `src/data/questions.ts` |

Flow: first launch → onboarding → signup/login → home. Later launches skip straight to home.

## Going real with the AI

Everything is wired through one function, `generateQuestionSet()` in `src/services/ai.ts`.
Replace its body with an upload to your backend (a commented example is in the file) and keep the
returned `QuestionSet` shape. Keep your AI API key on the server, never in the app.

## Notes

- PDF preview: iOS renders in-app via WebView; Android opens the file in the phone's PDF viewer (WebView can't show PDFs).
- Only the multiple-choice type from the HTML version is supported (all 248 questions are MCQ).
- No app icon is included yet. Add `icon` / `splash` entries to `app.json` when you have artwork.
