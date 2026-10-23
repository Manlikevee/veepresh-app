import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, Card, FadeUp, MetaCard, Page, SectionTitle, Toggle, useText } from '../../../src/components/ui';
import { useApp } from '../../../src/context/AppContext';
import { useStyles, useTheme } from '../../../src/context/ThemeContext';
import { countQuestions, isCollection } from '../../../src/lib/collection';
import { emptyQuestion, emptySection, newId } from '../../../src/lib/quizSchema';
import { usePublish, useVisibility } from '../../../src/lib/usePublish';
import { fonts, radius } from '../../../src/theme';

export default function Create() {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const t = useText();
  const { user, sets, addSet, removeSet } = useApp();
  const publish = usePublish();
  const setVisibility = useVisibility();
  const mine = sets.filter((x) => !x.isSample);

  const startBlank = (kind) => {
    const now = Date.now();
    const collection = kind === 'collection';
    const set = {
      id: newId('set'),
      kind,
      category: collection ? 'Custom collection' : 'Custom quiz',
      title: collection ? 'Untitled collection' : 'Untitled quiz',
      description: '',
      questions: collection ? [] : [emptyQuestion()],
      ...(collection ? { sections: [emptySection()] } : {}),
      status: 'draft',
      visibility: 'private',
      origin: 'custom',
      author: user?.name,
      createdAt: now,
      updatedAt: now,
    };
    addSet(set);
    router.push({ pathname: '/(app)/editor/[id]', params: { id: set.id } });
  };

  const confirmDelete = (set) =>
    Alert.alert(isCollection(set) ? 'Delete collection' : 'Delete quiz', `Delete "${set.title}"? Reminders and progress for it will be removed too.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeSet(set.id) },
    ]);

  const Action = ({ icon, title, text, onPress }) => (
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
        <Text style={[t.lead, { marginTop: 8, marginBottom: 24 }]}>Build a quiz or a chapter-by-chapter collection, keep it in editing mode, and publish it when it's ready.</Text>
      </FadeUp>

      <FadeUp delay={100} style={{ gap: 12 }}>
        <Action icon="edit-3" title="New quiz" text="One set of questions. Type them in one by one." onPress={() => startBlank('single')} />
        <Action icon="layers" title="New collection" text="Sections or chapters that unlock one after another." onPress={() => startBlank('collection')} />
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
              const isPublic = set.visibility === 'public';
              const collection = isCollection(set);
              return (
                <MetaCard
                  key={set.id}
                  category={set.origin === 'ai' ? `AI generated · ${set.sourceFile ?? set.category}` : set.origin === 'market' ? `Marketplace · ${set.author ?? set.category}` : set.category}
                  title={set.title}
                  description={set.description}
                  descriptionLines={2}
                  onPress={() => router.push({ pathname: '/(app)/editor/[id]', params: { id: set.id } })}
                  right={
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      {collection && <Badge label="Collection" tone="accent" icon="layers" />}
                      <Pressable onPress={() => confirmDelete(set)} hitSlop={12}>
                        <Feather name="trash-2" size={16} color={colors.textMuted} />
                      </Pressable>
                    </View>
                  }
                  stats={[
                    ...(collection ? [{ icon: 'layers', strong: `${(set.sections ?? []).length} sections` }] : []),
                    { icon: 'file', strong: `${countQuestions(set)} questions` },
                  ]}
                  footer={
                    <View style={s.footer}>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        <Badge label={isPub ? 'Published' : 'Editing'} tone={isPub ? 'success' : 'warning'} icon={isPub ? 'check-circle' : 'edit-3'} />
                        <Badge label={isPublic ? 'Public' : 'Private'} tone={isPublic ? 'accent' : 'muted'} icon={isPublic ? 'globe' : 'lock'} />
                      </View>
                      <View style={s.toggleRow}>
                        <Text style={s.toggleLabel}>Published</Text>
                        <Toggle value={isPub} onValueChange={(v) => publish(set, v)} />
                      </View>
                      <View style={s.toggleRow}>
                        <Text style={s.toggleLabel}>Public in the marketplace</Text>
                        <Toggle value={isPublic} onValueChange={(v) => setVisibility(set, v)} />
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

const makeStyles = ({ colors, shadow }) =>
  StyleSheet.create({
    action: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: 16, ...shadow },
    actionIcon: { width: 40, height: 40, borderRadius: radius.sm, backgroundColor: colors.accentLight, alignItems: 'center', justifyContent: 'center' },
    actionTitle: { fontFamily: fonts.display700, fontSize: 15, letterSpacing: -0.2, color: colors.textPrimary },
    actionText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: colors.textSecondary, marginTop: 2 },
    footer: { marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border, gap: 10 },
    toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    toggleLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textSecondary },
  });
