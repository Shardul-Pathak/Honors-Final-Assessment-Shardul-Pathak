import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

interface PaginationBarProps {
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (newPage: number) => void;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  page,
  totalPages,
  totalElements,
  onPageChange,
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { borderTopColor: theme.border, backgroundColor: theme.card }]}>
      <Text style={[styles.totalText, { color: theme.textSecondary }]}>
        Showing {totalElements} total students
      </Text>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.navBtn,
            { backgroundColor: theme.surface, borderColor: theme.border },
            page === 0 && styles.disabledBtn,
          ]}
          onPress={() => onPageChange(page - 1)}
          disabled={page === 0}
        >
          <Feather
            name="chevron-left"
            size={16}
            color={page === 0 ? theme.textMuted : theme.text}
            style={{ marginRight: 2 }}
          />
          <Text style={[styles.navBtnText, { color: page === 0 ? theme.textMuted : theme.text }]}>
            Previous
          </Text>
        </TouchableOpacity>

        <Text style={[styles.pageIndicator, { color: theme.text }]}>
          {totalPages === 0 ? 0 : page + 1} / {totalPages}
        </Text>

        <TouchableOpacity
          style={[
            styles.navBtn,
            { backgroundColor: theme.surface, borderColor: theme.border },
            (page >= totalPages - 1 || totalPages === 0) && styles.disabledBtn,
          ]}
          onPress={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1 || totalPages === 0}
        >
          <Text
            style={[
              styles.navBtnText,
              { color: page >= totalPages - 1 || totalPages === 0 ? theme.textMuted : theme.text },
            ]}
          >
            Next
          </Text>
          <Feather
            name="chevron-right"
            size={16}
            color={page >= totalPages - 1 || totalPages === 0 ? theme.textMuted : theme.text}
            style={{ marginLeft: 2 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderTopWidth: 1,
  },
  totalText: {
    fontSize: 12,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pageIndicator: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 6,
  },
});
