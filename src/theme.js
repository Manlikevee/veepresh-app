// Design tokens ported 1:1 from the original style.css (:root variables) + a matching dark palette.
export const lightColors = {
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

export const darkColors = {
  bg: '#121110',
  surface: '#1C1B19',
  surface2: '#242321',
  border: '#37342F',
  textPrimary: '#F2F0EB',
  textSecondary: '#ABA69E',
  textMuted: '#7A766F',
  accent: '#4C8DFF',
  accentLight: '#1A2A47',
  accentDark: '#3A78EC',
  success: '#34C284',
  successLight: '#10291E',
  error: '#F06A67',
  errorLight: '#341A1A',
  warning: '#E3A23A',
  warningLight: '#33270F',
  feedbackSuccessText: '#86E3B6',
  feedbackSuccessBorder: '#1F5B40',
  feedbackErrorText: '#FFB0AE',
  feedbackErrorBorder: '#6A2B2A',
  feedbackInfoBorder: '#2B4A82',
  tagTrueFalseBg: '#36220F',
  tagTrueFalseText: '#FF9D61',
  tagInputBg: '#12301D',
  tagInputText: '#62D790',
};

// --radius: 12px, --radius-sm: 8px, pills use 20px
export const radius = { md: 12, sm: 8, pill: 20 };

// --shadow / --shadow-lg (RN supports CSS-style boxShadow strings)
export const shadows = {
  light: {
    shadow: { boxShadow: '0 1px 3px rgba(26,25,22,0.08), 0 4px 16px rgba(26,25,22,0.06)' },
    shadowLg: { boxShadow: '0 8px 32px rgba(26,25,22,0.12)' },
  },
  dark: {
    shadow: { boxShadow: '0 1px 3px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.3)' },
    shadowLg: { boxShadow: '0 8px 32px rgba(0,0,0,0.55)' },
  },
};

// Syne for headings, DM Sans for body (same families as the original).
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
// Collections: score at least this % in a section to unlock the next one.
export const SECTION_UNLOCK_PCT = PASS_THRESHOLD;
// Collections: size of the mixed "final review" quiz that unlocks after the last section.
export const FINAL_REVIEW_COUNT = 20;
export const MAX_CONTENT_WIDTH = 760;
