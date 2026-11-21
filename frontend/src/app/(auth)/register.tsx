import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../store';
import { registerThunk, clearAuthError } from '../../store/slices/authSlice';
import { useAppTheme } from '../../context/ThemeContext';
import { LayoutContainer } from '../../components/LayoutContainer';

// User registration screen matching wireframe mockup
export default function RegisterScreen() {
  const { theme, isDark, toggleTheme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [rollNumber, setRollNumber] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Computer Science');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setValidationError('Please complete all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setValidationError('You must agree to the Terms of Service');
      return;
    }

    setValidationError(null);
    dispatch(clearAuthError());

    const payload = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      rollNumber: role === 'STUDENT' ? (rollNumber.trim() || `RBU-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
      gradeLevel: role === 'STUDENT' ? (gradeLevel.trim() || 'Computer Science') : undefined,
    };

    const result = await dispatch(registerThunk(payload));
    if (registerThunk.fulfilled.match(result)) {
      if (role === 'TEACHER') {
        router.replace('/(teacher)');
      } else {
        router.replace('/(student)');
      }
    }
  };

  const displayError = validationError || error;

  return (
    <LayoutContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.cardWrapper}>
            {/* Top Navigation & Theme Toggle */}
            <View style={styles.topBar}>
              <TouchableOpacity
                onPress={() => router.push('/')}
                style={styles.backBtn}
                accessibilityRole="button"
              >
                <Feather name="arrow-left" size={18} color={theme.text} style={{ marginRight: 6 }} />
                <Text style={[styles.backText, { color: theme.text }]}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={toggleTheme}
                style={[styles.themeBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
                accessibilityLabel="Toggle Theme"
                accessibilityRole="button"
              >
                <Feather name={isDark ? 'sun' : 'moon'} size={18} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Segmented Top Bar: [ LOGIN ] | [ REGISTER ] */}
            <View style={[styles.segmentedBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <TouchableOpacity
                style={styles.segmentTab}
                onPress={() => router.push('/(auth)/login')}
                accessibilityRole="tab"
                accessibilityState={{ selected: false }}
              >
                <Text style={[styles.segmentText, { color: theme.textSecondary }]}>LOGIN</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.segmentTab, styles.segmentTabActive, { backgroundColor: theme.card }]}
                accessibilityRole="tab"
                accessibilityState={{ selected: true }}
              >
                <Text style={[styles.segmentText, styles.segmentTextActive, { color: theme.primary }]}>
                  REGISTER
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Form Container */}
            <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Sign Up</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  Create your academic profile
                </Text>
              </View>

              {displayError && (
                <View style={[styles.errorBox, { backgroundColor: theme.error + '15', borderColor: theme.error }]}>
                  <Text style={[styles.errorText, { color: theme.error }]}>{displayError}</Text>
                </View>
              )}

              {/* Role Selection */}
              <Text style={[styles.label, { color: theme.textSecondary }]}>Account Role</Text>
              <View style={styles.roleSelector}>
                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    role === 'STUDENT'
                      ? { backgroundColor: theme.primary, borderColor: theme.primary }
                      : { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                  onPress={() => setRole('STUDENT')}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: role === 'STUDENT' }}
                >
                  <Ionicons
                    name="school-outline"
                    size={16}
                    color={role === 'STUDENT' ? '#FFFFFF' : theme.text}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.roleText,
                      { color: role === 'STUDENT' ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    Student
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    role === 'TEACHER'
                      ? { backgroundColor: theme.primary, borderColor: theme.primary }
                      : { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                  onPress={() => setRole('TEACHER')}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: role === 'TEACHER' }}
                >
                  <Ionicons
                    name="briefcase-outline"
                    size={16}
                    color={role === 'TEACHER' ? '#FFFFFF' : theme.text}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.roleText,
                      { color: role === 'TEACHER' ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    Faculty
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, { color: theme.textSecondary }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
                placeholderTextColor={theme.textMuted}
              />

              <Text style={[styles.label, { color: theme.textSecondary }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={[styles.label, { color: theme.textSecondary }]}>Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border },
                  ]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
                  placeholderTextColor={theme.textMuted}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityRole="button"
                >
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={18}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, { color: theme.textSecondary }]}>Confirm Password</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter password"
                placeholderTextColor={theme.textMuted}
                secureTextEntry={!showPassword}
              />

              {role === 'STUDENT' && (
                <>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>Roll Number</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                    value={rollNumber}
                    onChangeText={setRollNumber}
                    placeholder="e.g. RBU-2026-050"
                    placeholderTextColor={theme.textMuted}
                  />

                  <Text style={[styles.label, { color: theme.textSecondary }]}>Department / Major</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                    value={gradeLevel}
                    onChangeText={setGradeLevel}
                    placeholder="e.g. Computer Science"
                    placeholderTextColor={theme.textMuted}
                  />
                </>
              )}

              {/* Terms of Service Checkbox */}
              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: agreedToTerms }}
              >
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: agreedToTerms ? theme.primary : theme.border },
                    agreedToTerms && { backgroundColor: theme.primary },
                  ]}
                >
                  {agreedToTerms && <Feather name="check" size={14} color="#FFFFFF" />}
                </View>
                <Text style={[styles.termsText, { color: theme.textSecondary }]}>
                  I agree to the <Text style={{ color: theme.primary, fontWeight: '600' }}>Terms & Academic Integrity</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  { backgroundColor: theme.primary },
                  isLoading && styles.disabledBtn,
                ]}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.8}
                accessibilityRole="button"
                aria-disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>CREATE ACCOUNT</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 460,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    cursor: 'pointer',
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  segmentedBar: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    cursor: 'pointer',
  },
  segmentTabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  segmentTextActive: {},
  formCard: {
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  errorBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  roleText: {
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 12,
  },
  passwordWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  passwordInput: {
    marginBottom: 0,
    paddingRight: 44,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 13,
    padding: 2,
    cursor: 'pointer',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 10,
    cursor: 'pointer',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    fontSize: 13,
    flex: 1,
  },
  submitBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    cursor: 'pointer',
  },
  disabledBtn: {
    opacity: 0.6,
    cursor: 'not-allowed' as any,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
