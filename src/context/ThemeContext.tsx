import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, StyleSheet, useColorScheme } from 'react-native';
import { Colors, darkColors, lightColors, shadows } from '../theme';

export type ThemeMode = 'system' | 'light' | 'dark';

export type Theme = {
  loaded: boolean;
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  isDark: boolean;
  colors: Colors;
  shadow: (typeof shadows)['light']['shadow'];
  shadowLg: (typeof shadows)['light']['shadowLg'];
};

const KEY = 'vp:theme';
const ThemeCtx = createContext<Theme>(null as unknown as Theme);

export const useTheme = () => useContext(ThemeCtx);

/** Build a themed StyleSheet once per theme change. Define the factory at module level. */
export function useStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(factory: (t: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [theme, factory]);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => {
        if (v === 'light' || v === 'dark' || v === 'system') {
          setModeState(v);
          Appearance.setColorScheme(v === 'system' ? null : v);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    Appearance.setColorScheme(m === 'system' ? null : m); // keeps native dialogs / pickers in sync
    AsyncStorage.setItem(KEY, m).catch(() => {});
  }, []);

  const isDark = mode === 'system' ? scheme === 'dark' : mode === 'dark';

  const value = useMemo<Theme>(
    () => ({
      loaded, mode, setMode, isDark,
      colors: isDark ? darkColors : lightColors,
      ...(isDark ? shadows.dark : shadows.light),
    }),
    [loaded, mode, setMode, isDark]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}
