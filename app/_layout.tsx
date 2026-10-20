import { DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import { Syne_600SemiBold, Syne_700Bold, Syne_800ExtraBold, useFonts } from '@expo-google-fonts/syne';
import * as Notifications from 'expo-notifications';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from '../src/context/AppContext';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';

SplashScreen.preventAutoHideAsync();

/** Opens the quiz when the user taps a reminder notification (works from a cold start too). */
function NotificationRouter() {
  const { ready, user } = useApp();
  const last = Notifications.useLastNotificationResponse();
  const handled = useRef('');

  useEffect(() => {
    if (!last || !ready || !user) return;
    const key = `${last.notification.request.identifier}:${last.notification.date}`;
    if (handled.current === key) return;
    handled.current = key;
    const setId = last.notification.request.content.data?.setId as string | undefined;
    if (setId) setTimeout(() => router.push({ pathname: '/(app)/set/[id]', params: { id: setId } }), 400);
  }, [last, ready, user]);

  return null;
}

function Shell() {
  const { loaded, colors } = useTheme();
  const [fontsLoaded] = useFonts({ Syne_600SemiBold, Syne_700Bold, Syne_800ExtraBold, DMSans_400Regular, DMSans_500Medium });

  useEffect(() => {
    if (fontsLoaded && loaded) SplashScreen.hideAsync();
  }, [fontsLoaded, loaded]);

  if (!fontsLoaded || !loaded) return null;

  return (
    <>
      <NotificationRouter />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <Shell />
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
