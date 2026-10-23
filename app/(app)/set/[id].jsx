import { Feather } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, BackRow, Button, Card, FadeUp, MetaCard, Page, ProgressBar, SectionTitle } from '../../../src/components/ui';
import { useApp } from '../../../src/context/AppContext';
import { useStyles, useTheme } from '../../../src/context/ThemeContext';
import { countQuestions, getCollectionProgress, isCollection } from '../../../src/lib/collection';
import { estimateMinutes } from '../../../src/lib/quiz';
import { FINAL_REVIEW_COUNT, MIN_QUESTIONS, PASS_THRESHOLD, SECTION_UNLOCK_PCT, fonts, radius } from '../../../src/theme';

export default function SetDetail() {
  const { id } = useLocalSearchParams();
  const { getSet } = useApp();
  const set = getSet(id);

  if (!set) return <Redirect href="/(app)" />;
  if (set.status !== 'published') return <EditingNotice set={set} />;
  return isCollection(set) ? <CollectionDetail set={set} /> : <SingleDetail set={set} />;
}

/* ───────────── draft sets can't be taken yet ───────────── */
function EditingNotice({ set }) {
  const { colors } = useTheme();
  return (
    <Page>
      <BackRow onBack={() => router.back()} />
      <Card style={{ alignItems: 'center', paddingVertical: 30 }}>
        <Feather name="edit-3" size={26} color={colors.warning} />
        <Text style={{ fontFamily: fonts.display700, fontSize: 19, letterSpacing: -0.3, color: colors.textPrimary, marginTop: 14 }}>
          This {isCollection(set) ? 'collection' : 'quiz'} is in editing mode
        </Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 14.5, lineHeight: 23, color: colors.textSecondary, textAlign: 'center', marginTop: 6 }}>
          Publish it from the editor to start learning.
        </Text>
        <Button title="Open editor" icon="edit-3" onPress={() => router.replace({ pathname: '/(app)/editor/[id]', params: { id: set.id } })} style={{ marginTop: 18 }} />
      </Card>
    </Page>
  );
}

const editButton = (set) =>
  !set.isSample ? (
    <Button title="Edit" variant="secondary" icon="edit-3" onPress={() => router.push({ pathname: '/(app)/editor/[id]', params: { id: set.id } })} style={{ paddingVertical: 8, paddingHorizontal: 14 }} />
  ) : undefined;

const publicBadge = (set) => (set.visibility === 'public' ? <Badge label="Public" tone="success" icon="globe" /> : undefined);

