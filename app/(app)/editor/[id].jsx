import { Feather } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, BackRow, Button, Card, Field, Segmented, useText } from '../../../src/components/ui';
import { useApp } from '../../../src/context/AppContext';
import { useStyles, useTheme } from '../../../src/context/ThemeContext';
import { getSections, isCollection, mapQuestionLists } from '../../../src/lib/collection';
import { MAX_OPTIONS, MIN_OPTIONS, emptyQuestion, emptySection, exportSetJson, validateQuestion } from '../../../src/lib/quizSchema';
import { usePublish, useVisibility } from '../../../src/lib/usePublish';
import { MAX_CONTENT_WIDTH, fonts, radius } from '../../../src/theme';

/**
 * The editor shows one flat list so a FlatList can virtualise it:
 *   single quiz  -> question, question, ...
 *   collection   -> section header, its questions, "add question", next section header, ...
 */
function buildRows(set) {
  if (!set) return [];
  if (!isCollection(set)) {
    return set.questions.map((q, index) => ({
      key: q.id, type: 'question', q, index, first: index === 0, last: index === set.questions.length - 1,
    }));
  }
  const sections = getSections(set);
  const rows = [];
  sections.forEach((sec, si) => {
    rows.push({ key: `sec_${sec.id}`, type: 'section', sec, index: si, first: si === 0, last: si === sections.length - 1 });
    sec.questions.forEach((q, qi) =>
      rows.push({ key: q.id, type: 'question', q, index: qi, sectionId: sec.id, first: qi === 0, last: qi === sec.questions.length - 1 })
    );
    rows.push({ key: `add_${sec.id}`, type: 'add', sectionId: sec.id });
  });
  return rows;
}

