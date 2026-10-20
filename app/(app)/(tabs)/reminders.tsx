import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, Button, Card, FadeUp, Page, Toggle, useText } from '../../../src/components/ui';
import { useApp } from '../../../src/context/AppContext';
import { Theme, useStyles, useTheme } from '../../../src/context/ThemeContext';
import { describeDays, formatTime, getPermissionGranted, requestNotificationPermission } from '../../../src/services/notifications';
import { fonts, radius } from '../../../src/theme';

export default function Reminders() {
  const { colors } = useTheme();
  const s = useStyles(makeStyles);
  const t = useText();
  const { reminders, getSet, toggleReminder } = useApp();
  const [granted, setGranted] = useState<boolean | null>(null);

  useFocusEffect(
    useCallback(() => {
      getPermissionGranted().then(setGranted).catch(() => setGranted(null));
    }, [])
  );

  const askPermission = async () => {
    const ok = await requestNotificationPermission();
    setGranted(ok);
    if (!ok) {
      Alert.alert('Notifications are off', 'Turn on notifications for Veepresh in your system settings to get quiz reminders.', [
        { text: 'Not now', style: 'cancel' },
        { text: 'Open settings', onPress: () => Linking.openSettings() },
      ]);
    }
    return ok;
  };

  const onToggle = async (id: string, enabled: boolean) => {
    if (enabled && !(granted ?? false) && !(await askPermission())) return;
    await toggleReminder(id, enabled);
  };

  const sorted = [...reminders].sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));

  return (
    <Page tab>
      <FadeUp style={{ marginTop: 8 }}>
        <Text style={t.h1}>Reminders</Text>
        <Text style={[t.lead, { marginTop: 8, marginBottom: 24 }]}>Pick a quiz and a time of day. We'll nudge you when it's time to practise.</Text>
      </FadeUp>

      {granted === false && (
        <FadeUp delay={80} style={{ marginBottom: 16 }}>
          <View style={s.banner}>
            <Feather name="bell-off" size={18} color={colors.warning} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={s.bannerTitle}>Notifications are off</Text>
              <Text style={s.bannerText}>Allow notifications so your reminders can reach you.</Text>
            </View>
            <Button title="Allow" onPress={askPermission} style={{ paddingVertical: 8, paddingHorizontal: 14 }} />
          </View>
        </FadeUp>
      )}

      <FadeUp delay={120}>
        <Button title="New reminder" icon="plus" size="lg" onPress={() => router.push({ pathname: '/(app)/reminder/[id]', params: { id: 'new' } })} />
      </FadeUp>

      <FadeUp delay={180} style={{ marginTop: 24, gap: 12 }}>
        {sorted.length === 0 ? (
          <Card style={{ alignItems: 'center', paddingVertical: 32 }}>
            <View style={s.emptyIcon}><Feather name="bell" size={24} color={colors.accent} /></View>
            <Text style={s.emptyTitle}>No reminders yet</Text>
            <Text style={[t.lead, { textAlign: 'center', marginTop: 6 }]}>Create one to get a daily or weekly nudge for a quiz you want to practise.</Text>
          </Card>
        ) : (
          sorted.map((r) => {
            const set = getSet(r.setId);
            const missing = !set || set.status !== 'published';
            return (
              <Pressable key={r.id} onPress={() => router.push({ pathname: '/(app)/reminder/[id]', params: { id: r.id } })}>
                <View style={[s.card, !r.enabled && { opacity: 0.6 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.time}>{formatTime(r.hour, r.minute)}</Text>
                    <Text style={s.quiz} numberOfLines={1}>{set?.title ?? r.setTitle}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
                      <Badge label={describeDays(r.days)} tone="accent" icon="repeat" />
                      {missing && <Badge label="Quiz not published" tone="warning" />}
                    </View>
                  </View>
                  <Toggle value={r.enabled} onValueChange={(v) => onToggle(r.id, v)} />
                </View>
              </Pressable>
            );
          })
        )}
      </FadeUp>
    </Page>
  );
}

const makeStyles = ({ colors, shadow }: Theme) =>
  StyleSheet.create({
    banner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.warningLight, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 14 },
    bannerTitle: { fontFamily: fonts.display700, fontSize: 14, color: colors.textPrimary },
    bannerText: { fontFamily: fonts.body, fontSize: 12.5, lineHeight: 18, color: colors.textSecondary, marginTop: 2 },
    card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 18, ...shadow },
    time: { fontFamily: fonts.display800, fontSize: 28, letterSpacing: -1, color: colors.textPrimary },
    quiz: { fontFamily: fonts.bodyMedium, fontSize: 14.5, color: colors.textSecondary, marginTop: 2 },
    emptyIcon: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.accentLight, alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { fontFamily: fonts.display700, fontSize: 17, letterSpacing: -0.3, color: colors.textPrimary, marginTop: 14 },
  });
