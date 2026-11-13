import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchLeaderboardThunk, fetchMyRankThunk } from '../../store/slices/leaderboardSlice';
import { useAppTheme } from '../../context/ThemeContext';
import { LayoutContainer } from '../../components/LayoutContainer';
import { Header } from '../../components/Header';
import { RankCard } from '../../components/RankCard';
import { PaginationBar } from '../../components/PaginationBar';

// Student leaderboard view displaying real-time ranks, podium standings, and personal metrics
export default function StudentLeaderboardScreen() {
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    students,
    page,
    totalPages,
    totalElements,
    myRank,
    isLoading,
  } = useAppSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboardThunk({ page: 0, size: 10 }));
    dispatch(fetchMyRankThunk());
  }, [dispatch]);

  const handlePageChange = (newPage: number) => {
    dispatch(fetchLeaderboardThunk({ page: newPage, size: 10 }));
  };

  const handleRefresh = () => {
    dispatch(fetchLeaderboardThunk({ page, size: 10 }));
    dispatch(fetchMyRankThunk());
  };

  // Top 3 Podium Students
  const topThree = students.slice(0, 3);

  return (
    <LayoutContainer>
      <Header title="Leaderboard" subtitle="Live Academic Standings" />

      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor={theme.primary} />
        }
      >
        {/* Student's Personal Rank Highlight Card */}
        {myRank && (
          <View style={[styles.heroCard, { backgroundColor: theme.primary, borderColor: theme.primaryDark }]}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroPretitle}>YOUR STANDING</Text>
              <Text style={styles.heroTitle}>{user?.fullName}</Text>
              <Text style={styles.heroSub}>
                Roll No: {myRank.rollNumber || user?.rollNumber || 'RBU-2026'}
              </Text>
            </View>

            <View style={styles.heroRight}>
              <View style={styles.heroRankBadge}>
                <Text style={styles.heroRankNumber}>#{myRank.rank}</Text>
                <Text style={styles.heroRankLabel}>Rank</Text>
              </View>
              <View style={styles.heroPointsPill}>
                <Text style={styles.heroPointsText}>⭐ {myRank.totalPoints} pts</Text>
              </View>
            </View>
          </View>
        )}

        {/* Podium Highlight */}
        {page === 0 && topThree.length >= 3 && (
          <View style={[styles.podiumContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Performers</Text>

            <View style={styles.podiumRow}>
              {/* 2nd Place */}
              <View style={[styles.podiumCol, styles.podiumCol2]}>
                <View style={[styles.podiumAvatar, { backgroundColor: '#F1F5F9' }]}>
                  <Text style={styles.podiumMedal}>🥈</Text>
                </View>
                <Text style={[styles.podiumName, { color: theme.text }]} numberOfLines={1}>
                  {topThree[1].fullName}
                </Text>
                <Text style={[styles.podiumScore, { color: theme.textSecondary }]}>
                  {topThree[1].totalPoints} pts
                </Text>
                <View style={[styles.podiumBlock, { height: 60, backgroundColor: '#E2E8F0' }]}>
                  <Text style={styles.podiumPlaceText}>2</Text>
                </View>
              </View>

              {/* 1st Place */}
              <View style={[styles.podiumCol, styles.podiumCol1]}>
                <View style={[styles.podiumAvatar, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={styles.podiumMedal}>🥇</Text>
                </View>
                <Text style={[styles.podiumName, { color: theme.text }]} numberOfLines={1}>
                  {topThree[0].fullName}
                </Text>
                <Text style={[styles.podiumScore, { color: '#D97706', fontWeight: '700' }]}>
                  {topThree[0].totalPoints} pts
                </Text>
                <View style={[styles.podiumBlock, { height: 85, backgroundColor: '#FCD34D' }]}>
                  <Text style={[styles.podiumPlaceText, { color: '#78350F' }]}>1</Text>
                </View>
              </View>

              {/* 3rd Place */}
              <View style={[styles.podiumCol, styles.podiumCol3]}>
                <View style={[styles.podiumAvatar, { backgroundColor: '#FFEDD5' }]}>
                  <Text style={styles.podiumMedal}>🥉</Text>
                </View>
                <Text style={[styles.podiumName, { color: theme.text }]} numberOfLines={1}>
                  {topThree[2].fullName}
                </Text>
                <Text style={[styles.podiumScore, { color: theme.textSecondary }]}>
                  {topThree[2].totalPoints} pts
                </Text>
                <View style={[styles.podiumBlock, { height: 45, backgroundColor: '#FDBA74' }]}>
                  <Text style={styles.podiumPlaceText}>3</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.listHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Full Rankings</Text>
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
                isCurrentUser={
                  student.userId === user?.id ||
                  student.studentProfileId === user?.studentProfileId
                }
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
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  heroCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 4,
  },
  heroLeft: {
    flex: 1,
  },
  heroPretitle: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  heroSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    marginTop: 4,
  },
  heroRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  heroRankBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  heroRankNumber: {
    color: '#4F46E5',
    fontSize: 18,
    fontWeight: '800',
  },
  heroRankLabel: {
    color: '#6366F1',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  heroPointsPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  heroPointsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  podiumContainer: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 10,
  },
  podiumCol: {
    flex: 1,
    alignItems: 'center',
  },
  podiumCol1: {
    zIndex: 2,
  },
  podiumCol2: {},
  podiumCol3: {},
  podiumAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  podiumMedal: {
    fontSize: 20,
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  podiumScore: {
    fontSize: 11,
    marginBottom: 6,
  },
  podiumBlock: {
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumPlaceText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pageInfo: {
    fontSize: 12,
    fontWeight: '500',
  },
  listWrapper: {
    marginBottom: 8,
  },
});
