import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchUsersThunk } from '../../store/slices/leaderboardSlice';
import { useAppTheme } from '../../context/ThemeContext';
import { LayoutContainer } from '../../components/LayoutContainer';
import { Header } from '../../components/Header';

// User Directory screen as designed in the bottom tab navigation
export default function StudentUsersScreen() {
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { usersList, usersLoading } = useAppSelector((state) => state.leaderboard);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'ALL' | 'STUDENT' | 'TEACHER'>('ALL');

  useEffect(() => {
    dispatch(fetchUsersThunk());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchUsersThunk());
  };

  const filteredUsers = usersList.filter((u) => {
    if (selectedRole !== 'ALL' && u.role !== selectedRole) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.rollNumber && u.rollNumber.toLowerCase().includes(q)) ||
      (u.gradeLevel && u.gradeLevel.toLowerCase().includes(q))
    );
  });

  return (
    <LayoutContainer>
      <Header title="Campus Directory" subtitle="Students & Academic Faculty" />

      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
        refreshControl={
          <RefreshControl refreshing={usersLoading} onRefresh={handleRefresh} tintColor={theme.primary} />
        }
      >
        {/* Search Bar */}
        <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Feather name="search" size={16} color={theme.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search by name, roll number, or department..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} accessibilityRole="button">
              <Feather name="x" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <View style={styles.chipsRow}>
          {(['ALL', 'STUDENT', 'TEACHER'] as const).map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.chip,
                {
                  backgroundColor: selectedRole === r ? theme.primary : theme.card,
                  borderColor: selectedRole === r ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setSelectedRole(r)}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.chipText,
                  { color: selectedRole === r ? '#FFFFFF' : theme.text },
                ]}
              >
                {r === 'ALL' ? 'All Members' : r === 'STUDENT' ? 'Students' : 'Faculty'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Directory Count */}
        <Text style={[styles.resultCount, { color: theme.textSecondary }]}>
          Showing {filteredUsers.length} campus members
        </Text>

        {/* Users Roster Cards */}
        {usersLoading && usersList.length === 0 ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 40 }} />
        ) : (
          <View style={styles.listContainer}>
            {filteredUsers.map((u) => (
              <View
                key={u.id}
                style={[styles.userCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              >
                <View style={styles.userCardLeft}>
                  <View
                    style={[
                      styles.avatar,
                      {
                        backgroundColor:
                          u.role === 'TEACHER' ? theme.primaryLight : theme.accentLight,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.avatarText,
                        { color: u.role === 'TEACHER' ? theme.primary : theme.accent },
                      ]}
                    >
                      {u.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.userInfo}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.userName, { color: theme.text }]}>{u.fullName}</Text>
                      <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                    </View>
                    <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{u.email}</Text>
                    <Text style={[styles.userMeta, { color: theme.textMuted }]}>
                      {u.role === 'TEACHER'
                        ? 'Faculty Administrator'
                        : `${u.rollNumber || 'No Roll'} • ${u.gradeLevel || 'CS'}`}
                    </Text>
                  </View>
                </View>

                {u.role === 'STUDENT' && (
                  <View style={[styles.pointsPill, { backgroundColor: theme.surface }]}>
                    <Ionicons name="star" size={12} color={theme.accent} style={{ marginRight: 3 }} />
                    <Text style={[styles.pointsText, { color: theme.accent }]}>
                      {u.totalPoints ?? 0}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    cursor: 'pointer',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  resultCount: {
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 2,
  },
  listContainer: {
    gap: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  userCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  userEmail: {
    fontSize: 12,
    marginTop: 1,
  },
  userMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
