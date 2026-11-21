import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchRecentTransactionsThunk,
  fetchOverviewStatsThunk,
} from '../../store/slices/leaderboardSlice';
import { useAppTheme } from '../../context/ThemeContext';
import { LayoutContainer } from '../../components/LayoutContainer';
import { Header } from '../../components/Header';

// Faculty Admin Console & System Audit Log
export default function TeacherAdminScreen() {
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { recentTransactions, overviewStats, isLoading } = useAppSelector(
    (state) => state.leaderboard
  );

  useEffect(() => {
    dispatch(fetchRecentTransactionsThunk(20));
    dispatch(fetchOverviewStatsThunk());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchRecentTransactionsThunk(20));
    dispatch(fetchOverviewStatsThunk());
  };

  return (
    <LayoutContainer>
      <Header title="Admin Console" subtitle="System Health & Audit Trail" />

      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor={theme.primary} />
        }
      >
        {/* System Health Card */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Infrastructure Status</Text>

          <View style={styles.healthRow}>
            <View style={styles.healthLeft}>
              <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.healthName, { color: theme.text }]}>Database</Text>
            </View>
            <Text style={[styles.healthVal, { color: theme.accent }]}>PostgreSQL 16 (Port 5433)</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.healthRow}>
            <View style={styles.healthLeft}>
              <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.healthName, { color: theme.text }]}>Backend Service</Text>
            </View>
            <Text style={[styles.healthVal, { color: theme.accent }]}>Spring Boot 4.1.2 • Java 25</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.healthRow}>
            <View style={styles.healthLeft}>
              <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.healthName, { color: theme.text }]}>Access Control</Text>
            </View>
            <Text style={[styles.healthVal, { color: theme.accent }]}>Spring Security 6 JWT</Text>
          </View>
        </View>

        {/* Global Stats Summary */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Students</Text>
            <Text style={[styles.statNum, { color: theme.primary }]}>
              {overviewStats ? overviewStats.totalStudents : 16}
            </Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Net Points</Text>
            <Text style={[styles.statNum, { color: theme.accent }]}>
              {overviewStats ? overviewStats.totalPointsDistributed : 0}
            </Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Class Average</Text>
            <Text style={[styles.statNum, { color: theme.gold }]}>
              {overviewStats ? overviewStats.avgScore : 310}
            </Text>
          </View>
        </View>

        {/* Audit Log Stream */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>System Audit Log</Text>
          <Text style={[styles.cardSub, { color: theme.textSecondary }]}>
            Chronological audit of points adjustments and faculty actions:
          </Text>

          {recentTransactions.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              No audit records currently available.
            </Text>
          ) : (
            recentTransactions.map((tx) => (
              <View key={tx.id} style={[styles.logRow, { borderBottomColor: theme.border }]}>
                <View style={[styles.logDot, { backgroundColor: tx.pointsDelta >= 0 ? theme.accent : theme.error }]} />
                <View style={styles.logMain}>
                  <Text style={[styles.logStudent, { color: theme.text }]}>
                    {tx.studentName || 'Student'} ({tx.studentRollNumber || 'RBU'})
                  </Text>
                  <Text style={[styles.logDesc, { color: theme.textSecondary }]}>
                    Reason: {tx.reason} • Awarded by {tx.awardedByName}
                  </Text>
                  <Text style={[styles.logTimestamp, { color: theme.textMuted }]}>
                    {new Date(tx.createdAt).toLocaleString()}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.logPoints,
                    { color: tx.pointsDelta >= 0 ? theme.accent : theme.error },
                  ]}
                >
                  {tx.pointsDelta > 0 ? `+${tx.pointsDelta}` : tx.pointsDelta} pts
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    marginBottom: 14,
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  healthLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  healthName: {
    fontSize: 13,
    fontWeight: '700',
  },
  healthVal: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 13,
    paddingVertical: 10,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  logDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  logMain: {
    flex: 1,
  },
  logStudent: {
    fontSize: 13,
    fontWeight: '700',
  },
  logDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  logTimestamp: {
    fontSize: 10,
    marginTop: 2,
  },
  logPoints: {
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 6,
  },
});