/* ───────────── single quiz (unchanged behaviour) ───────────── */
function SingleDetail({ set }) {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const max = set.questions.length;
  const [count, setCount] = useState(Math.min(25, max));

  const min = Math.min(MIN_QUESTIONS, max);
  const clamp = (n) => Math.min(Math.max(n, min), max);
  const points = set.questions.slice(0, count).reduce((sum, q) => sum + q.points, 0);
  const presets = [10, 25, 50, max].filter((v, i, a) => v <= max && a.indexOf(v) === i);

  return (
    <Page>
      <BackRow onBack={() => router.back()} right={editButton(set)} />

      <FadeUp>
        <MetaCard
          category={set.category}
          title={set.title}
          description={set.description}
          right={publicBadge(set)}
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

/* ───────────── collection: sections that unlock one after another ───────────── */
function CollectionDetail({ set }) {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const { progress, resetSetProgress } = useApp();
  const prog = getCollectionProgress(set, progress[set.id]);
  const total = countQuestions(set);
  const finalCount = Math.min(FINAL_REVIEW_COUNT, total);

  const openSection = (state) => {
    if (state.status === 'locked') {
      const before = prog.states[state.index - 1].section;
      Alert.alert('Section locked', `Score at least ${SECTION_UNLOCK_PCT}% in "${before.title}" to unlock this section.`);
      return;
    }
    router.push({
      pathname: '/(app)/quiz',
      params: { setId: set.id, sectionId: state.section.id, count: String(state.section.questions.length) },
    });
  };

  const startFinal = () =>
    router.push({ pathname: '/(app)/quiz', params: { setId: set.id, sectionId: 'all', count: String(finalCount) } });

  const confirmReset = () =>
    Alert.alert('Reset progress', 'Lock every section again except the first? Your score history stays in your profile.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => resetSetProgress(set.id) },
    ]);

  const continueLabel = prog.complete
    ? 'Start final review'
    : prog.done === 0
    ? 'Start section 1'
    : `Continue with section ${(prog.current?.index ?? 0) + 1}`;

  return (
    <Page>
      <BackRow onBack={() => router.back()} right={editButton(set)} />

      <FadeUp>
        <MetaCard
          category={`Collection · ${set.category}`}
          title={set.title}
          description={set.description}
          right={publicBadge(set)}
          stats={[
            { icon: 'layers', strong: `${prog.total} sections` },
            { icon: 'file', strong: `${total} questions` },
            { icon: 'clock', pre: 'about ', strong: `${estimateMinutes(total)} minutes` },
            { icon: 'check-circle', pre: 'Unlock next section at ', strong: `${SECTION_UNLOCK_PCT}%` },
          ]}
        />
      </FadeUp>

      <FadeUp delay={80} style={{ marginTop: 16 }}>
        <Card>
          <View style={s.progressTop}>
            <Text style={s.progressTitle}>Your progress</Text>
            <Text style={s.progressCount}>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.bodyMedium }}>{prog.done}</Text> of {prog.total} sections
            </Text>
          </View>
          <ProgressBar pct={prog.pct} />
          <Button
            title={continueLabel}
            iconRight="chevron-right"
            size="lg"
            onPress={() => (prog.complete ? startFinal() : prog.current && openSection(prog.current))}
            style={{ marginTop: 18 }}
          />
        </Card>
      </FadeUp>

      <FadeUp delay={140} style={{ marginTop: 28 }}>
        <SectionTitle>Sections</SectionTitle>
        <View style={{ gap: 12 }}>
          {prog.states.map((st) => {
            const locked = st.status === 'locked';
            const done = st.status === 'completed';
            const current = prog.current?.index === st.index;
            const qCount = st.section.questions.length;
            return (
              <Pressable
                key={st.section.id}
                onPress={() => openSection(st)}
                style={({ pressed }) => [s.section, current && { borderColor: colors.accent }, locked && { opacity: 0.6 }, pressed && !locked && { opacity: 0.92 }]}
              >
                <View style={[s.num, done && { backgroundColor: colors.successLight }, locked && { backgroundColor: colors.surface2 }]}>
                  {done ? <Feather name="check" size={16} color={colors.success} />
                    : locked ? <Feather name="lock" size={15} color={colors.textMuted} />
                    : <Text style={s.numText}>{st.index + 1}</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.sectionTitle}>{st.section.title}</Text>
                  {!!st.section.description && <Text style={s.sectionDesc} numberOfLines={2}>{st.section.description}</Text>}
                  <View style={s.sectionMeta}>
                    <Text style={s.metaText}>{qCount} {qCount === 1 ? 'question' : 'questions'}</Text>
                    {st.best !== null && <Badge label={`Best ${st.best}%`} tone={done ? 'success' : 'warning'} />}
                    {locked && <Badge label="Locked" tone="muted" icon="lock" />}
                    {current && !done && <Badge label={st.attempts ? 'Try again' : 'Up next'} tone="accent" />}
                  </View>
                </View>
                {!locked && <Feather name={done ? 'rotate-ccw' : 'play'} size={16} color={done ? colors.textMuted : colors.accent} style={{ marginTop: 4 }} />}
              </Pressable>
            );
          })}

          {/* final mixed review */}
          <Pressable
            onPress={() => (prog.complete ? startFinal() : Alert.alert('Final review locked', 'Pass every section to unlock a mixed review of all the questions.'))}
            style={[s.section, { borderStyle: 'dashed' }, !prog.complete && { opacity: 0.6 }]}
          >
            <View style={[s.num, { backgroundColor: prog.complete ? colors.warningLight : colors.surface2 }]}>
              <Feather name={prog.complete ? 'award' : 'lock'} size={16} color={prog.complete ? colors.warning : colors.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.sectionTitle}>Final review</Text>
              <Text style={s.sectionDesc}>
                {prog.complete ? `A mixed round of ${finalCount} questions from every section.` : 'Unlocks after you pass every section.'}
              </Text>
            </View>
            {prog.complete && <Feather name="play" size={16} color={colors.accent} style={{ marginTop: 4 }} />}
          </Pressable>
        </View>

        {prog.done > 0 && <Button title="Reset progress" variant="link" onPress={confirmReset} style={{ alignSelf: 'center', marginTop: 20 }} />}
      </FadeUp>
    </Page>
  );
}

const makeStyles = ({ colors, shadow }) => StyleSheet.create({
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

  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  progressTitle: { fontFamily: fonts.display700, fontSize: 15, letterSpacing: -0.2, color: colors.textPrimary },
  progressCount: { fontFamily: fonts.body, fontSize: 13, color: colors.textSecondary },
  section: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: 16, ...shadow },
  num: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.accentLight, alignItems: 'center', justifyContent: 'center' },
  numText: { fontFamily: fonts.display700, fontSize: 14, color: colors.accent },
  sectionTitle: { fontFamily: fonts.display600, fontSize: 15.5, lineHeight: 21, letterSpacing: -0.2, color: colors.textPrimary },
  sectionDesc: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 20, color: colors.textSecondary, marginTop: 3 },
  sectionMeta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 10 },
  metaText: { fontFamily: fonts.body, fontSize: 12.5, color: colors.textMuted },
});
