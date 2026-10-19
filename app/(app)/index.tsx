import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Brand, Button, FadeUp, MetaCard, Page, text } from '../../src/components/ui';
import { useApp } from '../../src/context/AppContext';
import { estimateMinutes } from '../../src/lib/quiz';
import { colors, fonts, radius, shadow } from '../../src/theme';

export default function Home() {
  const { user, sets, signOut, removeSet } = useApp();

  const logout = () =>
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: async () => { await signOut(); router.replace('/(auth)/login'); } },
    ]);

  const confirmDelete = (id: string, title: string) =>
    Alert.alert('Delete question set', `Delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeSet(id) },
    ]);

  return (
    <Page>
      <FadeUp style={s.top}>
        <Brand />
        <Button title="Log out" variant="secondary" icon="log-out" onPress={logout} style={{ paddingVertical: 8, paddingHorizontal: 14 }} />
      </FadeUp>

      <FadeUp delay={100}>
        <Text style={text.h1}>Hi {user?.name.split(' ')[0]} 👋</Text>
        <Text style={[text.lead, { marginTop: 8, marginBottom: 24 }]}>What would you like to practise today?</Text>
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
        <Text style={[text.sectionTitle, { marginTop: 32, marginBottom: 12 }]}>Your question sets</Text>
        <View style={{ gap: 16 }}>
          {sets.map((set) => (
            <MetaCard
              key={set.id}
              category={set.isSample ? `Sample · ${set.category}` : `AI generated · ${set.sourceFile ?? set.category}`}
              title={set.title}
              description={set.description}
              descriptionLines={2}
              onPress={() => router.push({ pathname: '/(app)/set/[id]', params: { id: set.id } })}
              right={
                !set.isSample ? (
                  <Pressable onPress={() => confirmDelete(set.id, set.title)} hitSlop={12}>
                    <Feather name="trash-2" size={16} color={colors.textMuted} />
                  </Pressable>
                ) : undefined
              }
              stats={[
                { icon: 'file', strong: `${set.questions.length} questions` },
                { icon: 'clock', pre: 'up to ', strong: `${estimateMinutes(set.questions.length)} minutes` },
              ]}
            />
          ))}
        </View>
        <Button title="Upload a new document" variant="secondary" icon="upload" onPress={() => router.push('/(app)/upload')} style={{ marginTop: 20 }} />
      </FadeUp>
    </Page>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 28 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.accent, borderRadius: radius.md, padding: 18, ...shadow },
  ctaIcon: { width: 44, height: 44, borderRadius: radius.sm, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  ctaTitle: { fontFamily: fonts.display700, fontSize: 16, letterSpacing: -0.3, color: '#fff' },
  ctaText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
});
