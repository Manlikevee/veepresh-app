import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SAMPLE_SET } from '../data/sampleSet';
import type { QuestionSet, QuizResult, User } from '../types';

const KEYS = { onboarded: 'vp:onboarded', user: 'vp:user', sets: 'vp:sets' };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Ctx = {
  ready: boolean;
  onboarded: boolean;
  user: User | null;
  sets: QuestionSet[]; // sample set first, then generated sets (newest first)
  lastResult: QuizResult | null;
  completeOnboarding: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  addSet: (set: QuestionSet) => Promise<void>;
  removeSet: (id: string) => Promise<void>;
  getSet: (id?: string) => QuestionSet | undefined;
  setLastResult: (r: QuizResult) => void;
};

const AppContext = createContext<Ctx>(null as unknown as Ctx);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [custom, setCustom] = useState<QuestionSet[]>([]);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [o, u, s] = await Promise.all([
          AsyncStorage.getItem(KEYS.onboarded),
          AsyncStorage.getItem(KEYS.user),
          AsyncStorage.getItem(KEYS.sets),
        ]);
        setOnboarded(o === '1');
        if (u) setUser(JSON.parse(u));
        if (s) setCustom(JSON.parse(s));
      } catch {
        /* first launch or corrupted storage: start fresh */
      }
      setReady(true);
    })();
  }, []);

  const persistSets = (next: QuestionSet[]) => AsyncStorage.setItem(KEYS.sets, JSON.stringify(next));

  const completeOnboarding = useCallback(async () => {
    setOnboarded(true);
    await AsyncStorage.setItem(KEYS.onboarded, '1');
  }, []);

  // Dummy auth: any valid-looking input works. Nothing leaves the device.
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

  const addSet = useCallback(
    async (set: QuestionSet) => {
      const next = [set, ...custom];
      setCustom(next);
      await persistSets(next);
    },
    [custom]
  );

  const removeSet = useCallback(
    async (id: string) => {
      const next = custom.filter((s) => s.id !== id);
      setCustom(next);
      await persistSets(next);
    },
    [custom]
  );

  const sets = useMemo(() => [SAMPLE_SET, ...custom], [custom]);
  const getSet = useCallback((id?: string) => sets.find((s) => s.id === id), [sets]);

  const value: Ctx = {
    ready, onboarded, user, sets, lastResult,
    completeOnboarding, signIn, signUp, signOut, addSet, removeSet, getSet, setLastResult,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
