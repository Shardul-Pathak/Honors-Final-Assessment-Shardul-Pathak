import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../store';
import { logoutThunk } from '../store/slices/authSlice';
import { router } from 'expo-router';

export const Header: React.FC<{ title?: string; subtitle?: string }> = ({
  title = 'EduRank',
  subtitle,
}) => {
  const { theme, isDark, toggleTheme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.replace('/(auth)/login');
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
      <View style={styles.leftSection}>
        <View style={[styles.logoIcon, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.logoText, { color: theme.primary }]}>🎓</Text>
        </View>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
          ) : user ? (
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {user.fullName} ({user.role === 'TEACHER' ? 'Faculty' : 'Student'})
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rightActions}>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.actionButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          accessibilityLabel="Toggle Theme"
        >
          <Text style={styles.actionIcon}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>

        {user && (
          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.actionButton, styles.logoutButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
            accessibilityLabel="Sign Out"
          >
            <Text style={styles.actionIcon}>🚪</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 22,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    marginLeft: 2,
  },
  actionIcon: {
    fontSize: 16,
  },
});
