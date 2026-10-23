import { useStyles, useTheme } from '../../src/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button, FadeUp, Page } from '../../src/components/ui';
import { useApp } from '../../src/context/AppContext';
import { getAllQuestions, getCollectionProgress, isCollection } from '../../src/lib/collection';
import { FINAL_REVIEW_COUNT, PASS_THRESHOLD, SECTION_UNLOCK_PCT, fonts, radius } from '../../src/theme';

// Recreates the 45deg repeating-linear-gradient stripe overlay from .results-header::before
function Stripes() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={{ position: 'absolute', left: '50%', top: '50%', width: 900, height: 900, marginLeft: -450, marginTop: -450, transform: [{ rotate: '45deg' }] }}>
        {Array.from({ length: 36 }).map((_, i) => (
          <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: i * 25 + 24, height: 1, backgroundColor: 'rgba(255,255,255,0.04)' }} />
        ))}
      </View>
    </View>
  );
}

export default function Results() {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const { lastResult: r, getSet, progress } = useApp();
  if (!r) return <Redirect href="/(app)" />;

  // Collections: what happens after a section? (r.sectionId is set for section runs, r.final for the final review)
  const set = getSet(r.setId);
  const prog = set && isCollection(set) ? getCollectionProgress(set, progress[set.id]) : null;
  const here = r.sectionId && prog ? prog.states.findIndex((x) => x.section.id === r.sectionId) : -1;
  const nextState = here >= 0 ? prog.states[here + 1] : undefined;
  const retakeParams = { setId: r.setId, count: String(r.count), ...(r.sectionId ? { sectionId: r.sectionId } : r.final ? { sectionId: 'all' } : {}) };
  const toCollection = () => router.dismissTo({ pathname: '/(app)/set/[id]', params: { id: r.setId } });
  const isSection = !!r.sectionId;

  const title = isSection ? (r.passed ? 'Section passed!' : 'Section complete') : r.final ? (r.passed ? 'Final review passed!' : 'Final review complete') : r.passed ? 'Assessment Passed!' : 'Assessment Complete';
  const unlock = isSection
    ? r.passed
      ? nextState ? `You scored ${r.pct}% — "${nextState.section.title}" is now unlocked`
        : prog?.complete ? `You scored ${r.pct}% — every section is complete!` : `You scored ${r.pct}% — section passed`
      : `You scored ${r.pct}% — get ${SECTION_UNLOCK_PCT}% or more to ${nextState ? 'unlock the next section' : 'complete this section'}`
    : r.passed ? `You scored ${r.pct}% — above the ${PASS_THRESHOLD}% threshold` : `You scored ${r.pct}% — below the ${PASS_THRESHOLD}% pass threshold`;

  // original: passed -> accent, >=50% -> warning, else error
  const headerBg = r.passed ? colors.accent : r.pct >= 50 ? colors.warning : colors.error;
  const dot = { correct: colors.success, incorrect: colors.error, skipped: colors.textMuted };
  const label = { correct: 'Correct', incorrect: 'Incorrect', skipped: 'Skipped' };

  return (
    <Page>
      <FadeUp>
        <View style={s.card}>
          <View style={[s.header, { backgroundColor: headerBg }]}>
            <Stripes />
            <View style={s.icon}>
              <Feather name={r.passed ? 'check' : 'alert-circle'} size={30} color="#fff" />
            </View>
            {isSection && !!r.sectionTitle && <Text style={s.kicker} numberOfLines={2}>{r.sectionTitle}</Text>}
            <Text style={s.title}>{title}</Text>
            <Text style={s.subtitle}>{unlock}</Text>
            <View style={s.scoreRow}>
              <Text style={s.scoreNum}>{r.points}</Text>
              <Text style={s.scoreDenom}>/{r.maxPoints}</Text>
            </View>
          </View>

          <View style={s.body}>
            <View style={s.grid}>
              {[['Correct', String(r.correct)], ['Incorrect', String(r.incorrect)], ['Score %', `${r.pct}%`]].map(([l, v]) => (
                <View key={l} style={s.statBlock}>
                  <Text style={s.statNum}>{v}</Text>
                  <Text style={s.statLabel}>{l}</Text>
                </View>
              ))}
            </View>

            <View style={s.review}>
              <Text style={s.reviewHeader}>Answer Review</Text>
              {r.review.map((item, i) => {
                const short = item.text.length > 60 ? item.text.slice(0, 60) + '…' : item.text;
                return (
                  <View key={i} style={[s.reviewItem, i === r.review.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={[s.dot, { backgroundColor: dot[item.status] }]} />
                    <Text style={s.reviewQ}>Q{i + 1} — {short}</Text>
                    <Text style={[s.reviewStatus, { color: dot[item.status] }]}>{label[item.status]}</Text>
                  </View>
                );
              })}
            </View>

            <View style={s.actions}>
              {isSection ? (
                <>
                  {r.passed && nextState ? (
                    <Button title="Next section" iconRight="chevron-right"
                      onPress={() => router.replace({ pathname: '/(app)/quiz', params: { setId: r.setId, sectionId: nextState.section.id, count: String(nextState.section.questions.length) } })} />
                  ) : r.passed && prog?.complete ? (
                    <Button title="Start final review" icon="award"
                      onPress={() => router.replace({ pathname: '/(app)/quiz', params: { setId: r.setId, sectionId: 'all', count: String(Math.min(FINAL_REVIEW_COUNT, getAllQuestions(set).length)) } })} />
                  ) : (
                    <Button title="Retake section" icon="rotate-ccw" onPress={() => router.replace({ pathname: '/(app)/quiz', params: retakeParams })} />
                  )}
                  {r.passed && <Button title="Retake section" variant="secondary" icon="rotate-ccw" onPress={() => router.replace({ pathname: '/(app)/quiz', params: retakeParams })} />}
                  <Button title="Back to collection" variant="link" onPress={toCollection} />
                </>
              ) : (
                <>
                  <Button title="Retake Assessment" icon="rotate-ccw" onPress={() => router.replace({ pathname: '/(app)/quiz', params: retakeParams })} />
                  <Button title="Submit to Gradebook" variant="secondary" icon="activity" onPress={() => Alert.alert('Gradebook', 'Results submitted to gradebook!')} />
                  {r.final ? <Button title="Back to collection" variant="link" onPress={toCollection} /> : <Button title="Back to home" variant="link" onPress={() => router.replace('/(app)')} />}
                </>
              )}
            </View>
          </View>
        </View>
      </FadeUp>
    </Page>
  );
}

const makeStyles = ({ colors, shadow, shadowLg }) => StyleSheet.create({
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, overflow: 'hidden', ...shadowLg },
  header: { paddingVertical: 36, paddingHorizontal: 32, alignItems: 'center', overflow: 'hidden' },
  icon: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  kicker: { fontFamily: fonts.bodyMedium, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 8 },
  title: { fontFamily: fonts.display800, fontSize: 28, letterSpacing: -0.5, color: '#fff', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
  scoreRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 4, marginTop: 20 },
  scoreNum: { fontFamily: fonts.display800, fontSize: 56, lineHeight: 56, letterSpacing: -2, color: '#fff' },
  scoreDenom: { fontFamily: fonts.display600, fontSize: 22, color: 'rgba(255,255,255,0.6)', paddingBottom: 8 },

  body: { padding: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 28 },
  statBlock: { flexGrow: 1, flexBasis: '45%', backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingVertical: 18, paddingHorizontal: 16, alignItems: 'center' },
  statNum: { fontFamily: fonts.display800, fontSize: 26, letterSpacing: -1, color: colors.textPrimary, marginBottom: 4 },
  statLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textMuted },

  review: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, overflow: 'hidden', marginBottom: 24 },
  reviewHeader: { paddingVertical: 14, paddingHorizontal: 18, backgroundColor: colors.surface2, borderBottomWidth: 1, borderBottomColor: colors.border, fontFamily: fonts.display700, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textSecondary },
  reviewItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: colors.border },
  dot: { width: 8, height: 8, borderRadius: 4 },
  reviewQ: { flex: 1, fontFamily: fonts.body, fontSize: 13.5, lineHeight: 20, color: colors.textSecondary },
  reviewStatus: { fontFamily: fonts.bodyMedium, fontSize: 12 },

  actions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 },
});
