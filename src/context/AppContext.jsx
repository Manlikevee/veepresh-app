import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SAMPLE_SET } from '../data/sampleSet';
import { cancelAllNotifications, cancelNotifications, scheduleReminder } from '../services/notifications';

const KEYS = {
  onboarded: 'vp:onboarded',
  user: 'vp:user',
  sets: 'vp:sets',
  reminders: 'vp:reminders',
  attempts: 'vp:attempts',
  progress: 'vp:progress',
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

function usePersist(key, value, ready) {
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {}), 250);
    return () => clearTimeout(t);
  }, [key, value, ready]);
}

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [user, setUser] = useState(null);
  const [custom, setCustom] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [progress, setProgress] = useState({}); // collection progress: { [setId]: { [sectionId]: { best, passed, attempts, at } } }
  const [lastResult, setLastResult] = useState(null);

  const remindersRef = useRef(reminders);
  remindersRef.current = reminders;

  useEffect(() => {
    (async () => {
      try {
        const [o, u, s, r, a, p] = await Promise.all([
          AsyncStorage.getItem(KEYS.onboarded),
          AsyncStorage.getItem(KEYS.user),
          AsyncStorage.getItem(KEYS.sets),
          AsyncStorage.getItem(KEYS.reminders),
          AsyncStorage.getItem(KEYS.attempts),
          AsyncStorage.getItem(KEYS.progress),
        ]);
        setOnboarded(o === '1');
        if (u) setUser(JSON.parse(u));
        if (s) {
          // migrate sets saved before status/origin/collections/visibility existed
          setCustom(
            JSON.parse(s).map((x) => ({
              ...x,
              status: x.status ?? 'published',
              origin: x.origin ?? 'ai',
              kind: x.kind ?? 'single',
              visibility: x.visibility ?? 'private',
            }))
          );
        }
        if (r) setReminders(JSON.parse(r));
        if (a) setAttempts(JSON.parse(a));
        if (p) setProgress(JSON.parse(p));
      } catch {
        /* first launch or corrupted storage: start fresh */
      }
      setReady(true);
    })();
  }, []);

  usePersist(KEYS.sets, custom, ready);
  usePersist(KEYS.reminders, reminders, ready);
  usePersist(KEYS.attempts, attempts, ready);
  usePersist(KEYS.progress, progress, ready);

  /* ── onboarding & auth (dummy) ── */
  const completeOnboarding = useCallback(async () => {
    setOnboarded(true);
    await AsyncStorage.setItem(KEYS.onboarded, '1');
  }, []);

  const replayOnboarding = useCallback(async () => {
    setOnboarded(false);
    await AsyncStorage.removeItem(KEYS.onboarded);
  }, []);

  const signIn = useCallback(async (email, _password) => {
    await sleep(700);
    const name = email.split('@')[0].replace(/[._-]+/g, ' ');
    const u = { name: name.charAt(0).toUpperCase() + name.slice(1), email };
    setUser(u);
    await AsyncStorage.setItem(KEYS.user, JSON.stringify(u));
  }, []);

  const signUp = useCallback(async (name, email, _password) => {
    await sleep(900);
    const u = { name, email };
    setUser(u);
    await AsyncStorage.setItem(KEYS.user, JSON.stringify(u));
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(KEYS.user);
  }, []);

  const updateUserName = useCallback(async (name) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, name };
      AsyncStorage.setItem(KEYS.user, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  /* ── question sets ── */
  const addSet = useCallback((set) => setCustom((prev) => [set, ...prev]), []);

  const updateSet = useCallback((id, patch) => {
    setCustom((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...(typeof patch === 'function' ? patch(s) : patch), updatedAt: Date.now() } : s))
    );
  }, []);

  const removeSet = useCallback(async (id) => {
    setCustom((prev) => prev.filter((s) => s.id !== id));
    setProgress((prev) => {
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });
    const doomed = remindersRef.current.filter((r) => r.setId === id);
    await cancelNotifications(doomed.flatMap((r) => r.notificationIds));
    setReminders((prev) => prev.filter((r) => r.setId !== id));
  }, []);

  const sets = useMemo(() => [SAMPLE_SET, ...custom], [custom]);
  const getSet = useCallback((id) => sets.find((s) => s.id === id), [sets]);

  /* ── collection progress ── */
  // Remembers the best score per section; a section counts as done once it has been passed.
  const recordSectionResult = useCallback((setId, sectionId, pct, passed) => {
    setProgress((prev) => {
      const old = prev[setId]?.[sectionId];
      const entry = {
        best: Math.max(old?.best ?? 0, pct),
        passed: !!old?.passed || passed,
        attempts: (old?.attempts ?? 0) + 1,
        at: Date.now(),
      };
      return { ...prev, [setId]: { ...prev[setId], [sectionId]: entry } };
    });
  }, []);

  const resetSetProgress = useCallback((setId) => {
    setProgress((prev) => {
      const { [setId]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  /* ── history ── */
  const addAttempt = useCallback((r, title) => {
    setAttempts((prev) =>
      [{ id: `a_${Date.now()}`, setId: r.setId, title, pct: r.pct, passed: r.passed, total: r.total, at: Date.now() }, ...prev].slice(0, 200)
    );
  }, []);

  const clearHistory = useCallback(() => setAttempts([]), []);

  /* ── reminders (local notifications) ── */
  const saveReminder = useCallback(async (input) => {
    const existing = input.id ? remindersRef.current.find((r) => r.id === input.id) : undefined;
    if (existing) await cancelNotifications(existing.notificationIds);
    const base = {
      id: input.id ?? `rem_${Date.now()}`,
      setId: input.setId,
      setTitle: input.setTitle,
      hour: input.hour,
      minute: input.minute,
      days: input.days,
      enabled: true,
    };
    const notificationIds = await scheduleReminder(base);
    const next = { ...base, notificationIds };
    setReminders((prev) => (existing ? prev.map((r) => (r.id === base.id ? next : r)) : [...prev, next]));
  }, []);

  const toggleReminder = useCallback(async (id, enabled) => {
    const r = remindersRef.current.find((x) => x.id === id);
    if (!r) return;
    await cancelNotifications(r.notificationIds);
    const notificationIds = enabled ? await scheduleReminder(r) : [];
    setReminders((prev) => prev.map((x) => (x.id === id ? { ...x, enabled, notificationIds } : x)));
  }, []);

  const removeReminder = useCallback(async (id) => {
    const r = remindersRef.current.find((x) => x.id === id);
    if (r) await cancelNotifications(r.notificationIds);
    setReminders((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const resetAllData = useCallback(async () => {
    await cancelAllNotifications();
    setCustom([]);
    setReminders([]);
    setAttempts([]);
    setProgress({});
    setLastResult(null);
    await AsyncStorage.multiRemove([KEYS.sets, KEYS.reminders, KEYS.attempts, KEYS.progress]);
  }, []);

  const value = {
    ready, onboarded, user, sets, reminders, attempts, progress, lastResult,
    completeOnboarding, replayOnboarding, signIn, signUp, signOut, updateUserName,
    addSet, updateSet, removeSet, getSet, setLastResult, addAttempt, recordSectionResult, resetSetProgress,
    saveReminder, toggleReminder, removeReminder, clearHistory, resetAllData,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
