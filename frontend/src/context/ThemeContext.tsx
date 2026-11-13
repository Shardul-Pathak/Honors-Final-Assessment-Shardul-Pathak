import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeColors {
  background: string;
  card: string;
  surface: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  accentLight: string;
  border: string;
  borderLight: string;
  gold: string;
  silver: string;
  bronze: string;
  success: string;
  error: string;
  warning: string;
  inputBg: string;
  tabBarBg: string;
  tabBarBorder: string;
}

export const lightTheme: ThemeColors = {
  background: '#F8FAFC',
  card: '#FFFFFF',
  surface: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  primaryDark: '#3730A3',
  accent: '#10B981',
  accentLight: '#ECFDF5',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  gold: '#F59E0B',
  silver: '#94A3B8',
  bronze: '#D97706',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  inputBg: '#F8FAFC',
  tabBarBg: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
};

export const darkTheme: ThemeColors = {
  background: '#0B1120',
  card: '#1E293B',
  surface: '#151F32',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  primary: '#6366F1',
  primaryLight: '#1E1B4B',
  primaryDark: '#818CF8',
  accent: '#34D399',
  accentLight: '#064E3B',
  border: '#334155',
  borderLight: '#1E293B',
  gold: '#FBBF24',
  silver: '#CBD5E1',
  bronze: '#F59E0B',
  success: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  inputBg: '#151F32',
  tabBarBg: '#1E293B',
  tabBarBorder: '#334155',
};

interface ThemeContextType {
  isDark: boolean;
  theme: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  theme: lightTheme,
  toggleTheme: () => {},
});

const THEME_STORAGE_KEY = 'app_user_theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved !== null) {
        setIsDark(saved === 'dark');
      }
    }).catch(() => {});
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light').catch(() => {});
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, theme: isDark ? darkTheme : lightTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
