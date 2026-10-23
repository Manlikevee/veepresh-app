import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { useApp } from '../../src/context/AppContext';

export default function AuthLayout() {
  const { user } = useApp();
  if (user) return <Redirect href="/(app)" />;
  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />;
}
