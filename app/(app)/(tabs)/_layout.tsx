import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTheme } from '../../../src/context/ThemeContext';
import { fonts } from '../../../src/theme';

export default function TabsLayout() {
  const { colors } = useTheme();
  const icon = (name: React.ComponentProps<typeof Feather>['name']) =>
    ({ color }: { color: string }) => <Feather name={name} size={20} color={color} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1 },
        tabBarLabelStyle: { fontFamily: fonts.bodyMedium, fontSize: 11 },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home') }} />
      <Tabs.Screen name="create" options={{ title: 'Create', tabBarIcon: icon('edit-3') }} />
      <Tabs.Screen name="reminders" options={{ title: 'Reminders', tabBarIcon: icon('bell') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('user') }} />
    </Tabs>
  );
}
