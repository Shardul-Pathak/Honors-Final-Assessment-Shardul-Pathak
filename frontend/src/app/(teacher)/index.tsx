import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchLeaderboardThunk,
  LeaderboardItem,
  clearAwardMessage,
} from '../../store/slices/leaderboardSlice';
import { useAppTheme } from '../../context/ThemeContext';
import { LayoutContainer } from '../../components/LayoutContainer';
import { Header } from '../../components/Header';
import { RankCard } from '../../components/RankCard';
import { PaginationBar } from '../../components/PaginationBar';
import { AwardPointsModal } from '../../components/AwardPointsModal';

// Teacher dashboard for reviewing rankings and awarding performance points
export default function TeacherLeaderboardScreen() {
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const {
    students,
    page,
    totalPages,
    totalElements,
    isLoading,
    awardSuccessMessage,
  } = useAppSelector((state) => state.leaderboard);

  const [selectedStudent, setSelectedStudent] = useState<LeaderboardItem | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchLeaderboardThunk({ page: 0, size: 10 }));
  }, [dispatch]);

  const handlePageChange = (newPage: number) => {
    dispatch(fetchLeaderboardThunk({ page: newPage, size: 10 }));
  };

  const handleRefresh = () => {
    dispatch(fetchLeaderboardThunk({ page, size: 10 }));
  };

  const handleOpenAwardModal = (student: LeaderboardItem) => {
    setSelectedStudent(student);
    setModalVisible(true);
  };

  const handleCloseAwardModal = () => {
    setModalVisible(false);
    setSelectedStudent(null);
  };

  // Compute classroom summary metrics
  const highestPoints = students.length > 0 ? students[0].totalPoints : 0;
  const avgPoints =
    students.length > 0
      ? Math.round(students.reduce((acc, s) => acc + s.totalPoints, 0) / students.length)
      : 0;

  return (
    <LayoutContainer>
      <Header title="Faculty Hub" subtitle="Leaderboard & Point Awards" />

      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor={theme.primary} />
        }
      >
        {/* Metric Cards Banner */}
        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Feather name="users" size={18} color={theme.primary} style={styles.metricIcon} />
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Enrolled</Text>
            <Text style={[styles.metricValue, { color: theme.primary }]}>{totalElements}</Text>
            <Text style={[styles.metricSub, { color: theme.textMuted }]}>Students</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="trophy-outline" size={18} color={theme.gold} style={styles.metricIcon} />
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Top Score</Text>
            <Text style={[styles.metricValue, { color: theme.gold }]}>{highestPoints}</Text>
            <Text style={[styles.metricSub, { color: theme.textMuted }]}>Leader pts</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Feather name="trending-up" size={18} color={theme.accent} style={styles.metricIcon} />
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Class Avg</Text>
            <Text style={[styles.metricValue, { color: theme.accent }]}>{avgPoints}</Text>
            <Text style={[styles.metricSub, { color: theme.textMuted }]}>Points / st</Text>
          </View>
        </View>

        {/* Success feedback alert */}
        {awardSuccessMessage && (
          <View style={[styles.alertBox, { backgroundColor: theme.accentLight, borderColor: theme.accent }]}>
            <View style={styles.alertContent}>
              <Feather name="check-circle" size={16} color={theme.accent} style={{ marginRight: 8 }} />
              <Text style={[styles.alertText, { color: theme.accent }]}>{awardSuccessMessage}</Text>
            </View>
            <TouchableOpacity
              onPress={() => dispatch(clearAwardMessage())}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Dismiss message"
              style={styles.dismissBtn}
            >
              <Feather name="x" size={16} color={theme.accent} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.listHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Student Standings</Text>
          <Text style={[styles.pageInfo, { color: theme.textSecondary }]}>
            Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
          </Text>
        </View>

        {isLoading && students.length === 0 ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 40 }} />
        ) : (
          <View style={styles.listWrapper}>
            {students.map((student) => (
              <RankCard
                key={student.studentProfileId}
                item={student}
                isTeacher={true}
                onAwardPress={handleOpenAwardModal}
              />
            ))}
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
        onClose={handleCloseAwardModal}
      />
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  metricIcon: {
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    marginVertical: 4,
  },
  metricSub: {
    fontSize: 10,
    fontWeight: '500',
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
  dismissBtn: {
    padding: 4,
    cursor: 'pointer',
  },
  alertText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  pageInfo: {
    fontSize: 12,
    fontWeight: '500',
  },
  listWrapper: {
    marginBottom: 8,
  },
});
