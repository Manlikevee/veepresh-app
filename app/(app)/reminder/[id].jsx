import { Feather } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { BackRow, Button, Card, FadeUp, Page, SectionTitle, useText } from '../../../src/components/ui';
import { TimePicker } from '../../../src/components/TimePicker';
import { useApp } from '../../../src/context/AppContext';
import { useStyles, useTheme } from '../../../src/context/ThemeContext';
import { DAY_LETTERS, DAY_ORDER, describeDays, formatTime, requestNotificationPermission } from '../../../src/services/notifications';
import { countQuestions, isCollection } from '../../../src/lib/collection';
import { fonts, radius } from '../../../src/theme';

export default function ReminderEditor() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const t = useText();
  const { sets, reminders, saveReminder, removeReminder } = useApp();
  const existing = reminders.find((r) => r.id === id);
  const isNew = id === 'new';
  const published = sets.filter((x) => x.status === 'published');

  const [setId, setSetId] = useState(existing?.setId ?? published[0]?.id);
  const [hour, setHour] = useState(existing?.hour ?? 18);
  const [minute, setMinute] = useState(existing?.minute ?? 0);
  const [days, setDays] = useState(existing?.days ?? []);
  const [saving, setSaving] = useState(false);

  if (!isNew && !existing) return <Redirect href="/(app)/(tabs)/reminders" />;

  const toggleDay = (d) => setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  const chosen = sets.find((x) => x.id === setId);

  const save = async () => {
    if (!chosen) return Alert.alert('Choose a quiz', 'Pick the quiz you want to be reminded about.');
    setSaving(true);
    try {
      const ok = await requestNotificationPermission();
      if (!ok) {
        Alert.alert('Notifications are off', 'Allow notifications for Veepresh in system settings so reminders can reach you.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open settings', onPress: () => Linking.openSettings() },
        ]);
        setSaving(false);
        return;
      }
      await saveReminder({ id: existing?.id, setId: chosen.id, setTitle: chosen.title, hour, minute, days });
      router.back();
    } catch {
      Alert.alert('Could not schedule reminder', 'Something went wrong. Please try again.');
      setSaving(false);
    }
  };

  const remove = () =>
    Alert.alert('Delete reminder', 'Stop reminding you about this quiz?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await removeReminder(existing.id); router.back(); } },
    ]);

  return (
    <Page>
      <BackRow onBack={() => router.back()} />
      <FadeUp>
        <Text style={t.h1}>{isNew ? 'New reminder' : 'Edit reminder'}</Text>
        <Text style={[t.lead, { marginTop: 8, marginBottom: 24 }]}>Choose a quiz and when you'd like to take it.</Text>
      </FadeUp>

      <FadeUp delay={80}>
        <SectionTitle>Quiz</SectionTitle>
        {published.length === 0 ? (
          <Card><Text style={t.lead}>You have no published quizzes yet. Publish one from the Create tab first.</Text></Card>
        ) : (
          <View style={{ gap: 10 }}>
            {published.map((q) => {
              const on = q.id === setId;
              return (
                <Pressable key={q.id} onPress={() => setSetId(q.id)} style={[s.quizRow, on && { borderColor: colors.accent, backgroundColor: colors.accentLight }]}>
                  <View style={[s.radio, on && { borderColor: colors.accent, backgroundColor: colors.accent }]}>
                    {on && <Feather name="check" size={13} color="#fff" />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.quizTitle} numberOfLines={1}>{q.title}</Text>
                    <Text style={s.quizMeta}>{isCollection(q) ? `Collection · ${q.sections.length} sections · ` : ''}{countQuestions(q)} questions</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </FadeUp>

      <FadeUp delay={140} style={{ marginTop: 28 }}>
        <SectionTitle>Time</SectionTitle>
        <Card style={{ paddingVertical: 22 }}>
          <TimePicker hour={hour} minute={minute} onChange={(h, m) => { setHour(h); setMinute(m); }} />
        </Card>
      </FadeUp>

      <FadeUp delay={200} style={{ marginTop: 28 }}>
        <SectionTitle>Repeat</SectionTitle>
        <Card>
          <View style={s.days}>
            {DAY_ORDER.map((d) => {
              const on = days.includes(d);
              return (
                <Pressable key={d} onPress={() => toggleDay(d)} style={[s.day, on && { backgroundColor: colors.accent, borderColor: colors.accent }]}>
                  <Text style={[s.dayText, on && { color: '#fff' }]}>{DAY_LETTERS[d]}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={[t.muted, { marginTop: 14, textAlign: 'center' }]}>
            {describeDays(days)} · {formatTime(hour, minute)}
            {days.length === 0 ? '  (select days to limit it)' : ''}
          </Text>
        </Card>
      </FadeUp>

      <FadeUp delay={260} style={{ marginTop: 28, gap: 12 }}>
        <Button title={isNew ? 'Set reminder' : 'Save changes'} icon="bell" size="lg" onPress={save} loading={saving} disabled={!chosen} />
        {!isNew && <Button title="Delete reminder" variant="danger" icon="trash-2" onPress={remove} />}
      </FadeUp>
    </Page>
  );
}

const makeStyles = ({ colors }) =>
  StyleSheet.create({
    quizRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
    radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
    quizTitle: { fontFamily: fonts.display600, fontSize: 15, letterSpacing: -0.2, color: colors.textPrimary },
    quizMeta: { fontFamily: fonts.body, fontSize: 12.5, color: colors.textSecondary, marginTop: 2 },
    days: { flexDirection: 'row', justifyContent: 'space-between' },
    day: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
    dayText: { fontFamily: fonts.display700, fontSize: 13, color: colors.textSecondary },
  });
