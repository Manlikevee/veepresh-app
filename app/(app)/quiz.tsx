import { Theme, useStyles, useTheme } from '../../src/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, FadeUp, MetaCard, Page, ProgressBar } from '../../src/components/ui';
import { useApp } from '../../src/context/AppContext';
import { buildQuiz, estimateMinutes, pad } from '../../src/lib/quiz';
import { PASS_THRESHOLD, SECONDS_PER_QUESTION, fonts, radius } from '../../src/theme';
import type { Question, QuestionSet, QuizResult } from '../../src/types';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function Quiz() {
  const { setId, count } = useLocalSearchParams<{ setId: string; count: string }>();
  const { getSet, setLastResult, addAttempt } = useApp();
  const set = getSet(setId);
  if (!set || set.status !== 'published') return <Redirect href="/(app)" />;
  return (
    <QuizRunner
      set={set}
      count={Number(count) || 10}
      onFinish={(r) => { setLastResult(r); addAttempt(r, set.title); router.replace('/(app)/results'); }}
    />
  );
}

function QuizRunner({ set, count, onFinish }: { set: QuestionSet; count: number; onFinish: (r: QuizResult) => void }) {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const [questions] = useState<Question[]>(() => buildQuiz(set.questions, count));
  const n = questions.length;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(n).fill(null));
  const [submitted, setSubmitted] = useState<boolean[]>(() => Array(n).fill(false));
  const [skipped, setSkipped] = useState<boolean[]>(() => Array(n).fill(false));
  const [secondsLeft, setSecondsLeft] = useState(n * SECONDS_PER_QUESTION);
  const finished = useRef(false);

  const latest = useRef({ answers, skipped });
  latest.current = { answers, skipped };

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    const { answers: a, skipped: sk } = latest.current;
    let correct = 0, incorrect = 0, skippedCount = 0, points = 0;
    const review = questions.map((q, i) => {
      if (sk[i] || a[i] === null) { skippedCount++; return { text: q.text, status: 'skipped' as const }; }
      if (a[i] === q.correct) { correct++; points += q.points; return { text: q.text, status: 'correct' as const }; }
      incorrect++;
      return { text: q.text, status: 'incorrect' as const };
    });
    const maxPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const pct = maxPoints ? Math.round((points / maxPoints) * 100) : 0;
    onFinish({ setId: set.id, count: n, total: n, correct, incorrect, skipped: skippedCount, points, maxPoints, pct, passed: pct >= PASS_THRESHOLD, review });
  };

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (secondsLeft <= 0) finish(); }, [secondsLeft]);

  const confirmQuit = () => {
    Alert.alert('Quit assessment?', 'Your progress will be lost.', [
      { text: 'Keep going', style: 'cancel' },
      { text: 'Quit', style: 'destructive', onPress: () => { finished.current = true; router.back(); } },
    ]);
    return true;
  };
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', confirmQuit);
    return () => sub.remove();
  }, []);

  const q = questions[current];
  const isSubmitted = submitted[current];
  const ans = answers[current];
  const setAt = <T,>(arr: T[], i: number, v: T) => arr.map((x, idx) => (idx === i ? v : x));

  const select = (i: number) => { if (!isSubmitted) setAnswers(setAt(answers, current, i)); };
  const skip = () => {
    setSkipped(setAt(skipped, current, true));
    setAnswers(setAt(answers, current, null));
    setSubmitted(setAt(submitted, current, true));
  };
  const next = () => {
    if (!isSubmitted) return setSubmitted(setAt(submitted, current, true));
    if (current === n - 1) return finish();
    setCurrent(current + 1);
  };

  const totalPoints = questions.reduce((sum, x) => sum + x.points, 0);
  const secs = Math.max(secondsLeft, 0);
  const urgent = secondsLeft <= 60;
  const isCorrect = isSubmitted && ans === q.correct;
  const fb = isCorrect ? 'correct' : skipped[current] ? 'info' : 'incorrect';
  const fbStyle = {
    correct: { bg: colors.successLight, fg: colors.feedbackSuccessText, border: colors.feedbackSuccessBorder },
    incorrect: { bg: colors.errorLight, fg: colors.feedbackErrorText, border: colors.feedbackErrorBorder },
    info: { bg: colors.accentLight, fg: colors.accentDark, border: colors.feedbackInfoBorder },
  }[fb];

  return (
    <Page>
      {/* Header (.quiz-header / .quiz-meta) */}
      <FadeUp>
        <View style={{ alignItems: 'flex-start', marginBottom: 14 }}>
          <Button title="Exit assessment" variant="link" onPress={confirmQuit} />
        </View>
        <MetaCard
          category={set.category}
          title={set.title}
          description={set.description}
          stats={[
            { icon: 'clock', strong: `${estimateMinutes(n)} minutes`, post: ' estimated' },
            { icon: 'file', strong: `${n} questions` },
            { icon: 'star', strong: `${totalPoints} points`, post: ' total' },
            { icon: 'check-circle', pre: 'Pass threshold: ', strong: `${PASS_THRESHOLD}%` },
          ]}
        />
      </FadeUp>

      {/* Progress (.progress-wrapper) */}
      <FadeUp delay={100} style={{ marginTop: 32, marginBottom: 20 }}>
        <View style={s.progressRow}>
          <Text style={s.progressLabel}>Progress</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={[s.timer, urgent && s.timerUrgent]}>
              <Feather name="clock" size={13} color={urgent ? colors.error : colors.textSecondary} />
              <Text style={[s.timerText, urgent && { color: colors.error }]}>{pad(Math.floor(secs / 60))}:{pad(secs % 60)}</Text>
            </View>
            <Text style={s.fraction}>
              <Text style={s.fractionNum}>{current + 1}</Text> of <Text style={s.fractionNum}>{n}</Text>
            </Text>
          </View>
        </View>
        <ProgressBar pct={((current + 1) / n) * 100} />
      </FadeUp>

      {/* Question card (.question-card) */}
      <FadeUp delay={150}>
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.qNumber}>Question {pad(current + 1)}</Text>
            <View style={s.tag}><Text style={s.tagText}>Multiple Choice</Text></View>
          </View>

          <View style={s.body}>
            <Text style={s.qText}>{q.text}</Text>

            <View style={{ gap: 10 }}>
              {q.options.map((opt, i) => {
                const isRight = isSubmitted && i === q.correct;
                const isWrong = isSubmitted && ans === i && i !== q.correct;
                const selected = !isSubmitted && ans === i;
                const dimmed = isSubmitted && !isRight && !isWrong;
                return (
                  <Pressable
                    key={i}
                    onPress={() => select(i)}
                    style={({ pressed }) => [
                      s.option,
                      (selected || (pressed && !isSubmitted)) && { borderColor: colors.accent, backgroundColor: colors.accentLight },
                      isRight && { borderColor: colors.success, backgroundColor: colors.successLight },
                      isWrong && { borderColor: colors.error, backgroundColor: colors.errorLight },
                      dimmed && { opacity: 0.7 },
                    ]}
                  >
                    <View style={[
                      s.letter,
                      selected && { backgroundColor: colors.accent, borderColor: colors.accent },
                      isRight && { backgroundColor: colors.success, borderColor: colors.success },
                      isWrong && { backgroundColor: colors.error, borderColor: colors.error },
                    ]}>
                      <Text style={[s.letterText, (selected || isRight || isWrong) && { color: '#fff' }]}>{LETTERS[i]}</Text>
                    </View>
                    <Text style={s.optionText}>{opt}</Text>
                    {isRight && <Feather name="check" size={16} color={colors.success} style={{ marginTop: 4 }} />}
                    {isWrong && <Feather name="x" size={16} color={colors.error} style={{ marginTop: 4 }} />}
                  </Pressable>
                );
              })}
            </View>

            {isSubmitted && (
              <FadeUp style={[s.feedback, { backgroundColor: fbStyle.bg, borderColor: fbStyle.border }]}>
                <Feather name={fb === 'correct' ? 'check' : 'alert-circle'} size={16} color={fbStyle.fg} style={{ marginTop: 1 }} />
                <Text style={[s.feedbackText, { color: fbStyle.fg }]}>{q.feedback}</Text>
              </FadeUp>
            )}
          </View>

          <View style={s.footer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={s.points}><Text style={s.pointsText}>{q.points} pts</Text></View>
              {!isSubmitted && <Button title="Skip question" variant="link" onPress={skip} />}
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {current > 0 && <Button title="Back" variant="secondary" icon="chevron-left" onPress={() => setCurrent(current - 1)} />}
              <Button
                title={isSubmitted ? (current === n - 1 ? 'View Results' : 'Next Question') : 'Submit Answer'}
                iconRight="chevron-right"
                onPress={next}
                disabled={!isSubmitted && ans === null}
              />
            </View>
          </View>
        </View>
      </FadeUp>
    </Page>
  );
}

