import { Theme, useStyles, useTheme } from '../../../src/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BackRow, Button, Card, FadeUp, MetaCard, Page } from '../../../src/components/ui';
import { useApp } from '../../../src/context/AppContext';
import { estimateMinutes } from '../../../src/lib/quiz';
import { MIN_QUESTIONS, PASS_THRESHOLD, fonts, radius } from '../../../src/theme';

export default function SetDetail() {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getSet } = useApp();
  const set = getSet(id);
  const max = set?.questions.length ?? 0;
  const [count, setCount] = useState(Math.min(25, max));

  if (!set) return <Redirect href="/(app)" />;

  if (set.status !== 'published') {
    return (
      <Page>
        <BackRow onBack={() => router.back()} />
        <Card style={{ alignItems: 'center', paddingVertical: 30 }}>
          <Feather name="edit-3" size={26} color={colors.warning} />
          <Text style={{ fontFamily: fonts.display700, fontSize: 19, letterSpacing: -0.3, color: colors.textPrimary, marginTop: 14 }}>This quiz is in editing mode</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 14.5, lineHeight: 23, color: colors.textSecondary, textAlign: 'center', marginTop: 6 }}>
            Publish it from the editor to take the quiz.
          </Text>
          <Button title="Open editor" icon="edit-3" onPress={() => router.replace({ pathname: '/(app)/editor/[id]', params: { id: set.id } })} style={{ marginTop: 18 }} />
        </Card>
      </Page>
    );
  }

  const min = Math.min(MIN_QUESTIONS, max);
  const clamp = (n: number) => Math.min(Math.max(n, min), max);
  const points = set.questions.slice(0, count).reduce((sum, q) => sum + q.points, 0);
  const presets = [10, 25, 50, max].filter((v, i, a) => v <= max && a.indexOf(v) === i);

  return (
    <Page>
      <BackRow
        onBack={() => router.back()}
        right={
          !set.isSample ? (
            <Button title="Edit" variant="secondary" icon="edit-3" onPress={() => router.push({ pathname: '/(app)/editor/[id]', params: { id: set.id } })} style={{ paddingVertical: 8, paddingHorizontal: 14 }} />
          ) : undefined
        }
      />

      <FadeUp>
        <MetaCard
          category={set.category}
          title={set.title}
          description={set.description}
          stats={[
            { icon: 'clock', strong: `${estimateMinutes(count)} minutes`, post: ' estimated' },
            { icon: 'file', strong: `${count} questions` },
            { icon: 'star', strong: `${points} points`, post: ' total' },
            { icon: 'check-circle', pre: 'Pass threshold: ', strong: `${PASS_THRESHOLD}%` },
          ]}
        />
      </FadeUp>

      <FadeUp delay={100} style={{ marginTop: 20 }}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <View style={s.cardHeader}>
            <Text style={s.cardHeaderText}>Questions</Text>
            <View style={s.tag}><Text style={s.tagText}>{min}–{max}</Text></View>
          </View>
          <View style={{ padding: 22 }}>
            <Text style={s.question}>How many questions would you like to answer?</Text>

            <View style={s.stepper}>
              <Pressable onPress={() => setCount(clamp(count - 5))} style={({ pressed }) => [s.stepBtn, pressed && { borderColor: colors.accent }]}>
                <Feather name="minus" size={18} color={colors.textPrimary} />
              </Pressable>
              <Text style={s.count}>{count}</Text>
              <Pressable onPress={() => setCount(clamp(count + 5))} style={({ pressed }) => [s.stepBtn, pressed && { borderColor: colors.accent }]}>
                <Feather name="plus" size={18} color={colors.textPrimary} />
              </Pressable>
            </View>

            <View style={s.chips}>
              {presets.map((p) => (
                <Pressable key={p} onPress={() => setCount(p)} style={[s.chip, count === p && s.chipActive]}>
                  <Text style={[s.chipText, count === p && { color: colors.accent }]}>{p === max ? `All (${p})` : p}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View style={s.footer}>
            <Button title="Start assessment" iconRight="chevron-right" size="lg" style={{ flex: 1 }}
              onPress={() => router.push({ pathname: '/(app)/quiz', params: { setId: set.id, count: String(count) } })} />
          </View>
        </Card>
      </FadeUp>
    </Page>
  );
}

const makeStyles = ({ colors, shadow, shadowLg }: Theme) => StyleSheet.create({
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 22, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface2 },
  cardHeaderText: { fontFamily: fonts.display700, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: colors.textMuted },
  tag: { backgroundColor: colors.accentLight, paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill },
  tagText: { fontFamily: fonts.bodyMedium, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.accent },
  question: { fontFamily: fonts.display600, fontSize: 16, lineHeight: 23, letterSpacing: -0.3, color: colors.textPrimary },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 24 },
  stepBtn: { width: 44, height: 44, borderRadius: radius.sm, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  count: { fontFamily: fonts.display800, fontSize: 56, lineHeight: 56, letterSpacing: -2, color: colors.textPrimary, minWidth: 100, textAlign: 'center' },
  chips: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginTop: 24 },
  chip: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 5, borderRadius: radius.pill },
  chipActive: { backgroundColor: colors.accentLight, borderColor: colors.accent },
  chipText: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.textSecondary },
  footer: { flexDirection: 'row', paddingVertical: 18, paddingHorizontal: 22, borderTopWidth: 1, borderTopColor: colors.border },
});
