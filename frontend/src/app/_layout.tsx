import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store, useAppDispatch } from '../store';
import { ThemeProvider } from '../context/ThemeContext';
import { restoreSessionThunk } from '../store/slices/authSlice';

// Inject global web cursor definitions for modern browser behavior
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleId = 'app-cursor-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      body, html {
        cursor: default;
      }
      button,
      [role="button"],
      [role="link"],
      [role="tab"],
      [role="switch"],
      [role="checkbox"],
      [role="radio"],
      a {
        cursor: pointer !important;
      }
      [aria-disabled="true"],
      [aria-disabled="true"] *,
      [disabled],
      button:disabled {
        cursor: not-allowed !important;
      }
      input,
      textarea,
      [contenteditable="true"] {
        cursor: text !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// Root app layout mounting global Redux store and theme providers
function RootNavigator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSessionThunk());
  }, [dispatch]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/register" />
      <Stack.Screen name="(student)" />
      <Stack.Screen name="(teacher)" />
    </Stack>
  );
}

export default function AppLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </Provider>
  );
}
