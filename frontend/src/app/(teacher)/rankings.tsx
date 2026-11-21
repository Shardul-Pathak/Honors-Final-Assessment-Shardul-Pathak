import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchLeaderboardThunk,
  setSelectedDepartment,
  setSelectedTerm,
  LeaderboardItem,
  clearAwardMessage,
} from '../../store/slices/leaderboardSlice';
import { useAppTheme } from '../../context/ThemeContext';
import { LayoutContainer } from '../../components/LayoutContainer';
import { Header } from '../../components/Header';
import { PaginationBar } from '../../components/PaginationBar';
import { AwardPointsModal } from '../../components/AwardPointsModal';

const DEPARTMENTS = ['All', 'Computer Science', 'Data Science', 'Artificial Intelligence', 'Cybersecurity'];
const TERMS = ['Fall 2026', 'Spring 2026', 'All-Time'];

// Class Rankings screen for Faculty strictly matching Design.jpeg
export default function TeacherRankingsScreen() {
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const {
    students,
    page,
    totalPages,
    totalElements,
    selectedDepartment,
    selectedTerm,
    isLoading,
    awardSuccessMessage,
  } = useAppSelector((state) => state.leaderboard);

  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<LeaderboardItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(
      fetchLeaderboardThunk({
        page: 0,
        size: 10,
        department: selectedDepartment,
      })
    );
  }, [dispatch, selectedDepartment]);

  const handlePageChange = (newPage: number) => {
    dispatch(
      fetchLeaderboardThunk({
        page: newPage,
        size: 10,
        department: selectedDepartment,
      })
    );
  };

  const handleRefresh = () => {
    dispatch(
      fetchLeaderboardThunk({
        page,
        size: 10,
        department: selectedDepartment,
      })
    );
  };

  const handleSelectDepartment = (dept: string) => {
    dispatch(setSelectedDepartment(dept));
    setFilterMenuOpen(false);
  };

  const handleSelectTerm = (term: string) => {
    dispatch(setSelectedTerm(term));
  };

  const handleOpenAwardModal = (student: LeaderboardItem) => {
    setSelectedStudent(student);
    setModalVisible(true);
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { bg: '#FEF3C7', color: '#B45309', label: '1' };
    if (rank === 2) return { bg: '#F1F5F9', color: '#475569', label: '2' };
    if (rank === 3) return { bg: '#FFEDD5', color: '#9A3412', label: '3' };
    return { bg: theme.surface, color: theme.textSecondary, label: `${rank}` };
  };

  return (
    <LayoutContainer>
      <Header title="Class Rankings" subtitle={`Faculty Assessment • ${selectedTerm}`} />

      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor={theme.primary} />
        }
      >
        {/* Success feedback alert */}
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

        {/* Filters Bar: Subject Dropdown & Term Selector */}
        <View style={[styles.filtersCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.filtersTopRow}>
            <Text style={[styles.filtersTitle, { color: theme.text }]}>Filters</Text>
            <TouchableOpacity
              style={[styles.dropdownBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => setFilterMenuOpen(!filterMenuOpen)}
              accessibilityRole="button"
            >
              <Text style={[styles.dropdownBtnText, { color: theme.primary }]}>
                Subject: {selectedDepartment}
              </Text>
              <Feather
                name={filterMenuOpen ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={theme.primary}
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>

          {/* Department Dropdown Chips */}
          {filterMenuOpen && (
            <View style={styles.deptChipsGrid}>
              {DEPARTMENTS.map((dept) => (
                <TouchableOpacity
                  key={dept}
                  style={[
                    styles.deptChip,
                    {
                      backgroundColor: selectedDepartment === dept ? theme.primary : theme.surface,
                      borderColor: selectedDepartment === dept ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => handleSelectDepartment(dept)}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.deptChipText,
                      { color: selectedDepartment === dept ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {dept}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Term Selector Pills */}
          <View style={styles.termsRow}>
            <Text style={[styles.termLabel, { color: theme.textSecondary }]}>Term:</Text>
            <View style={styles.termPills}>
              {TERMS.map((term) => (
                <TouchableOpacity
                  key={term}
                  style={[
                    styles.termPill,
                    {
                      backgroundColor: selectedTerm === term ? theme.accent : theme.surface,
                      borderColor: selectedTerm === term ? theme.accent : theme.border,
                    },
                  ]}
                  onPress={() => handleSelectTerm(term)}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.termPillText,
                      { color: selectedTerm === term ? '#FFFFFF' : theme.textSecondary },
                    ]}
                  >
                    {term}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Ranking List Table Header */}
        <View style={[styles.tableHeader, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.thRank, { color: theme.textSecondary }]}>#Rank</Text>
          <Text style={[styles.thStudent, { color: theme.textSecondary }]}>Student</Text>
          <Text style={[styles.thScore, { color: theme.textSecondary }]}>Score</Text>
          <Text style={[styles.thAction, { color: theme.textSecondary }]}>Action</Text>
        </View>

        {/* Ranking Rows */}
        {isLoading && students.length === 0 ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 40 }} />
        ) : (
          <View style={styles.tableBody}>
            {students.map((student) => {
              const badge = getRankBadge(student.rank);

              return (
                <View
                  key={student.studentProfileId}
                  style={[styles.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  {/* Rank Column */}
                  <View style={[styles.rankBox, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.rankNum, { color: badge.color }]}>{badge.label}</Text>
                  </View>

                  {/* Student Column */}
                  <View style={styles.studentCol}>
                    <View style={[styles.studentAvatar, { backgroundColor: theme.surface }]}>
                      <Text style={[styles.avatarText, { color: theme.primary }]}>
                        {student.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.studentMetaBlock}>
                      <Text style={[styles.studentName, { color: theme.text }]} numberOfLines={1}>
                        {student.fullName}
                      </Text>
                      <Text style={[styles.studentSub, { color: theme.textSecondary }]}>
                        {student.rollNumber || 'No Roll'} • {student.gradeLevel || 'CS'}
                      </Text>
                    </View>
                  </View>

                  {/* Score Column */}
                  <View style={styles.scoreCol}>
                    <Text style={[styles.scoreText, { color: theme.accent }]}>
                      {student.totalPoints}
                    </Text>
                    <Text style={[styles.scoreUnit, { color: theme.textMuted }]}>pts</Text>
                  </View>

                  {/* Action Column (+ Award button) */}
                  <TouchableOpacity
                    style={[styles.awardActionBtn, { backgroundColor: theme.primary }]}
                    onPress={() => handleOpenAwardModal(student)}
                    accessibilityRole="button"
                  >
                    <Feather name="plus" size={12} color="#FFFFFF" style={{ marginRight: 2 }} />
                    <Text style={styles.awardActionText}>Award</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        <PaginationBar
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={handlePageChange}
        />
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
    marginBottom: 14,
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
  filtersCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  filtersTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    cursor: 'pointer',
  },
  dropdownBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  deptChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  deptChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    cursor: 'pointer',
  },
  deptChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  termLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  termPills: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  termPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    cursor: 'pointer',
  },
  termPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  thRank: {
    width: 44,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  thStudent: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginLeft: 6,
  },
  thScore: {
    width: 54,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'right',
  },
  thAction: {
    width: 64,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'right',
  },
  tableBody: {
    gap: 8,
    marginBottom: 8,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  rankBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNum: {
    fontSize: 14,
    fontWeight: '800',
  },
  studentCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  studentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
  },
  studentMetaBlock: {
    flex: 1,
  },
  studentName: {
    fontSize: 13,
    fontWeight: '700',
  },
  studentSub: {
    fontSize: 11,
    marginTop: 1,
  },
  scoreCol: {
    width: 54,
    alignItems: 'flex-end',
    marginRight: 8,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '800',
  },
  scoreUnit: {
    fontSize: 10,
    fontWeight: '600',
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
});
