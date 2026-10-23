import Constants from 'expo-constants';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { Button, Card, FadeUp, Field, Page, Row, Segmented, SectionTitle, useText } from '../../../src/components/ui';
import { useApp } from '../../../src/context/AppContext';
import { useStyles, useTheme } from '../../../src/context/ThemeContext';
import { getPermissionGranted } from '../../../src/services/notifications';
import { fonts, radius } from '../../../src/theme';

export default function Profile() {
  const { colors, mode, setMode } = useTheme();
  const s = useStyles(makeStyles);
  const t = useText();
  const { user, attempts, reminders, sets, signOut, updateUserName, clearHistory, resetAllData, replayOnboarding } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [granted, setGranted] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getPermissionGranted().then(setGranted).catch(() => setGranted(null));
    }, [])
  );

  const initial = (user?.name?.trim()?.[0] ?? '?').toUpperCase();
  const taken = attempts.length;
  const avg = taken ? Math.round(attempts.reduce((sum, a) => sum + a.pct, 0) / taken) : 0;
  const passed = attempts.filter((a) => a.passed).length;
  const myQuizzes = sets.filter((x) => !x.isSample).length;
  const publicQuizzes = sets.filter((x) => !x.isSample && x.visibility === 'public' && x.status === 'published').length;
  const activeReminders = reminders.filter((r) => r.enabled).length;

  const saveName = async () => {
    const n = name.trim();
    if (!n) return Alert.alert('Name required', 'Please enter your name.');
    await updateUserName(n);
    setEditing(false);
  };

  const confirm = (title, message, label, onConfirm) =>
    Alert.alert(title, message, [{ text: 'Cancel', style: 'cancel' }, { text: label, style: 'destructive', onPress: onConfirm }]);

  const logout = () =>
    confirm('Log out', 'Are you sure you want to log out?', 'Log out', async () => {
      await signOut();
      router.replace('/(auth)/login');
    });

  const replay = async () => {
    await replayOnboarding();
    router.replace('/onboarding');
  };

  return (
    <Page tab>
      <FadeUp style={{ marginTop: 8 }}>
        <Text style={[t.h1, { marginBottom: 20 }]}>Profile</Text>
        <Card style={{ alignItems: 'center', paddingVertical: 26 }}>
          <View style={s.avatar}><Text style={s.avatarText}>{initial}</Text></View>
          {editing ? (
            <View style={{ alignSelf: 'stretch', marginTop: 18 }}>
              <Field label="Name" value={name} onChangeText={setName} autoFocus />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Button title="Cancel" variant="secondary" onPress={() => { setName(user?.name ?? ''); setEditing(false); }} style={{ flex: 1 }} />
                <Button title="Save" onPress={saveName} style={{ flex: 1 }} />
              </View>
            </View>
          ) : (
            <>
              <Text style={s.name}>{user?.name}</Text>
              <Text style={s.email}>{user?.email}</Text>
              <Button title="Edit name" variant="secondary" icon="edit-2" onPress={() => setEditing(true)} style={{ marginTop: 16, paddingVertical: 8 }} />
            </>
          )}
        </Card>
      </FadeUp>

      <FadeUp delay={100} style={{ marginTop: 16 }}>
        <View style={s.grid}>
          {[['Quizzes taken', String(taken)], ['Average score', `${avg}%`], ['Passed', String(passed)]].map(([l, v]) => (
            <View key={l} style={s.statBlock}>
              <Text style={s.statNum}>{v}</Text>
              <Text style={s.statLabel}>{l}</Text>
            </View>
          ))}
        </View>
      </FadeUp>

      <FadeUp delay={150} style={{ marginTop: 28 }}>
        <SectionTitle>Appearance</SectionTitle>
        <Card>
          <Segmented
            value={mode}
            onChange={setMode}
            options={[
              { value: 'system', label: 'System', icon: 'smartphone' },
              { value: 'light', label: 'Light', icon: 'sun' },
              { value: 'dark', label: 'Dark', icon: 'moon' },
            ]}
          />
          <Text style={[t.muted, { marginTop: 12 }]}>
            {mode === 'system' ? 'Follows your device setting.' : mode === 'dark' ? 'Dark theme is always on.' : 'Light theme is always on.'}
          </Text>
        </Card>
      </FadeUp>

      <FadeUp delay={200} style={{ marginTop: 28 }}>
        <SectionTitle>Notifications</SectionTitle>
        <Card style={{ paddingVertical: 6 }}>
          <Row
            icon="bell"
            label="Quiz reminders"
            sub={`${activeReminders} active · ${granted === false ? 'notifications are off' : 'notifications allowed'}`}
            onPress={() => router.navigate('/(app)/(tabs)/reminders')}
          />
          <Row icon="settings" label="System notification settings" onPress={() => Linking.openSettings()} last />
        </Card>
      </FadeUp>

      <FadeUp delay={250} style={{ marginTop: 28 }}>
        <SectionTitle>Your data</SectionTitle>
        <Card style={{ paddingVertical: 6 }}>
          <Row icon="edit-3" label="My quizzes" sub={`${myQuizzes} created, imported or added · ${publicQuizzes} public`} onPress={() => router.navigate('/(app)/(tabs)/create')} />
          <Row icon="repeat" label="Replay onboarding" onPress={replay} />
          <Row
            icon="trash"
            label="Clear quiz history"
            sub="Removes your scores and stats"
            onPress={() => confirm('Clear history', 'This removes all your past scores.', 'Clear', clearHistory)}
          />
          <Row
            icon="alert-triangle"
            label="Delete all my quizzes"
            sub="Also removes reminders and history"
            danger
            last
            onPress={() => confirm('Delete everything?', 'All quizzes you created, imported or generated, plus reminders and history, will be removed.', 'Delete all', resetAllData)}
          />
        </Card>
      </FadeUp>

      <FadeUp delay={300} style={{ marginTop: 28 }}>
        <SectionTitle>About</SectionTitle>
        <Card style={{ paddingVertical: 6 }}>
          <Row icon="info" label="Veepresh" sub={`Version ${Constants.expoConfig?.version ?? '1.0.0'} · demo mode, your data stays on this device`} last />
        </Card>
      </FadeUp>

      <FadeUp delay={350} style={{ marginTop: 28 }}>
        <Button title="Log out" variant="danger" icon="log-out" size="lg" onPress={logout} />
      </FadeUp>
    </Page>
  );
}

const makeStyles = ({ colors }) =>
  StyleSheet.create({
    avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontFamily: fonts.display800, fontSize: 32, color: '#fff' },
    name: { fontFamily: fonts.display700, fontSize: 21, letterSpacing: -0.5, color: colors.textPrimary, marginTop: 14 },
    email: { fontFamily: fonts.body, fontSize: 14, color: colors.textSecondary, marginTop: 2 },
    grid: { flexDirection: 'row', gap: 12 },
    statBlock: { flex: 1, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingVertical: 16, paddingHorizontal: 8, alignItems: 'center' },
    statNum: { fontFamily: fonts.display800, fontSize: 24, letterSpacing: -1, color: colors.textPrimary, marginBottom: 4 },
    statLabel: { fontFamily: fonts.bodyMedium, fontSize: 10.5, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.textMuted, textAlign: 'center' },
  });
