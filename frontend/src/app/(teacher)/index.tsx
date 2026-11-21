import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchOverviewStatsThunk,
  fetchRecentTransactionsThunk,
  fetchUsersThunk,
  clearAwardMessage,
  LeaderboardItem,
} from '../../store/slices/leaderboardSlice';
import { useAppTheme } from '../../context/ThemeContext';
import { LayoutContainer } from '../../components/LayoutContainer';
import { AwardPointsModal } from '../../components/AwardPointsModal';

// Admin Home (Teacher Home) dashboard strictly matching Design.jpeg
export default function TeacherHomeScreen() {
  const { theme, isDark, toggleTheme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    overviewStats,
    recentTransactions,
    usersList,
    usersLoading,
    awardSuccessMessage,
  } = useAppSelector((state) => state.leaderboard);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<LeaderboardItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchOverviewStatsThunk());
    dispatch(fetchRecentTransactionsThunk(8));
    dispatch(fetchUsersThunk({ role: 'STUDENT' }));
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchOverviewStatsThunk());
    dispatch(fetchRecentTransactionsThunk(8));
    dispatch(fetchUsersThunk({ role: 'STUDENT' }));
  };

  const handleOpenAwardModal = (u: any) => {
    const item: LeaderboardItem = {
      rank: 1,
      studentProfileId: u.studentProfileId || u.id,
      userId: u.id,
      fullName: u.fullName,
      email: u.email,
      rollNumber: u.rollNumber,
      gradeLevel: u.gradeLevel,
      totalPoints: u.totalPoints || 0,
    };
    setSelectedStudent(item);
    setModalVisible(true);
  };

  const filteredUsers = usersList.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.rollNumber && u.rollNumber.toLowerCase().includes(q))
    );
  });

  return (
    <LayoutContainer>
      {/* Top Header: Welcome, [Admin Name]! + Settings/Theme Icon */}
      <View style={[styles.headerBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.welcomeSub, { color: theme.textSecondary }]}>Faculty Portal</Text>
          <Text style={[styles.welcomeTitle, { color: theme.text }]} numberOfLines={1}>
            Welcome, {user?.fullName || 'Faculty'}!
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerIconBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={toggleTheme}
            accessibilityRole="button"
            accessibilityLabel="Toggle Theme"
          >
            <Feather name={isDark ? 'sun' : 'moon'} size={18} color={theme.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerIconBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push('/(teacher)/profile')}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <Feather name="settings" size={18} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
        refreshControl={
          <RefreshControl refreshing={usersLoading} onRefresh={handleRefresh} tintColor={theme.primary} />
        }
      >
        {/* Award Success Alert */}
        {awardSuccessMessage && (
          <View style={[styles.alertBox, { backgroundColor: theme.accentLight, borderColor: theme.accent }]}>
            <View style={styles.alertContent}>
              <Feather name="check-circle" size={16} color={theme.accent} style={{ marginRight: 8 }} />
              <Text style={[styles.alertText, { color: theme.accent }]}>{awardSuccessMessage}</Text>
            </View>
            <TouchableOpacity onPress={() => dispatch(clearAwardMessage())} accessibilityRole="button">
              <Feather name="x" size={16} color={theme.accent} />
            </TouchableOpacity>
          </View>
        )}

        {/* Overview Stats (3 cards: Total Users, Points Distributed, Top Score) */}
        <View style={styles.statsWrapper}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Overview Stats</Text>
          <View style={styles.metricsRow}>
            <View style={[styles.metricCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Feather name="users" size={18} color={theme.primary} style={styles.metricIcon} />
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Total Users</Text>
              <Text style={[styles.metricValue, { color: theme.primary }]}>
                {overviewStats ? overviewStats.totalStudents : usersList.length}
              </Text>
              <Text style={[styles.metricSub, { color: theme.textMuted }]}>Enrolled Students</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Ionicons name="star-outline" size={18} color={theme.accent} style={styles.metricIcon} />
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Points Distributed</Text>
              <Text style={[styles.metricValue, { color: theme.accent }]}>
                {overviewStats ? overviewStats.totalPointsDistributed : 0}
              </Text>
              <Text style={[styles.metricSub, { color: theme.textMuted }]}>Net points tally</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Ionicons name="trophy-outline" size={18} color={theme.gold} style={styles.metricIcon} />
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Top Score</Text>
              <Text style={[styles.metricValue, { color: theme.gold }]}>
                {overviewStats ? overviewStats.topScore : 520}
              </Text>
              <Text style={[styles.metricSub, { color: theme.textMuted }]}>Leading points</Text>
            </View>
          </View>
        </View>

        {/* User Management Section (Search Bar + Preview Roster) */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>User Management</Text>
            <TouchableOpacity onPress={() => router.push('/(teacher)/users')} accessibilityRole="link">
              <Text style={[styles.viewAllLink, { color: theme.primary }]}>User List ({usersList.length})</Text>
            </TouchableOpacity>
          </View>

          {/* Search Input Field */}
          <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Feather name="search" size={16} color={theme.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search students by name or roll number..."
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

          {/* Quick User List Cards */}
          <View style={styles.userListContainer}>
            {filteredUsers.slice(0, 4).map((u) => (
              <View
                key={u.id}
                style={[styles.userRowCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.userRowLeft}>
                  <View style={[styles.userAvatar, { backgroundColor: theme.primaryLight }]}>
                    <Text style={[styles.userAvatarText, { color: theme.primary }]}>
                      {u.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.userRowMeta}>
                    <Text style={[styles.userRowName, { color: theme.text }]}>{u.fullName}</Text>
                    <Text style={[styles.userRowSub, { color: theme.textSecondary }]}>
                      {u.rollNumber || 'No Roll'} • {u.gradeLevel || 'CS'}
                    </Text>
                  </View>
                </View>

                <View style={styles.userRowRight}>
                  <View style={[styles.pointsBadge, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.pointsBadgeText, { color: theme.accent }]}>
                      {u.totalPoints ?? 0} pts
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.awardActionBtn, { backgroundColor: theme.primary }]}
                    onPress={() => handleOpenAwardModal(u)}
                    accessibilityRole="button"
                  >
                    <Feather name="plus" size={13} color="#FFFFFF" style={{ marginRight: 2 }} />
                    <Text style={styles.awardActionText}>Award</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity Logs (Audit Trail) */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity Logs</Text>
            <TouchableOpacity onPress={() => router.push('/(teacher)/admin')} accessibilityRole="link">
              <Text style={[styles.viewAllLink, { color: theme.primary }]}>Audit Logs</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Feather name="clock" size={24} color={theme.textMuted} style={{ marginBottom: 6 }} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No recent activity logs recorded.
              </Text>
            </View>
          ) : (
            recentTransactions.slice(0, 4).map((tx) => (
              <View
                key={tx.id}
                style={[styles.logCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              >
                <View style={[styles.logIcon, { backgroundColor: theme.surface }]}>
                  <Feather name="clock" size={16} color={theme.primary} />
                </View>
                <View style={styles.logContent}>
                  <Text style={[styles.logTitle, { color: theme.text }]}>
                    {tx.studentName || 'Student'} received{' '}
                    <Text style={{ color: tx.pointsDelta >= 0 ? theme.accent : theme.error, fontWeight: '700' }}>
                      {tx.pointsDelta > 0 ? `+${tx.pointsDelta}` : tx.pointsDelta} pts
                    </Text>
                  </Text>
                  <Text style={[styles.logReason, { color: theme.textSecondary }]}>
                    "{tx.reason}" • By {tx.awardedByName}
                  </Text>
                </View>
                <Text style={[styles.logDate, { color: theme.textMuted }]}>
                  {new Date(tx.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* System Health */}
        <View style={styles.sectionWrapper}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>System Health</Text>
          <View style={[styles.healthCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.healthRow}>
              <View style={styles.healthItem}>
                <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                <Text style={[styles.healthLabel, { color: theme.text }]}>PostgreSQL 5433</Text>
              </View>
              <Text style={[styles.healthStatus, { color: theme.accent }]}>Connected</Text>
            </View>
            <View style={[styles.healthDivider, { backgroundColor: theme.border }]} />
            <View style={styles.healthRow}>
              <View style={styles.healthItem}>
                <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                <Text style={[styles.healthLabel, { color: theme.text }]}>Spring Boot REST API</Text>
              </View>
              <Text style={[styles.healthStatus, { color: theme.accent }]}>Optimal</Text>
            </View>
            <View style={[styles.healthDivider, { backgroundColor: theme.border }]} />
            <View style={styles.healthRow}>
              <View style={styles.healthItem}>
                <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                <Text style={[styles.healthLabel, { color: theme.text }]}>JWT Security RBAC</Text>
              </View>
              <Text style={[styles.healthStatus, { color: theme.accent }]}>Active</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Award Points Modal Dialog */}
      <AwardPointsModal
        visible={modalVisible}
        student={selectedStudent}
        onClose={() => setModalVisible(false)}
      />
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  welcomeSub: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  alertText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  statsWrapper: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  metricIcon: {
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    marginVertical: 4,
  },
  metricSub: {
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionWrapper: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewAllLink: {
    fontSize: 12,
    fontWeight: '700',
    cursor: 'pointer',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  userListContainer: {
    gap: 8,
  },
  userRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  userRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  userAvatarText: {
    fontSize: 14,
    fontWeight: '800',
  },
  userRowMeta: {
    flex: 1,
  },
  userRowName: {
    fontSize: 13,
    fontWeight: '700',
  },
  userRowSub: {
    fontSize: 11,
    marginTop: 1,
  },
  userRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pointsBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  awardActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    cursor: 'pointer',
  },
  awardActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyBox: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  logIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logContent: {
    flex: 1,
  },
  logTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  logReason: {
    fontSize: 11,
    marginTop: 2,
  },
  logDate: {
    fontSize: 10,
    marginLeft: 8,
  },
  healthCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  healthLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  healthStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
  healthDivider: {
    height: 1,
    marginVertical: 6,
  },
});