const makeStyles = ({ colors, shadow, shadowLg }: Theme) => StyleSheet.create({
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressLabel: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.textSecondary },
  fraction: { fontFamily: fonts.body, fontSize: 12.5, color: colors.textSecondary },
  fractionNum: { fontFamily: fonts.bodyMedium, color: colors.textPrimary },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.pill },
  timerUrgent: { backgroundColor: colors.errorLight, borderColor: colors.feedbackErrorBorder },
  timerText: { fontFamily: fonts.bodyMedium, fontSize: 13, fontVariant: ['tabular-nums'], color: colors.textSecondary },

  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, overflow: 'hidden', ...shadow },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface2 },
  qNumber: { fontFamily: fonts.display700, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: colors.textMuted },
  tag: { backgroundColor: colors.accentLight, paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill },
  tagText: { fontFamily: fonts.bodyMedium, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.accent },

  body: { padding: 20 },
  qText: { fontFamily: fonts.display600, fontSize: 16, lineHeight: 23, letterSpacing: -0.3, color: colors.textPrimary, marginBottom: 24 },

  option: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, backgroundColor: colors.surface },
  letter: { width: 28, height: 28, borderRadius: 6, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  letterText: { fontFamily: fonts.display700, fontSize: 12, color: colors.textMuted },
  optionText: { flex: 1, fontFamily: fonts.body, fontSize: 14.5, lineHeight: 22, color: colors.textPrimary, paddingTop: 4 },

  feedback: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 18, paddingVertical: 14, paddingHorizontal: 16, borderRadius: radius.sm, borderWidth: 1 },
  feedbackText: { flex: 1, fontFamily: fonts.body, fontSize: 13.5, lineHeight: 21 },

  footer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 16, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: colors.border },
  points: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  pointsText: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.textSecondary },
});
