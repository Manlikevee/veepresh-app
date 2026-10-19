// Design tokens ported 1:1 from the original style.css (:root variables)
export const colors = {
  bg: '#F2F0EB',
  surface: '#FFFFFF',
  surface2: '#F7F6F3',
  border: '#E2DDD6',
  textPrimary: '#1A1916',
  textSecondary: '#6B6760',
  textMuted: '#A09C96',
  accent: '#1D6BF3',
  accentLight: '#EBF1FE',
  accentDark: '#1050C8',
  success: '#0A8A4E',
  successLight: '#E6F7F0',
  error: '#D63B3B',
  errorLight: '#FDEAEA',
  warning: '#C07A12',
  warningLight: '#FEF4E5',
  // literal colours used inside the original rules
  feedbackSuccessText: '#0A5E38',
  feedbackSuccessBorder: '#B3E5CF',
  feedbackErrorText: '#9B1A1A',
  feedbackErrorBorder: '#F1B8B8',
  feedbackInfoBorder: '#BDD1FC',
  tagTrueFalseBg: '#FFF0E5',
  tagTrueFalseText: '#C05A12',
  tagInputBg: '#F0F7F0',
  tagInputText: '#1A7A40',
};

// --radius: 12px, --radius-sm: 8px, pills use 20px
export const radius = { md: 12, sm: 8, pill: 20 };

// --shadow / --shadow-lg (RN 0.76+ supports CSS-style boxShadow strings)
export const shadow = { boxShadow: '0 1px 3px rgba(26,25,22,0.08), 0 4px 16px rgba(26,25,22,0.06)' } as const;
export const shadowLg = { boxShadow: '0 8px 32px rgba(26,25,22,0.12)' } as const;

// Syne for headings, DM Sans for body (same families as the original).
// The original only loaded DM Sans 300/400/500, so its "600" text rendered at 500.
export const fonts = {
  display600: 'Syne_600SemiBold',
  display700: 'Syne_700Bold',
  display800: 'Syne_800ExtraBold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
};

export const PASS_THRESHOLD = 70;
export const SECONDS_PER_QUESTION = 30;
export const MIN_QUESTIONS = 10;
export const MAX_CONTENT_WIDTH = 760;
