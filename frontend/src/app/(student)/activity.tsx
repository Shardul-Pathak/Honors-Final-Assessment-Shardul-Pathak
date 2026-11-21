import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchMyHistoryThunk } from '../../store/slices/leaderboardSlice';
import { useAppTheme } from '../../context/ThemeContext';
import { LayoutContainer } from '../../components/LayoutContainer';
import { Header } from '../../components/Header';

// Student Activity Feed & Audit Trail screen
export default function StudentActivityScreen() {
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { myHistory, isLoading } = useAppSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchMyHistoryThunk());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchMyHistoryThunk());
  };

  return (
    <LayoutContainer>
      <Header title="Activity Stream" subtitle="Points History & Event Audits" />

      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor={theme.primary} />
        }
      >
        <Text style={[styles.sectionTitle, { color: theme.text }]}>All Recorded Transactions</Text>

        {isLoading && myHistory.length === 0 ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 40 }} />
        ) : myHistory.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Feather name="clock" size={32} color={theme.textMuted} style={{ marginBottom: 8 }} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No points transactions recorded yet.
            </Text>
          </View>
        ) : (
          <View style={styles.listWrapper}>
            {myHistory.map((tx) => (
              <View
                key={tx.id}
                style={[styles.activityCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              >
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Feather
                    name={tx.pointsDelta >= 0 ? 'arrow-up-right' : 'arrow-down-right'}
                    size={18}
                    color={tx.pointsDelta >= 0 ? theme.accent : theme.error}
                  />
                </View>

                <View style={styles.cardContent}>
                  <Text style={[styles.reasonText, { color: theme.text }]}>{tx.reason}</Text>
                  <Text style={[styles.byText, { color: theme.textSecondary }]}>
                    Awarded by: {tx.awardedByName}
                  </Text>
                  <Text style={[styles.dateText, { color: theme.textMuted }]}>
                    {new Date(tx.createdAt).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.pointsCol}>
                  <Text
                    style={[
                      styles.deltaText,
                      { color: tx.pointsDelta >= 0 ? theme.accent : theme.error },
                    ]}
                  >
                    {tx.pointsDelta > 0 ? `+${tx.pointsDelta}` : tx.pointsDelta} pts
                  </Text>
                </View>
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  emptyBox: {
    padding: 30,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
  listWrapper: {
    gap: 10,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  reasonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  byText: {
    fontSize: 12,
    marginTop: 2,
  },
  dateText: {
    fontSize: 11,
    marginTop: 2,
  },
  pointsCol: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  deltaText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
