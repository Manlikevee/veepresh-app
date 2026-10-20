import { Feather } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Badge, BackRow, Button, Card, Field, Segmented, useText } from '../../../src/components/ui';
import { useApp } from '../../../src/context/AppContext';
import { Theme, useStyles, useTheme } from '../../../src/context/ThemeContext';
import { MAX_OPTIONS, MIN_OPTIONS, emptyQuestion, exportSetJson, validateQuestion } from '../../../src/lib/quizSchema';
import { usePublish } from '../../../src/lib/usePublish';
import { MAX_CONTENT_WIDTH, fonts, radius } from '../../../src/theme';
import type { Question, QuestionSet, SetStatus } from '../../../src/types';

export default function Editor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const s = useStyles(makeStyles);
  const t = useText();
  const { getSet, updateSet, removeSet } = useApp();
  const publish = usePublish();
  const set = getSet(id);
  const [openId, setOpenId] = useState<string | null>(null);
  const listRef = useRef<FlatList<Question>>(null);

  if (!set || set.isSample) return <Redirect href="/(app)" />;

  const patch = (p: Partial<QuestionSet>) => updateSet(set.id, p);
  const patchQuestion = (qid: string, fn: (q: Question) => Question) =>
    updateSet(set.id, (cur) => ({ questions: cur.questions.map((q) => (q.id === qid ? fn(q) : q)) }));

  const addQuestion = () => {
    const q = emptyQuestion();
    updateSet(set.id, (cur) => ({ questions: [...cur.questions, q] }));
    setOpenId(q.id);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 200);
  };

  const removeQuestion = (qid: string) =>
    Alert.alert('Delete question', 'Remove this question from the quiz?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => updateSet(set.id, (cur) => ({ questions: cur.questions.filter((q) => q.id !== qid) })) },
    ]);

  const moveQuestion = (qid: string, dir: -1 | 1) =>
    updateSet(set.id, (cur) => {
      const arr = [...cur.questions];
      const i = arr.findIndex((q) => q.id === qid);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= arr.length) return {};
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { questions: arr };
    });

  const onStatus = (v: SetStatus) => {
    const res = publish(set, v === 'published');
    if (!res.ok && res.firstInvalid >= 0) {
      setOpenId(set.questions[res.firstInvalid].id);
      setTimeout(() => listRef.current?.scrollToIndex({ index: res.firstInvalid, animated: true, viewOffset: 12 }), 150);
    }
  };

  const confirmDelete = () =>
    Alert.alert('Delete quiz', `Delete "${set.title}"? Reminders for it will be removed too.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await removeSet(set.id); router.replace('/(app)/(tabs)/create'); } },
    ]);

  const exportJson = () => Share.share({ title: set.title, message: exportSetJson(set) }).catch(() => {});

  const header = (
    <View>
      <BackRow onBack={() => router.back()} right={<Button title="Export JSON" variant="secondary" icon="share" onPress={exportJson} style={{ paddingVertical: 8, paddingHorizontal: 14 }} />} />
      <Text style={t.h1}>Quiz editor</Text>
      <Text style={[t.lead, { marginTop: 8, marginBottom: 20 }]}>Changes save automatically.</Text>

      <Card style={{ marginBottom: 16 }}>
        <Text style={[t.sectionTitle, { marginBottom: 12 }]}>Status</Text>
        <Segmented<SetStatus>
          value={set.status}
          onChange={onStatus}
          options={[
            { value: 'draft', label: 'Editing', icon: 'edit-3' },
            { value: 'published', label: 'Published', icon: 'check-circle' },
          ]}
        />
        <Text style={[t.muted, { marginTop: 12, lineHeight: 19 }]}>
          {set.status === 'published'
            ? 'Published: this quiz is on your Home screen and can be taken or used in reminders.'
            : 'Editing: only you can see this quiz. Publish it when every question is complete.'}
        </Text>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <Field label="Title" value={set.title} onChangeText={(v) => patch({ title: v })} placeholder="e.g. Chapter 4 revision" />
        <Field label="Category" value={set.category} onChangeText={(v) => patch({ category: v })} placeholder="e.g. Biology 101" />
        <Field label="Description" value={set.description} onChangeText={(v) => patch({ description: v })} placeholder="What is this quiz about?" multiline />
      </Card>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={t.sectionTitle}>Questions ({set.questions.length})</Text>
        <Button title="Add question" icon="plus" onPress={addQuestion} style={{ paddingVertical: 8, paddingHorizontal: 14 }} />
      </View>
    </View>
  );

  const footer = (
    <View style={{ marginTop: 8, gap: 12 }}>
      <Button title="Add question" variant="secondary" icon="plus" onPress={addQuestion} />
      <Button title="Delete quiz" variant="danger" icon="trash-2" onPress={confirmDelete} />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <FlatList
          ref={listRef}
          data={set.questions}
          keyExtractor={(q) => q.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, paddingBottom: 48, width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' }}
          ListHeaderComponent={header}
          ListFooterComponent={footer}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          onScrollToIndexFailed={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item, index }) => (
            <QuestionItem
              q={item}
              index={index}
              open={openId === item.id}
              isFirst={index === 0}
              isLast={index === set.questions.length - 1}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)}
              onChange={(fn) => patchQuestion(item.id, fn)}
              onDelete={() => removeQuestion(item.id)}
              onMove={(d) => moveQuestion(item.id, d)}
            />
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function QuestionItem({
  q, index, open, isFirst, isLast, onToggle, onChange, onDelete, onMove,
}: {
  q: Question; index: number; open: boolean; isFirst: boolean; isLast: boolean;
  onToggle: () => void; onChange: (fn: (q: Question) => Question) => void; onDelete: () => void; onMove: (d: -1 | 1) => void;
}) {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const problem = validateQuestion(q);

  const setOption = (i: number, v: string) => onChange((x) => ({ ...x, options: x.options.map((o, idx) => (idx === i ? v : o)) }));
  const addOption = () => onChange((x) => ({ ...x, options: [...x.options, ''] }));
  const removeOption = (i: number) =>
    onChange((x) => ({
      ...x,
      options: x.options.filter((_, idx) => idx !== i),
      correct: x.correct === i ? 0 : x.correct > i ? x.correct - 1 : x.correct,
    }));
  const bumpPoints = (d: number) => onChange((x) => ({ ...x, points: Math.min(20, Math.max(1, x.points + d)) }));

  return (
    <View style={[s.qCard, open && { borderColor: colors.accent }]}>
      <Pressable onPress={onToggle} style={s.qHeader}>
        <View style={[s.qNum, problem ? { backgroundColor: colors.errorLight } : { backgroundColor: colors.accentLight }]}>
          <Text style={[s.qNumText, { color: problem ? colors.error : colors.accent }]}>{index + 1}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.qPreview, !q.text.trim() && { color: colors.textMuted, fontStyle: 'italic' }]} numberOfLines={open ? 1 : 2}>
            {q.text.trim() || 'Empty question'}
          </Text>
          {!open && problem && <Text style={s.qProblem}>{problem}</Text>}
        </View>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
      </Pressable>

      {open && (
        <View style={s.qBody}>
          <Field label="Question" value={q.text} onChangeText={(v) => onChange((x) => ({ ...x, text: v }))} placeholder="Type the question…" multiline />

          <Text style={s.label}>Answer options · tap the circle to mark the correct one</Text>
          <View style={{ gap: 10, marginBottom: 16 }}>
            {q.options.map((opt, i) => {
              const right = q.correct === i;
              return (
                <View key={i} style={s.optRow}>
                  <Pressable onPress={() => onChange((x) => ({ ...x, correct: i }))} hitSlop={8} style={[s.radio, right && { backgroundColor: colors.success, borderColor: colors.success }]}>
                    {right && <Feather name="check" size={14} color="#fff" />}
                  </Pressable>
                  <View style={[s.optInputWrap, right && { borderColor: colors.success, backgroundColor: colors.successLight }]}>
                    <Text style={s.optLetter}>{String.fromCharCode(65 + i)}</Text>
                    <TextInput
                      value={opt}
                      onChangeText={(v) => setOption(i, v)}
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      placeholderTextColor={colors.textMuted}
                      selectionColor={colors.accent}
                      style={s.optInput}
                      multiline
                    />
                  </View>
                  {q.options.length > MIN_OPTIONS && (
                    <Pressable onPress={() => removeOption(i)} hitSlop={8}><Feather name="x" size={18} color={colors.textMuted} /></Pressable>
                  )}
                </View>
              );
            })}
            {q.options.length < MAX_OPTIONS && (
              <Button title="Add option" variant="secondary" icon="plus" onPress={addOption} style={{ alignSelf: 'flex-start', paddingVertical: 8 }} />
            )}
          </View>

          <Field label="Explanation shown after answering (optional)" value={q.feedback} onChangeText={(v) => onChange((x) => ({ ...x, feedback: v }))} placeholder="Why is that the right answer?" multiline />

          <View style={s.pointsRow}>
            <Text style={s.label}>Points</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <Pressable onPress={() => bumpPoints(-1)} style={s.stepBtn}><Feather name="minus" size={16} color={colors.textPrimary} /></Pressable>
              <Text style={s.pointsNum}>{q.points}</Text>
              <Pressable onPress={() => bumpPoints(1)} style={s.stepBtn}><Feather name="plus" size={16} color={colors.textPrimary} /></Pressable>
            </View>
          </View>

          {problem && <View style={{ marginTop: 14 }}><Badge label={problem} tone="error" icon="alert-circle" /></View>}

          <View style={s.qFooter}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable disabled={isFirst} onPress={() => onMove(-1)} style={[s.stepBtn, isFirst && { opacity: 0.35 }]}><Feather name="arrow-up" size={16} color={colors.textPrimary} /></Pressable>
              <Pressable disabled={isLast} onPress={() => onMove(1)} style={[s.stepBtn, isLast && { opacity: 0.35 }]}><Feather name="arrow-down" size={16} color={colors.textPrimary} /></Pressable>
            </View>
            <Button title="Delete question" variant="danger" icon="trash-2" onPress={onDelete} style={{ paddingVertical: 8 }} />
          </View>
        </View>
      )}
    </View>
  );
}

const makeStyles = ({ colors, shadow }: Theme) =>
  StyleSheet.create({
    qCard: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, overflow: 'hidden', ...shadow },
    qHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
    qNum: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    qNumText: { fontFamily: fonts.display700, fontSize: 12 },
    qPreview: { fontFamily: fonts.bodyMedium, fontSize: 14.5, lineHeight: 21, color: colors.textPrimary },
    qProblem: { fontFamily: fonts.body, fontSize: 12, color: colors.error, marginTop: 2 },
    qBody: { padding: 16, paddingTop: 6, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
    label: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.textSecondary, marginBottom: 8 },
    optRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
    optInputWrap: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, backgroundColor: colors.surface, paddingHorizontal: 12 },
    optLetter: { fontFamily: fonts.display700, fontSize: 12, color: colors.textMuted, paddingTop: 13 },
    optInput: { flex: 1, paddingVertical: 11, fontFamily: fonts.body, fontSize: 14.5, color: colors.textPrimary },
    pointsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    pointsNum: { fontFamily: fonts.display700, fontSize: 18, color: colors.textPrimary, minWidth: 28, textAlign: 'center' },
    stepBtn: { width: 34, height: 34, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
    qFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border },
  });
