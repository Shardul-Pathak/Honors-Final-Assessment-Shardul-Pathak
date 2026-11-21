import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { logoutThunk } from '../../store/slices/authSlice';
import { useAppTheme } from '../../context/ThemeContext';
import { LayoutContainer } from '../../components/LayoutContainer';
import { Header } from '../../components/Header';

// Faculty profile screen displaying account details, preferences, and authentication controls
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
      <Header title="Faculty Profile" subtitle="Account Settings" />

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
            <Text style={[styles.roleBadgeText, { color: theme.primary }]}>Faculty Member</Text>
          </View>
        </View>

        <View style={[styles.detailsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Account Information</Text>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Full Name</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{user?.fullName || '-'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Email Address</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{user?.email || '-'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Assigned Role</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>TEACHER</Text>
          </View>

          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Account Status</Text>
            <Text style={[styles.detailValue, { color: theme.accent }]}>Active</Text>
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
          <Feather name="log-out" size={18} color={theme.error} style={{ marginRight: 8 }} />
          <Text style={[styles.logoutText, { color: theme.error }]}>Sign Out</Text>
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
