import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, Card, FadeUp, IconName, MetaCard, Page, SectionTitle, Toggle, useText } from '../../../src/components/ui';
import { useApp } from '../../../src/context/AppContext';
import { Theme, useStyles, useTheme } from '../../../src/context/ThemeContext';
import { emptyQuestion, newId } from '../../../src/lib/quizSchema';
import { usePublish } from '../../../src/lib/usePublish';
import { fonts, radius } from '../../../src/theme';
import type { QuestionSet } from '../../../src/types';

export default function Create() {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const t = useText();
  const { sets, addSet, removeSet } = useApp();
  const publish = usePublish();
  const mine = sets.filter((x) => !x.isSample);

  const startBlank = () => {
    const now = Date.now();
    const set: QuestionSet = {
      id: newId('set'), category: 'Custom quiz', title: 'Untitled quiz', description: '',
      questions: [emptyQuestion()], status: 'draft', origin: 'custom', createdAt: now, updatedAt: now,
    };
    addSet(set);
    router.push({ pathname: '/(app)/editor/[id]', params: { id: set.id } });
  };

  const confirmDelete = (set: QuestionSet) =>
    Alert.alert('Delete quiz', `Delete "${set.title}"? Reminders for it will be removed too.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeSet(set.id) },
    ]);

  const Action = ({ icon, title, text, onPress }: { icon: IconName; title: string; text: string; onPress: () => void }) => (
    <Pressable onPress={onPress} style={({ pressed }) => [s.action, pressed && { borderColor: colors.accent }]}>
      <View style={s.actionIcon}><Feather name={icon} size={20} color={colors.accent} /></View>
      <View style={{ flex: 1 }}>
        <Text style={s.actionTitle}>{title}</Text>
        <Text style={s.actionText}>{text}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.textMuted} />
    </Pressable>
  );

  return (
    <Page tab>
      <FadeUp style={{ marginTop: 8 }}>
        <Text style={t.h1}>Create</Text>
        <Text style={[t.lead, { marginTop: 8, marginBottom: 24 }]}>Build a quiz, keep it in editing mode, and publish it when it's ready.</Text>
      </FadeUp>

      <FadeUp delay={100} style={{ gap: 12 }}>
        <Action icon="edit-3" title="Start from scratch" text="Type your questions and answer options one by one." onPress={startBlank} />
        <Action icon="code" title="Import from JSON" text="Paste or load JSON, or start from a ready-made template." onPress={() => router.push('/(app)/import-json')} />
        <Action icon="upload-cloud" title="Generate from a PDF" text="Let AI write the questions from your document." onPress={() => router.push('/(app)/upload')} />
      </FadeUp>

      <FadeUp delay={200}>
        <SectionTitle style={{ marginTop: 32 }}>My quizzes</SectionTitle>
        {mine.length === 0 ? (
          <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
            <Feather name="inbox" size={26} color={colors.textMuted} />
            <Text style={[t.lead, { textAlign: 'center', marginTop: 10 }]}>Nothing here yet. Create your first quiz above.</Text>
          </Card>
        ) : (
          <View style={{ gap: 16 }}>
            {mine.map((set) => {
              const isPub = set.status === 'published';
              return (
                <MetaCard
                  key={set.id}
                  category={set.origin === 'ai' ? `AI generated · ${set.sourceFile ?? set.category}` : set.category}
                  title={set.title}
                  description={set.description}
                  descriptionLines={2}
                  onPress={() => router.push({ pathname: '/(app)/editor/[id]', params: { id: set.id } })}
                  right={
                    <Pressable onPress={() => confirmDelete(set)} hitSlop={12}>
                      <Feather name="trash-2" size={16} color={colors.textMuted} />
                    </Pressable>
                  }
                  stats={[{ icon: 'file', strong: `${set.questions.length} questions` }]}
                  footer={
                    <View style={s.footer}>
                      <Badge label={isPub ? 'Published' : 'Editing'} tone={isPub ? 'success' : 'warning'} icon={isPub ? 'check-circle' : 'edit-3'} />
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Text style={s.toggleLabel}>Published</Text>
                        <Toggle value={isPub} onValueChange={(v) => publish(set, v)} />
                      </View>
                    </View>
                  }
                />
              );
            })}
          </View>
        )}
      </FadeUp>
    </Page>
  );
}

const makeStyles = ({ colors, shadow }: Theme) =>
  StyleSheet.create({
    action: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: 16, ...shadow },
    actionIcon: { width: 40, height: 40, borderRadius: radius.sm, backgroundColor: colors.accentLight, alignItems: 'center', justifyContent: 'center' },
    actionTitle: { fontFamily: fonts.display700, fontSize: 15, letterSpacing: -0.2, color: colors.textPrimary },
    actionText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: colors.textSecondary, marginTop: 2 },
    footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border },
    toggleLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textSecondary },
  });
