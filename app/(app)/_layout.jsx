import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { useApp } from '../../src/context/AppContext';

export default function AppLayout() {
  const { user } = useApp();
  if (!user) return <Redirect href="/(auth)/login" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
