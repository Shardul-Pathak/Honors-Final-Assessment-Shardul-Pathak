import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../store';
import { logoutThunk } from '../../store/slices/authSlice';
import { useAppTheme } from '../../context/ThemeContext';
import { LayoutContainer } from '../../components/LayoutContainer';
import { Header } from '../../components/Header';

// Faculty profile screen displaying permissions, role details, and UI theme controls
export default function TeacherProfileScreen() {
  const { theme, isDark, toggleTheme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.replace('/(auth)/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'FC';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <LayoutContainer>
      <Header title="Faculty Profile" subtitle="Administrative Settings" />

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.avatarText, { color: theme.primary }]}>
              {getInitials(user?.fullName)}
            </Text>
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>{user?.fullName}</Text>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user?.email}</Text>
          <View style={[styles.roleBadge, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.roleBadgeText, { color: theme.primary }]}>Faculty / Teacher</Text>
          </View>
        </View>

        <View style={[styles.detailsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Faculty Role Permissions</Text>

          <View style={styles.permissionRow}>
            <Text style={styles.permIcon}>✓</Text>
            <View style={styles.permTextWrapper}>
              <Text style={[styles.permTitle, { color: theme.text }]}>Point Allocation</Text>
              <Text style={[styles.permSub, { color: theme.textSecondary }]}>
                Authorized to award and deduct classroom points
              </Text>
            </View>
          </View>

          <View style={styles.permissionRow}>
            <Text style={styles.permIcon}>✓</Text>
            <View style={styles.permTextWrapper}>
              <Text style={[styles.permTitle, { color: theme.text }]}>Leaderboard Management</Text>
              <Text style={[styles.permSub, { color: theme.textSecondary }]}>
                Full visibility across paginated rank standings
              </Text>
            </View>
          </View>

          <View style={styles.permissionRow}>
            <Text style={styles.permIcon}>✓</Text>
            <View style={styles.permTextWrapper}>
              <Text style={[styles.permTitle, { color: theme.text }]}>Transaction Logging</Text>
              <Text style={[styles.permSub, { color: theme.textSecondary }]}>
                Audit trail recorded in PostgreSQL database
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.settingsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Preferences</Text>

          <View style={styles.themeRow}>
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Night Mode</Text>
              <Text style={[styles.settingSub, { color: theme.textSecondary }]}>
                Toggle dark UI palette
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              thumbColor={isDark ? theme.primary : '#FFFFFF'}
              trackColor={{ false: '#E2E8F0', true: theme.primaryLight }}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: theme.error + '15', borderColor: theme.error }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: theme.error }]}>🚪 Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
  },
  userEmail: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 10,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  detailsCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  permIcon: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '800',
  },
  permTextWrapper: {
    flex: 1,
  },
  permTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  permSub: {
    fontSize: 11,
    marginTop: 2,
  },
  settingsCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingSub: {
    fontSize: 11,
    marginTop: 2,
  },
  logoutBtn: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
