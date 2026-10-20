import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Brand, Button, FadeUp, MetaCard, Page, SectionTitle, useText } from '../../../src/components/ui';
import { useApp } from '../../../src/context/AppContext';
import { Theme, useStyles, useTheme } from '../../../src/context/ThemeContext';
import { estimateMinutes } from '../../../src/lib/quiz';
import { fonts, radius } from '../../../src/theme';
import type { QuestionSet } from '../../../src/types';

const originLabel = (s: QuestionSet) =>
  s.origin === 'sample' ? `Sample · ${s.category}`
  : s.origin === 'ai' ? `AI generated · ${s.sourceFile ?? s.category}`
  : s.origin === 'json' ? `Imported · ${s.category}`
  : `Created by you · ${s.category}`;

export default function Home() {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const t = useText();
  const { user, sets } = useApp();
  const published = sets.filter((x) => x.status === 'published');
  const initial = (user?.name?.trim()?.[0] ?? '?').toUpperCase();

  return (
    <Page tab>
      <FadeUp style={s.top}>
        <Brand />
        <Pressable onPress={() => router.navigate('/(app)/(tabs)/profile')} style={s.avatar} hitSlop={8}>
          <Text style={s.avatarText}>{initial}</Text>
        </Pressable>
      </FadeUp>

      <FadeUp delay={100}>
        <Text style={t.h1}>Hi {user?.name.split(' ')[0]} 👋</Text>
        <Text style={[t.lead, { marginTop: 8, marginBottom: 24 }]}>What would you like to practise today?</Text>
      </FadeUp>

      <FadeUp delay={150}>
        <Pressable onPress={() => router.push('/(app)/upload')} style={({ pressed }) => [s.cta, pressed && { backgroundColor: colors.accentDark }]}>
          <View style={s.ctaIcon}>
            <Feather name="upload-cloud" size={22} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.ctaTitle}>Generate from a PDF</Text>
            <Text style={s.ctaText}>Upload your notes and let AI write the questions.</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#fff" />
        </Pressable>
      </FadeUp>

      <FadeUp delay={200}>
        <SectionTitle style={{ marginTop: 32 }}>Your quizzes</SectionTitle>
        <View style={{ gap: 16 }}>
          {published.map((set) => (
            <MetaCard
              key={set.id}
              category={originLabel(set)}
              title={set.title}
              description={set.description}
              descriptionLines={2}
              onPress={() => router.push({ pathname: '/(app)/set/[id]', params: { id: set.id } })}
              stats={[
                { icon: 'file', strong: `${set.questions.length} questions` },
                { icon: 'clock', pre: 'up to ', strong: `${estimateMinutes(set.questions.length)} minutes` },
              ]}
            />
          ))}
        </View>
        <Button title="Create or upload a quiz" variant="secondary" icon="plus" onPress={() => router.navigate('/(app)/(tabs)/create')} style={{ marginTop: 20 }} />
      </FadeUp>
    </Page>
  );
}

const makeStyles = ({ colors, shadow }: Theme) =>
  StyleSheet.create({
    top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 28 },
    avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.accentLight, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontFamily: fonts.display700, fontSize: 15, color: colors.accent },
    cta: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.accent, borderRadius: radius.md, padding: 18, ...shadow },
    ctaIcon: { width: 44, height: 44, borderRadius: radius.sm, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    ctaTitle: { fontFamily: fonts.display700, fontSize: 16, letterSpacing: -0.3, color: '#fff' },
    ctaText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  });
