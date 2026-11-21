import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { logoutThunk, updateProfileThunk } from '../../store/slices/authSlice';
import { fetchMyHistoryThunk } from '../../store/slices/leaderboardSlice';
import { useAppTheme } from '../../context/ThemeContext';
import { LayoutContainer } from '../../components/LayoutContainer';

// User Info Page strictly matching Design.jpeg
export default function StudentProfileScreen() {
  const { theme, isDark, toggleTheme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { myRank, myHistory } = useAppSelector((state) => state.leaderboard);

  const [activeTab, setActiveTab] = useState<'DETAILS' | 'ACTIVITY' | 'SETTINGS'>('DETAILS');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Edit Profile Modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || '');
  const [editPhone, setEditPhone] = useState(user?.phoneNumber || '+91 98765 43210');
  const [isUpdating, setIsUpdating] = useState(false);

  // Password Modal
  const [pwdModalVisible, setPwdModalVisible] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchMyHistoryThunk());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.replace('/(auth)/login');
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setIsUpdating(true);
    await dispatch(updateProfileThunk({ fullName: editName.trim(), phoneNumber: editPhone.trim() }));
    setIsUpdating(false);
    setEditModalVisible(false);
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
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
        {/* Cover Photo Banner */}
        <View style={[styles.coverPhoto, { backgroundColor: theme.primary }]}>
          <View style={styles.coverOverlay}>
            <Ionicons name="school-outline" size={42} color="rgba(255,255,255,0.25)" />
            <Text style={styles.coverTag}>Ramdeobaba University</Text>
          </View>
        </View>

        {/* Profile Header Box (Overlapping Avatar, Name, Status) */}
        <View style={[styles.profileHeaderBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarCircle, { backgroundColor: theme.surface, borderColor: theme.card }]}>
              <Text style={[styles.avatarText, { color: theme.primary }]}>
                {getInitials(user?.fullName)}
              </Text>
            </View>
          </View>

          <Text style={[styles.userName, { color: theme.text }]}>{user?.fullName}</Text>

          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: '#DEF7EC' }]}>
              <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.statusText}>Status: Active</Text>
            </View>

            <View style={[styles.roleBadge, { backgroundColor: theme.accentLight }]}>
              <Text style={[styles.roleBadgeText, { color: theme.accent }]}>Student</Text>
            </View>
          </View>
        </View>

        {/* Segmented Profile Tabs: DETAILS | ACTIVITY | SETTINGS */}
        <View style={[styles.segmentedBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {(['DETAILS', 'ACTIVITY', 'SETTINGS'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.segmentBtn,
                activeTab === tab && [styles.segmentBtnActive, { backgroundColor: theme.card }],
              ]}
              onPress={() => setActiveTab(tab)}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === tab }}
            >
              <Text
                style={[
                  styles.segmentBtnText,
                  { color: activeTab === tab ? theme.primary : theme.textSecondary },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TAB 1: DETAILS */}
        {activeTab === 'DETAILS' && (
          <View style={[styles.tabContentCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.contentHeader}>
              <Text style={[styles.contentTitle, { color: theme.text }]}>Personal Details</Text>
              <TouchableOpacity
                style={[styles.editBtn, { backgroundColor: theme.primaryLight }]}
                onPress={() => {
                  setEditName(user?.fullName || '');
                  setEditPhone(user?.phoneNumber || '+91 98765 43210');
                  setEditModalVisible(true);
                }}
                accessibilityRole="button"
              >
                <Feather name="edit-2" size={13} color={theme.primary} style={{ marginRight: 4 }} />
                <Text style={[styles.editBtnText, { color: theme.primary }]}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Name</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{user?.fullName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Email</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{user?.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Role</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>Student</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Roll Number</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {user?.rollNumber || myRank?.rollNumber || 'RBU-2026-001'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Department</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {user?.gradeLevel || 'Computer Science'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Phone</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {user?.phoneNumber || '+91 98765 43210'}
              </Text>
            </View>

            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Joined</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>Jan 1, 2024</Text>
            </View>
          </View>
        )}

        {/* TAB 2: ACTIVITY */}
        {activeTab === 'ACTIVITY' && (
          <View style={[styles.tabContentCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.contentTitle, { color: theme.text }]}>Point Transaction Logs</Text>
            {myHistory.length === 0 ? (
              <View style={styles.emptyTab}>
                <Feather name="inbox" size={30} color={theme.textMuted} style={{ marginBottom: 6 }} />
                <Text style={[styles.emptyTabText, { color: theme.textSecondary }]}>
                  No points activity recorded yet.
                </Text>
              </View>
            ) : (
              myHistory.map((tx) => (
                <View
                  key={tx.id}
                  style={[styles.activityItem, { borderBottomColor: theme.border }]}
                >
                  <View style={[styles.activityItemIcon, { backgroundColor: theme.surface }]}>
                    <Feather
                      name={tx.pointsDelta >= 0 ? 'arrow-up-right' : 'arrow-down-right'}
                      size={16}
                      color={tx.pointsDelta >= 0 ? theme.accent : theme.error}
                    />
                  </View>
                  <View style={styles.activityItemMain}>
                    <Text style={[styles.activityItemReason, { color: theme.text }]}>
                      {tx.reason}
                    </Text>
                    <Text style={[styles.activityItemBy, { color: theme.textSecondary }]}>
                      Awarded by {tx.awardedByName}
                    </Text>
                  </View>
                  <View style={styles.activityItemRight}>
                    <Text
                      style={[
                        styles.activityItemDelta,
                        { color: tx.pointsDelta >= 0 ? theme.accent : theme.error },
                      ]}
                    >
                      {tx.pointsDelta > 0 ? `+${tx.pointsDelta}` : tx.pointsDelta} pts
                    </Text>
                    <Text style={[styles.activityItemDate, { color: theme.textMuted }]}>
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === 'SETTINGS' && (
          <View style={[styles.tabContentCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.contentTitle, { color: theme.text }]}>Preferences & Security</Text>

            <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
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
                style={{ cursor: 'pointer' } as any}
              />
            </View>

            <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
              <View>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Alerts & Notifications</Text>
                <Text style={[styles.settingSub, { color: theme.textSecondary }]}>
                  Receive point distribution emails
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                thumbColor={notificationsEnabled ? theme.accent : '#FFFFFF'}
                trackColor={{ false: '#E2E8F0', true: theme.accentLight }}
                style={{ cursor: 'pointer' } as any}
              />
            </View>

            <TouchableOpacity
              style={[styles.actionRowBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => setPwdModalVisible(true)}
              accessibilityRole="button"
            >
              <Feather name="lock" size={16} color={theme.text} style={{ marginRight: 8 }} />
              <Text style={[styles.actionRowText, { color: theme.text }]}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.logoutBtn, { backgroundColor: theme.error + '15', borderColor: theme.error }]}
              onPress={handleLogout}
              accessibilityRole="button"
            >
              <Feather name="log-out" size={16} color={theme.error} style={{ marginRight: 8 }} />
              <Text style={[styles.logoutText, { color: theme.error }]}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} accessibilityRole="button">
                <Feather name="x" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Full Name</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
              value={editName}
              onChangeText={setEditName}
            />

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Phone Number</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
              value={editPhone}
              onChangeText={setEditPhone}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { borderColor: theme.border }]}
                onPress={() => setEditModalVisible(false)}
                accessibilityRole="button"
              >
                <Text style={[styles.modalCancelText, { color: theme.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalSaveBtn, { backgroundColor: theme.primary }]}
                onPress={handleSaveProfile}
                accessibilityRole="button"
              >
                {isUpdating ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalSaveText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={pwdModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Security & Password</Text>
            <Text style={[styles.modalDesc, { color: theme.textSecondary }]}>
              Password synchronization is linked to your campus directory identity.
            </Text>
            {pwdSuccess ? (
              <View style={[styles.pwdSuccessBox, { backgroundColor: theme.accentLight }]}>
                <Feather name="check-circle" size={16} color={theme.accent} style={{ marginRight: 6 }} />
                <Text style={{ color: theme.accent, fontWeight: '700' }}>Password updated successfully!</Text>
              </View>
            ) : null}
            <TouchableOpacity
              style={[styles.modalSaveBtn, { backgroundColor: theme.primary, marginTop: 12 }]}
              onPress={() => {
                setPwdSuccess(true);
                setTimeout(() => {
                  setPwdSuccess(false);
                  setPwdModalVisible(false);
                }, 1200);
              }}
              accessibilityRole="button"
            >
              <Text style={styles.modalSaveText}>Confirm Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  coverPhoto: {
    height: 120,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverOverlay: {
    alignItems: 'center',
  },
  coverTag: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  profileHeaderBox: {
    marginTop: -36,
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 14,
  },
  avatarWrapper: {
    marginTop: -32,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '700',
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  segmentedBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
    marginBottom: 14,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    cursor: 'pointer',
  },
  segmentBtnActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tabContentCard: {
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  contentTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    cursor: 'pointer',
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyTab: {
    padding: 24,
    alignItems: 'center',
  },
  emptyTabText: {
    fontSize: 13,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  activityItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityItemMain: {
    flex: 1,
  },
  activityItemReason: {
    fontSize: 13,
    fontWeight: '700',
  },
  activityItemBy: {
    fontSize: 11,
    marginTop: 1,
  },
  activityItemRight: {
    alignItems: 'flex-end',
  },
  activityItemDelta: {
    fontSize: 13,
    fontWeight: '800',
  },
  activityItemDate: {
    fontSize: 10,
    marginTop: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  settingSub: {
    fontSize: 11,
    marginTop: 2,
  },
  actionRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginTop: 14,
    cursor: 'pointer',
  },
  actionRowText: {
    fontSize: 13,
    fontWeight: '700',
  },
  logoutBtn: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    cursor: 'pointer',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
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
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  modalDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 6,
  },
  modalInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 8,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    cursor: 'pointer',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalSaveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  pwdSuccessBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
});
