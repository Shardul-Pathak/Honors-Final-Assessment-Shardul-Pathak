import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { LeaderboardItem, awardPointsThunk, optimisticPointAward } from '../store/slices/leaderboardSlice';
import { useAppDispatch, useAppSelector } from '../store';

interface AwardPointsModalProps {
  visible: boolean;
  student: LeaderboardItem | null;
  onClose: () => void;
}

const QUICK_POINT_OPTIONS = [10, 25, 50, 100, -10];

export const AwardPointsModal: React.FC<AwardPointsModalProps> = ({
  visible,
  student,
  onClose,
}) => {
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { isAwarding } = useAppSelector((state) => state.leaderboard);

  const [points, setPoints] = useState<number>(25);
  const [customPoints, setCustomPoints] = useState<string>('25');
  const [reason, setReason] = useState<string>('Active participation in class');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!student) return null;

  const handleSelectQuick = (val: number) => {
    setPoints(val);
    setCustomPoints(val.toString());
  };

  const handleCustomChange = (text: string) => {
    setCustomPoints(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed)) {
      setPoints(parsed);
    }
  };

  const handleSubmit = async () => {
    if (!points || points === 0) {
      setErrorMsg('Points cannot be 0');
      return;
    }
    if (!reason.trim()) {
      setErrorMsg('Please specify a reason');
      return;
    }

    setErrorMsg(null);

    // Optimistically update the UI leaderboard right away
    dispatch(optimisticPointAward({ studentProfileId: student.studentProfileId, points }));

    try {
      await dispatch(
        awardPointsThunk({
          studentProfileId: student.studentProfileId,
          points,
          reason: reason.trim(),
        })
      ).unwrap();
      onClose();
    } catch (err: any) {
      setErrorMsg(err || 'Failed to award points');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Award Performance Points</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Feather name="x" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.studentBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.studentName, { color: theme.text }]}>{student.fullName}</Text>
            <Text style={[styles.studentMeta, { color: theme.textSecondary }]}>
              {student.rollNumber || 'No Roll'} • Current Score: {student.totalPoints} pts
            </Text>
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Quick Select</Text>
          <View style={styles.chipsRow}>
            {QUICK_POINT_OPTIONS.map((val) => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.chip,
                  {
                    backgroundColor: points === val ? theme.primary : theme.surface,
                    borderColor: points === val ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => handleSelectQuick(val)}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: points === val ? '#FFFFFF' : theme.text },
                  ]}
                >
                  {val > 0 ? `+${val}` : val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Points to Award / Deduct</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            value={customPoints}
            onChangeText={handleCustomChange}
            keyboardType="numeric"
            placeholder="e.g. 50 or -10"
            placeholderTextColor={theme.textMuted}
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>Reason / Category</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            value={reason}
            onChangeText={setReason}
            placeholder="e.g. Coursework assignment"
            placeholderTextColor={theme.textMuted}
          />

          {errorMsg && <Text style={[styles.error, { color: theme.error }]}>{errorMsg}</Text>}

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.cancelBtn,
                { borderColor: theme.border },
                isAwarding && styles.disabledBtn,
              ]}
              onPress={onClose}
              disabled={isAwarding}
              accessibilityRole="button"
            >
              <Text style={[styles.btnText, { color: theme.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitBtn,
                { backgroundColor: theme.primary },
                isAwarding && styles.disabledBtn,
              ]}
              onPress={handleSubmit}
              disabled={isAwarding}
              accessibilityRole="button"
            >
              {isAwarding ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={[styles.btnText, { color: '#FFFFFF' }]}>Confirm Award</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    width: '100%',
    maxWidth: 460,
    borderRadius: 18,
    borderWidth: 1,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
    cursor: 'pointer',
  },
  studentBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
  },
  studentMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    cursor: 'pointer',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  error: {
    fontSize: 12,
    marginBottom: 10,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 90,
    alignItems: 'center',
    cursor: 'pointer',
  },
  cancelBtn: {
    borderWidth: 1,
  },
  submitBtn: {},
  disabledBtn: {
    opacity: 0.6,
    cursor: 'not-allowed' as any,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
