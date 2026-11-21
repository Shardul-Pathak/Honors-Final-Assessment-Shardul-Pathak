import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppSelector } from '../store';
import { useAppTheme } from '../context/ThemeContext';
import { LayoutContainer } from '../components/LayoutContainer';

// Splash and routing gate directing users based on active session and role
export default function IndexScreen() {
  const { theme } = useAppTheme();
  const { isAuthenticated, isRestoring, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isRestoring) {
      if (isAuthenticated && user) {
        if (user.role === 'TEACHER') {
          router.replace('/(teacher)');
        } else {
          router.replace('/(student)');
        }
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isRestoring, isAuthenticated, user]);

  return (
    <LayoutContainer>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.logoCircle, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name="school-outline" size={40} color={theme.primary} />
        </View>
        <Text style={[styles.brandTitle, { color: theme.text }]}>EduRank LMS</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Student Management & Leaderboard</Text>
        <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
      </View>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: 28,
  },
  loader: {
    marginTop: 12,
  },
});