export default function Editor() {
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const s = useStyles(makeStyles);
  const t = useText();
  const { getSet, updateSet, removeSet } = useApp();
  const publish = usePublish();
  const setVisibility = useVisibility();
  const set = getSet(id);
  const [openId, setOpenId] = useState(null);
  const listRef = useRef(null);
  const rows = useMemo(() => buildRows(set), [set]);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  if (!set || set.isSample) return <Redirect href="/(app)" />;

  const collection = isCollection(set);
  const noun = collection ? 'collection' : 'quiz';
  const scrollToEnd = () => setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 200);

  const patch = (p) => updateSet(set.id, p);

  /* questions (work the same for a single quiz and for the sections of a collection) */
  const patchQuestion = (qid, fn) =>
    updateSet(set.id, (cur) => mapQuestionLists(cur, (list) => list.map((q) => (q.id === qid ? fn(q) : q))));

  const addQuestion = (sectionId) => {
    const q = emptyQuestion();
    updateSet(set.id, (cur) => mapQuestionLists(cur, (list, sid) => (sid === (sectionId ?? null) ? [...list, q] : list)));
    setOpenId(q.id);
    if (!collection) scrollToEnd();
  };

  const removeQuestion = (qid) =>
    Alert.alert('Delete question', 'Remove this question?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => updateSet(set.id, (cur) => mapQuestionLists(cur, (list) => list.filter((q) => q.id !== qid))) },
    ]);

  const moveQuestion = (qid, dir) =>
    updateSet(set.id, (cur) =>
      mapQuestionLists(cur, (list) => {
        const i = list.findIndex((q) => q.id === qid);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= list.length) return list;
        const arr = [...list];
        [arr[i], arr[j]] = [arr[j], arr[i]];
        return arr;
      })
    );

  /* sections (collections only) */
  const patchSection = (sid, p) =>
    updateSet(set.id, (cur) => ({ sections: getSections(cur).map((x) => (x.id === sid ? { ...x, ...p } : x)) }));

  const addSection = () => {
    const sec = emptySection();
    updateSet(set.id, (cur) => ({ sections: [...getSections(cur), sec] }));
    setOpenId(sec.questions[0].id);
    scrollToEnd();
  };

  const removeSection = (sec) =>
    Alert.alert('Delete section', `Remove "${sec.title.trim() || 'this section'}" and its ${sec.questions.length} question(s)?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => updateSet(set.id, (cur) => ({ sections: getSections(cur).filter((x) => x.id !== sec.id) })) },
    ]);

  const moveSection = (sid, dir) =>
    updateSet(set.id, (cur) => {
      const arr = [...getSections(cur)];
      const i = arr.findIndex((x) => x.id === sid);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= arr.length) return {};
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { sections: arr };
    });

  /* publish + visibility: when validation fails, jump to the first thing that needs fixing */
  const focusInvalid = (firstInvalid) => {
    if (!firstInvalid) return;
    if (firstInvalid.kind === 'question') setOpenId(firstInvalid.id);
    const key = firstInvalid.kind === 'section' ? `sec_${firstInvalid.id}` : firstInvalid.id;
    setTimeout(() => {
      const index = rowsRef.current.findIndex((r) => r.key === key);
      if (index >= 0) listRef.current?.scrollToIndex({ index, animated: true, viewOffset: 12 });
    }, 150);
  };

  const onStatus = (v) => {
    const res = publish(set, v === 'published');
    if (!res.ok) focusInvalid(res.firstInvalid);
  };

  const onVisibility = (v) => {
    const res = setVisibility(set, v === 'public');
    if (!res.ok) focusInvalid(res.firstInvalid);
  };

  const confirmDelete = () =>
    Alert.alert(`Delete ${noun}`, `Delete "${set.title}"? Reminders and progress for it will be removed too.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await removeSet(set.id); router.replace('/(app)/(tabs)/create'); } },
    ]);

  const exportJson = () => Share.share({ title: set.title, message: exportSetJson(set) }).catch(() => {});

  const isPublic = set.visibility === 'public';
  const itemCount = collection ? getSections(set).length : set.questions.length;

  const header = (
    <View>
      <BackRow onBack={() => router.back()} right={<Button title="Export JSON" variant="secondary" icon="share" onPress={exportJson} style={{ paddingVertical: 8, paddingHorizontal: 14 }} />} />
      <Text style={t.h1}>{collection ? 'Collection editor' : 'Quiz editor'}</Text>
      <Text style={[t.lead, { marginTop: 8, marginBottom: 20 }]}>Changes save automatically.</Text>

      <Card style={{ marginBottom: 16 }}>
        <Text style={[t.sectionTitle, { marginBottom: 12 }]}>Status</Text>
        <Segmented
          value={set.status}
          onChange={onStatus}
          options={[
            { value: 'draft', label: 'Editing', icon: 'edit-3' },
            { value: 'published', label: 'Published', icon: 'check-circle' },
          ]}
        />
        <Text style={[t.muted, { marginTop: 12, lineHeight: 19 }]}>
          {set.status === 'published'
            ? `Published: this ${noun} is on your Home screen and can be taken or used in reminders.`
            : `Editing: only you can see this ${noun}. Publish it when every question is complete. Going back to editing also makes it private.`}
        </Text>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Text style={[t.sectionTitle, { marginBottom: 12 }]}>Visibility</Text>
        <Segmented
          value={isPublic ? 'public' : 'private'}
          onChange={onVisibility}
          options={[
            { value: 'private', label: 'Private', icon: 'lock' },
            { value: 'public', label: 'Public', icon: 'globe' },
          ]}
        />
        <Text style={[t.muted, { marginTop: 12, lineHeight: 19 }]}>
          {isPublic
            ? `Public: anyone can find this ${noun} in the marketplace and add a copy to their library. They never get to edit yours.`
            : `Private: only you can see this ${noun}. Make it public to list it in the marketplace (it must be complete and published).`}
        </Text>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <Field label="Title" value={set.title} onChangeText={(v) => patch({ title: v })} placeholder={collection ? 'e.g. Introduction to Python' : 'e.g. Chapter 4 revision'} />
        <Field label="Category" value={set.category} onChangeText={(v) => patch({ category: v })} placeholder="e.g. Biology 101" />
        <Field label="Short description" value={set.description} onChangeText={(v) => patch({ description: v })} placeholder={collection ? 'What will people learn?' : 'What is this quiz about?'} multiline />
      </Card>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={t.sectionTitle}>{collection ? `Sections (${itemCount})` : `Questions (${itemCount})`}</Text>
        {collection
          ? <Button title="Add section" icon="plus" onPress={addSection} style={{ paddingVertical: 8, paddingHorizontal: 14 }} />
          : <Button title="Add question" icon="plus" onPress={() => addQuestion(null)} style={{ paddingVertical: 8, paddingHorizontal: 14 }} />}
      </View>
      {collection && (
        <Text style={[t.muted, { marginBottom: 12, lineHeight: 19 }]}>
          Learners work through the sections in order. A section unlocks when they pass the one before it.
        </Text>
      )}
    </View>
  );

  const footer = (
    <View style={{ marginTop: 22, gap: 12 }}>
      {collection
        ? <Button title="Add section" variant="secondary" icon="plus" onPress={addSection} />
        : <Button title="Add question" variant="secondary" icon="plus" onPress={() => addQuestion(null)} />}
      <Button title={`Delete ${noun}`} variant="danger" icon="trash-2" onPress={confirmDelete} />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <FlatList
          ref={listRef}
          data={rows}
          keyExtractor={(r) => r.key}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, paddingBottom: 48, width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' }}
          ListHeaderComponent={header}
          ListFooterComponent={footer}
          onScrollToIndexFailed={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item, index }) => {
            const gap = index === 0 ? 0 : item.type === 'section' ? 24 : item.type === 'add' ? 12 : 10;
            if (item.type === 'section') {
              return (
                <View style={{ marginTop: gap }}>
                  <SectionHeader
                    sec={item.sec}
                    index={item.index}
                    first={item.first}
                    last={item.last}
                    onChange={(p) => patchSection(item.sec.id, p)}
                    onDelete={() => removeSection(item.sec)}
                    onMove={(d) => moveSection(item.sec.id, d)}
                  />
                </View>
              );
            }
            if (item.type === 'add') {
              return (
                <View style={{ marginTop: gap }}>
                  <Button title="Add question to this section" variant="secondary" icon="plus" onPress={() => addQuestion(item.sectionId)} style={{ alignSelf: 'flex-start', paddingVertical: 8 }} />
                </View>
              );
            }
            return (
              <View style={{ marginTop: gap }}>
                <QuestionItem
                  q={item.q}
                  index={item.index}
                  open={openId === item.q.id}
                  isFirst={item.first}
                  isLast={item.last}
                  onToggle={() => setOpenId(openId === item.q.id ? null : item.q.id)}
                  onChange={(fn) => patchQuestion(item.q.id, fn)}
                  onDelete={() => removeQuestion(item.q.id)}
                  onMove={(d) => moveQuestion(item.q.id, d)}
                />
              </View>
            );
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ── one section of a collection: title + short description + reorder/delete ── */
function SectionHeader({ sec, index, first, last, onChange, onDelete, onMove }) {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const problem = !sec.title.trim() ? 'Give this section a title.' : sec.questions.length === 0 ? 'Add at least one question.' : null;
  return (
    <View style={[s.secCard, !!problem && { borderColor: colors.feedbackErrorBorder }]}>
      <View style={s.secTop}>
        <Badge label={`Section ${index + 1}`} tone="accent" icon="layers" />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable disabled={first} onPress={() => onMove(-1)} style={[s.stepBtn, first && { opacity: 0.35 }]}><Feather name="arrow-up" size={16} color={colors.textPrimary} /></Pressable>
          <Pressable disabled={last} onPress={() => onMove(1)} style={[s.stepBtn, last && { opacity: 0.35 }]}><Feather name="arrow-down" size={16} color={colors.textPrimary} /></Pressable>
          <Pressable onPress={onDelete} style={s.stepBtn}><Feather name="trash-2" size={16} color={colors.error} /></Pressable>
        </View>
      </View>
      <Field label="Section title" value={sec.title} onChangeText={(v) => onChange({ title: v })} placeholder="e.g. Chapter 1 · Getting started" />
      <Field label="Short description (optional)" value={sec.description} onChangeText={(v) => onChange({ description: v })} placeholder="What does this section cover?" multiline />
      <Text style={s.secMeta}>
        {sec.questions.length} {sec.questions.length === 1 ? 'question' : 'questions'}
        {problem ? ` · ${problem}` : ''}
      </Text>
    </View>
  );
}

function QuestionItem({
  q, index, open, isFirst, isLast, onToggle, onChange, onDelete, onMove,
}) {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const problem = validateQuestion(q);

  const setOption = (i, v) => onChange((x) => ({ ...x, options: x.options.map((o, idx) => (idx === i ? v : o)) }));
  const addOption = () => onChange((x) => ({ ...x, options: [...x.options, ''] }));
  const removeOption = (i) =>
    onChange((x) => ({
      ...x,
      options: x.options.filter((_, idx) => idx !== i),
      correct: x.correct === i ? 0 : x.correct > i ? x.correct - 1 : x.correct,
    }));
  const bumpPoints = (d) => onChange((x) => ({ ...x, points: Math.min(20, Math.max(1, x.points + d)) }));

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

const makeStyles = ({ colors, shadow }) =>
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
    secCard: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.accent, borderRadius: radius.md, padding: 16, ...shadow },
    secTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
    secMeta: { fontFamily: fonts.body, fontSize: 12.5, color: colors.textSecondary },
    qFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border },
  });
