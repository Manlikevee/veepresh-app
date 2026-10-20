import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SAMPLE_SET } from '../data/sampleSet';
import { cancelAllNotifications, cancelNotifications, scheduleReminder } from '../services/notifications';
import type { Attempt, QuestionSet, QuizResult, Reminder, User } from '../types';

const KEYS = {
  onboarded: 'vp:onboarded',
  user: 'vp:user',
  sets: 'vp:sets',
  reminders: 'vp:reminders',
  attempts: 'vp:attempts',
};
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type ReminderInput = { id?: string; setId: string; setTitle: string; hour: number; minute: number; days: number[] };

type Ctx = {
  ready: boolean;
  onboarded: boolean;
  user: User | null;
  sets: QuestionSet[]; // sample set first, then the user's own sets (newest first)
  reminders: Reminder[];
  attempts: Attempt[];
  lastResult: QuizResult | null;
  completeOnboarding: () => Promise<void>;
  replayOnboarding: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  addSet: (set: QuestionSet) => void;
  updateSet: (id: string, patch: Partial<QuestionSet> | ((s: QuestionSet) => Partial<QuestionSet>)) => void;
  removeSet: (id: string) => Promise<void>;
  getSet: (id?: string) => QuestionSet | undefined;
  setLastResult: (r: QuizResult) => void;
  addAttempt: (r: QuizResult, title: string) => void;
  saveReminder: (input: ReminderInput) => Promise<void>;
  toggleReminder: (id: string, enabled: boolean) => Promise<void>;
  removeReminder: (id: string) => Promise<void>;
  clearHistory: () => void;
  resetAllData: () => Promise<void>;
};

const AppContext = createContext<Ctx>(null as unknown as Ctx);
export const useApp = () => useContext(AppContext);

function usePersist(key: string, value: unknown, ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {}), 250);
    return () => clearTimeout(t);
  }, [key, value, ready]);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [custom, setCustom] = useState<QuestionSet[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);

  const remindersRef = useRef(reminders);
  remindersRef.current = reminders;

  useEffect(() => {
    (async () => {
      try {
        const [o, u, s, r, a] = await Promise.all([
          AsyncStorage.getItem(KEYS.onboarded),
          AsyncStorage.getItem(KEYS.user),
          AsyncStorage.getItem(KEYS.sets),
          AsyncStorage.getItem(KEYS.reminders),
          AsyncStorage.getItem(KEYS.attempts),
        ]);
        setOnboarded(o === '1');
        if (u) setUser(JSON.parse(u));
        if (s) {
          // migrate sets saved before status/origin existed
          setCustom((JSON.parse(s) as QuestionSet[]).map((x) => ({ ...x, status: x.status ?? 'published', origin: x.origin ?? 'ai' })));
        }
        if (r) setReminders(JSON.parse(r));
        if (a) setAttempts(JSON.parse(a));
      } catch {
        /* first launch or corrupted storage: start fresh */
      }
      setReady(true);
    })();
  }, []);

  usePersist(KEYS.sets, custom, ready);
  usePersist(KEYS.reminders, reminders, ready);
  usePersist(KEYS.attempts, attempts, ready);

  /* ── onboarding & auth (dummy) ── */
  const completeOnboarding = useCallback(async () => {
    setOnboarded(true);
    await AsyncStorage.setItem(KEYS.onboarded, '1');
  }, []);

  const replayOnboarding = useCallback(async () => {
    setOnboarded(false);
    await AsyncStorage.removeItem(KEYS.onboarded);
  }, []);

  const signIn = useCallback(async (email: string, _password: string) => {
    await sleep(700);
    const name = email.split('@')[0].replace(/[._-]+/g, ' ');
    const u = { name: name.charAt(0).toUpperCase() + name.slice(1), email };
    setUser(u);
    await AsyncStorage.setItem(KEYS.user, JSON.stringify(u));
  }, []);

  const signUp = useCallback(async (name: string, email: string, _password: string) => {
    await sleep(900);
    const u = { name, email };
    setUser(u);
    await AsyncStorage.setItem(KEYS.user, JSON.stringify(u));
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(KEYS.user);
  }, []);

  const updateUserName = useCallback(async (name: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, name };
      AsyncStorage.setItem(KEYS.user, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  /* ── question sets ── */
  const addSet = useCallback((set: QuestionSet) => setCustom((prev) => [set, ...prev]), []);

  const updateSet = useCallback<Ctx['updateSet']>((id, patch) => {
    setCustom((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...(typeof patch === 'function' ? patch(s) : patch), updatedAt: Date.now() } : s))
    );
  }, []);

  const removeSet = useCallback(async (id: string) => {
    setCustom((prev) => prev.filter((s) => s.id !== id));
    const doomed = remindersRef.current.filter((r) => r.setId === id);
    await cancelNotifications(doomed.flatMap((r) => r.notificationIds));
    setReminders((prev) => prev.filter((r) => r.setId !== id));
  }, []);

  const sets = useMemo(() => [SAMPLE_SET, ...custom], [custom]);
  const getSet = useCallback((id?: string) => sets.find((s) => s.id === id), [sets]);

  /* ── history ── */
  const addAttempt = useCallback((r: QuizResult, title: string) => {
    setAttempts((prev) =>
      [{ id: `a_${Date.now()}`, setId: r.setId, title, pct: r.pct, passed: r.passed, total: r.total, at: Date.now() }, ...prev].slice(0, 200)
    );
  }, []);

  const clearHistory = useCallback(() => setAttempts([]), []);

  /* ── reminders (local notifications) ── */
  const saveReminder = useCallback(async (input: ReminderInput) => {
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
    const next: Reminder = { ...base, notificationIds };
    setReminders((prev) => (existing ? prev.map((r) => (r.id === base.id ? next : r)) : [...prev, next]));
  }, []);

  const toggleReminder = useCallback(async (id: string, enabled: boolean) => {
    const r = remindersRef.current.find((x) => x.id === id);
    if (!r) return;
    await cancelNotifications(r.notificationIds);
    const notificationIds = enabled ? await scheduleReminder(r) : [];
    setReminders((prev) => prev.map((x) => (x.id === id ? { ...x, enabled, notificationIds } : x)));
  }, []);

  const removeReminder = useCallback(async (id: string) => {
    const r = remindersRef.current.find((x) => x.id === id);
    if (r) await cancelNotifications(r.notificationIds);
    setReminders((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const resetAllData = useCallback(async () => {
    await cancelAllNotifications();
    setCustom([]);
    setReminders([]);
    setAttempts([]);
    setLastResult(null);
    await AsyncStorage.multiRemove([KEYS.sets, KEYS.reminders, KEYS.attempts]);
  }, []);

  const value: Ctx = {
    ready, onboarded, user, sets, reminders, attempts, lastResult,
    completeOnboarding, replayOnboarding, signIn, signUp, signOut, updateUserName,
    addSet, updateSet, removeSet, getSet, setLastResult, addAttempt,
    saveReminder, toggleReminder, removeReminder, clearHistory, resetAllData,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
