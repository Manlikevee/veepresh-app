import { DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import { Syne_600SemiBold, Syne_700Bold, Syne_800ExtraBold, useFonts } from '@expo-google-fonts/syne';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../src/context/AppContext';
import { colors } from '../src/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({ Syne_600SemiBold, Syne_700Bold, Syne_800ExtraBold, DMSans_400Regular, DMSans_500Medium });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
      </AppProvider>
    </SafeAreaProvider>
  );
}
