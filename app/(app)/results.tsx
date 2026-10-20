import { Theme, useStyles, useTheme } from '../../src/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button, FadeUp, Page } from '../../src/components/ui';
import { useApp } from '../../src/context/AppContext';
import { PASS_THRESHOLD, fonts, radius } from '../../src/theme';

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
  const { lastResult: r } = useApp();
  if (!r) return <Redirect href="/(app)" />;

  // original: passed -> accent, >=50% -> warning, else error
  const headerBg = r.passed ? colors.accent : r.pct >= 50 ? colors.warning : colors.error;
  const dot = { correct: colors.success, incorrect: colors.error, skipped: colors.textMuted } as const;
  const label = { correct: 'Correct', incorrect: 'Incorrect', skipped: 'Skipped' } as const;

  return (
    <Page>
      <FadeUp>
        <View style={s.card}>
          <View style={[s.header, { backgroundColor: headerBg }]}>
            <Stripes />
            <View style={s.icon}>
              <Feather name={r.passed ? 'check' : 'alert-circle'} size={30} color="#fff" />
            </View>
            <Text style={s.title}>{r.passed ? 'Assessment Passed!' : 'Assessment Complete'}</Text>
            <Text style={s.subtitle}>
              {r.passed ? `You scored ${r.pct}% — above the ${PASS_THRESHOLD}% threshold` : `You scored ${r.pct}% — below the ${PASS_THRESHOLD}% pass threshold`}
            </Text>
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
              <Button title="Retake Assessment" icon="rotate-ccw"
                onPress={() => router.replace({ pathname: '/(app)/quiz', params: { setId: r.setId, count: String(r.count) } })} />
              <Button title="Submit to Gradebook" variant="secondary" icon="activity"
                onPress={() => Alert.alert('Gradebook', 'Results submitted to gradebook!')} />
              <Button title="Back to home" variant="link" onPress={() => router.replace('/(app)')} />
            </View>
          </View>
        </View>
      </FadeUp>
    </Page>
  );
}

const makeStyles = ({ colors, shadow, shadowLg }: Theme) => StyleSheet.create({
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, overflow: 'hidden', ...shadowLg },
  header: { paddingVertical: 36, paddingHorizontal: 32, alignItems: 'center', overflow: 'hidden' },
  icon: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
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
