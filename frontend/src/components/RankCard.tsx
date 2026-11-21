import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { LeaderboardItem } from '../store/slices/leaderboardSlice';

interface RankCardProps {
  item: LeaderboardItem;
  isCurrentUser?: boolean;
  isTeacher?: boolean;
  onAwardPress?: (item: LeaderboardItem) => void;
}

export const RankCard: React.FC<RankCardProps> = ({
  item,
  isCurrentUser = false,
  isTeacher = false,
  onAwardPress,
}) => {
  const { theme } = useAppTheme();

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A', label: '1st' };
    if (rank === 2) return { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0', label: '2nd' };
    if (rank === 3) return { bg: '#FFEDD5', color: '#9A3412', border: '#FED7AA', label: '3rd' };
    return { bg: theme.surface, color: theme.textSecondary, border: theme.border, label: `#${rank}` };
  };

  const badge = getRankBadge(item.rank);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isCurrentUser ? theme.primaryLight : theme.card,
          borderColor: isCurrentUser ? theme.primary : theme.border,
        },
      ]}
    >
      <View style={styles.leftRow}>
        <View style={[styles.rankBadge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
          <Text style={[styles.rankText, { color: badge.color }]}>{badge.label}</Text>
        </View>

        <View style={[styles.avatar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.avatarText, { color: theme.primary }]}>
            {getInitials(item.fullName)}
          </Text>
        </View>

        <View style={styles.nameBlock}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
              {item.fullName}
            </Text>
            {isCurrentUser && (
              <View style={[styles.youBadge, { backgroundColor: theme.primary }]}>
                <Text style={styles.youText}>You</Text>
              </View>
            )}
          </View>
          <Text style={[styles.meta, { color: theme.textSecondary }]}>
            {item.rollNumber || 'No Roll'} • {item.gradeLevel || 'Student'}
          </Text>
        </View>
      </View>

      <View style={styles.rightRow}>
        <View style={[styles.pointsPill, { backgroundColor: theme.accentLight }]}>
          <Ionicons name="star" size={13} color={theme.accent} />
          <Text style={[styles.pointsText, { color: theme.accent }]}>
            {item.totalPoints} <Text style={styles.ptsUnit}>pts</Text>
          </Text>
        </View>

        {isTeacher && (
          <TouchableOpacity
            style={[styles.awardButton, { backgroundColor: theme.primary }]}
            onPress={() => onAwardPress && onAwardPress(item)}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={14} color="#FFFFFF" style={{ marginRight: 2 }} />
            <Text style={styles.awardButtonText}>Award</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  rankBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  nameBlock: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
  },
  youBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  youText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  meta: {
    fontSize: 11,
    marginTop: 2,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  pointsText: {
    fontSize: 13,
    fontWeight: '700',
  },
  ptsUnit: {
    fontSize: 10,
    fontWeight: '500',
  },
  awardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  awardButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
