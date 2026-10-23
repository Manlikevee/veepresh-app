import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { darkColors, lightColors, shadows } from '../theme';

const KEY = 'vp:theme';
const ThemeCtx = createContext(null);

export const useTheme = () => useContext(ThemeCtx);

/** Build a themed StyleSheet once per theme change. Define the factory at module level. */
export function useStyles(factory) {
  const theme = useTheme();
  return useMemo(() => factory(theme), [theme, factory]);
}

export function ThemeProvider({ children }) {
  const scheme = useColorScheme();
  const [mode, setModeState] = useState('system');
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

  const setMode = useCallback((m) => {
    setModeState(m);
    Appearance.setColorScheme(m === 'system' ? null : m); // keeps native dialogs / pickers in sync
    AsyncStorage.setItem(KEY, m).catch(() => {});
  }, []);

  const isDark = mode === 'system' ? scheme === 'dark' : mode === 'dark';

  const value = useMemo(
    () => ({
      loaded, mode, setMode, isDark,
      colors: isDark ? darkColors : lightColors,
      ...(isDark ? shadows.dark : shadows.light),
    }),
    [loaded, mode, setMode, isDark]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}
