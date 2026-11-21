import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchMyRankThunk, fetchMyHistoryThunk } from '../../store/slices/leaderboardSlice';
import { useAppTheme } from '../../context/ThemeContext';
import { LayoutContainer } from '../../components/LayoutContainer';

// User Home (Student Home) screen strictly matching Design.jpeg
export default function StudentHomeScreen() {
  const { theme, isDark, toggleTheme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { myRank, myHistory, isLoading } = useAppSelector((state) => state.leaderboard);

  const [supportModalVisible, setSupportModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchMyRankThunk());
    dispatch(fetchMyHistoryThunk());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchMyRankThunk());
    dispatch(fetchMyHistoryThunk());
  };

  const getInitials = (name?: string) => {
    if (!name) return 'ST';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <LayoutContainer>
      {/* Top Header: Welcome, [User Name]! + Settings/Theme Icon */}
      <View style={[styles.headerBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.welcomeSub, { color: theme.textSecondary }]}>Student Portal</Text>
          <Text style={[styles.welcomeTitle, { color: theme.text }]} numberOfLines={1}>
            Welcome, {user?.fullName || 'Student'}!
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
            onPress={() => router.push('/(student)/profile')}
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
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor={theme.primary} />
        }
      >
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.profileRow}>
            <View style={[styles.avatarCircle, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.avatarText, { color: theme.primary }]}>
                {getInitials(user?.fullName)}
              </Text>
            </View>

            <View style={styles.profileDetails}>
              <Text style={[styles.userName, { color: theme.text }]}>{user?.fullName}</Text>
              <Text style={[styles.joinedDate, { color: theme.textSecondary }]}>
                Joined: Jan 1, 2024 • Active
              </Text>
              <Text style={[styles.userMeta, { color: theme.textMuted }]}>
                Roll: {user?.rollNumber || myRank?.rollNumber || 'RBU-2026-001'} • {user?.gradeLevel || 'Computer Science'}
              </Text>
            </View>

            <View style={[styles.rankPill, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.rankPillNum, { color: theme.primary }]}>
                #{myRank?.rank ? myRank.rank : '1'}
              </Text>
              <Text style={[styles.rankPillLabel, { color: theme.primary }]}>Rank</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions (3 buttons: My Profile, Rankings, Support) */}
        <View style={styles.quickActionsBlock}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push('/(student)/profile')}
              accessibilityRole="button"
            >
              <View style={[styles.actionIconCircle, { backgroundColor: theme.primaryLight }]}>
                <Feather name="user" size={20} color={theme.primary} />
              </View>
              <Text style={[styles.actionLabel, { color: theme.text }]}>My Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push('/(student)/rankings')}
              accessibilityRole="button"
            >
              <View style={[styles.actionIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="trophy-outline" size={20} color="#B45309" />
              </View>
              <Text style={[styles.actionLabel, { color: theme.text }]}>Rankings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => setSupportModalVisible(true)}
              accessibilityRole="button"
            >
              <View style={[styles.actionIconCircle, { backgroundColor: theme.accentLight }]}>
                <Feather name="help-circle" size={20} color={theme.accent} />
              </View>
              <Text style={[styles.actionLabel, { color: theme.text }]}>Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity (Live point transactions) */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/(student)/activity')} accessibilityRole="link">
              <Text style={[styles.viewAllLink, { color: theme.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {myHistory.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Feather name="clock" size={24} color={theme.textMuted} style={{ marginBottom: 6 }} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No recent activity records found.
              </Text>
            </View>
          ) : (
            myHistory.slice(0, 4).map((tx) => (
              <View
                key={tx.id}
                style={[styles.activityCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              >
                <View style={[styles.activityIcon, { backgroundColor: theme.accentLight }]}>
                  <Feather name="clock" size={16} color={theme.accent} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityReason, { color: theme.text }]}>{tx.reason}</Text>
                  <Text style={[styles.activityBy, { color: theme.textSecondary }]}>
                    Awarded by: {tx.awardedByName}
                  </Text>
                </View>
                <View style={styles.activityDeltaBlock}>
                  <Text
                    style={[
                      styles.activityDelta,
                      { color: tx.pointsDelta >= 0 ? theme.accent : theme.error },
                    ]}
                  >
                    {tx.pointsDelta > 0 ? `+${tx.pointsDelta}` : tx.pointsDelta} pts
                  </Text>
                  <Text style={[styles.activityDate, { color: theme.textMuted }]}>
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Academic Support Modal */}
      <Modal visible={supportModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Academic Support & Help</Text>
              <TouchableOpacity
                onPress={() => setSupportModalVisible(false)}
                accessibilityRole="button"
                style={{ cursor: 'pointer' }}
              >
                <Feather name="x" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalDesc, { color: theme.textSecondary }]}>
              Reach out to department advisors or IT coordinators for performance inquiries:
            </Text>

            <View style={[styles.contactCard, { backgroundColor: theme.surface }]}>
              <Feather name="mail" size={16} color={theme.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.contactText, { color: theme.text }]}>support@rbu.edu</Text>
            </View>

            <View style={[styles.contactCard, { backgroundColor: theme.surface }]}>
              <Feather name="phone" size={16} color={theme.accent} style={{ marginRight: 8 }} />
              <Text style={[styles.contactText, { color: theme.text }]}>+91 712 2580011</Text>
            </View>

            <TouchableOpacity
              style={[styles.closeModalBtn, { backgroundColor: theme.primary }]}
              onPress={() => setSupportModalVisible(false)}
              accessibilityRole="button"
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  profileCard: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
  },
  profileDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
  },
  joinedDate: {
    fontSize: 12,
    marginTop: 2,
  },
  userMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  rankPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  rankPillNum: {
    fontSize: 16,
    fontWeight: '800',
  },
  rankPillLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  quickActionsBlock: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    cursor: 'pointer',
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
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
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  activityIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityContent: {
    flex: 1,
  },
  activityReason: {
    fontSize: 13,
    fontWeight: '700',
  },
  activityBy: {
    fontSize: 11,
    marginTop: 2,
  },
  activityDeltaBlock: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  activityDelta: {
    fontSize: 13,
    fontWeight: '800',
  },
  activityDate: {
    fontSize: 10,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 18,
    borderWidth: 1,
    padding: 22,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  modalDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeModalBtn: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    cursor: 'pointer',
  },
  closeModalText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
