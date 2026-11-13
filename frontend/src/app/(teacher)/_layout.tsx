import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';

// Bottom tab navigation layout for faculty and teachers
export default function TeacherTabsLayout() {
  const { theme } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBarBg,
          borderTopColor: theme.tabBarBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Awards & Ranks',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📊</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Faculty Profile',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>👩‍🏫</Text>,
        }}
      />
    </Tabs>
  );
}
