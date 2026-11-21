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
  Modal,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginThunk, clearAuthError } from '../../store/slices/authSlice';
import { useAppTheme } from '../../context/ThemeContext';
import { LayoutContainer } from '../../components/LayoutContainer';

// User authentication screen matching wireframe mockup
export default function LoginScreen() {
  const { theme, isDark, toggleTheme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotModalVisible, setForgotModalVisible] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return;
    }

    dispatch(clearAuthError());
    const result = await dispatch(loginThunk({ email: email.trim(), password }));
    if (loginThunk.fulfilled.match(result)) {
      if (result.payload.user.role === 'TEACHER') {
        router.replace('/(teacher)');
      } else {
        router.replace('/(student)');
      }
    }
  };

  const handleGoogleSSO = () => {
    // Fill demo student for instant access
    setEmail('student@rbu.edu');
    setPassword('Student123!');
  };

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
                style={[styles.segmentTab, styles.segmentTabActive, { backgroundColor: theme.card }]}
                accessibilityRole="tab"
                accessibilityState={{ selected: true }}
              >
                <Text style={[styles.segmentText, styles.segmentTextActive, { color: theme.primary }]}>
                  LOGIN
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.segmentTab}
                onPress={() => router.push('/(auth)/register')}
                accessibilityRole="tab"
                accessibilityState={{ selected: false }}
              >
                <Text style={[styles.segmentText, { color: theme.textSecondary }]}>REGISTER</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Form Container */}
            <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Sign In</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  Enter your university credentials
                </Text>
              </View>

              {error && (
                <View style={[styles.errorBox, { backgroundColor: theme.error + '15', borderColor: theme.error }]}>
                  <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
                </View>
              )}

              <Text style={[styles.label, { color: theme.textSecondary }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  placeholderTextColor={theme.textMuted}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityRole="button"
                  accessibilityLabel="Toggle password visibility"
                >
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={18}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.forgotRow}>
                <TouchableOpacity onPress={() => setForgotModalVisible(true)} accessibilityRole="link">
                  <Text style={[styles.forgotText, { color: theme.primary }]}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.loginBtn,
                  { backgroundColor: theme.primary },
                  isLoading && styles.disabledBtn,
                ]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
                accessibilityRole="button"
                aria-disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.loginBtnText}>LOG IN</Text>
                )}
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                <Text style={[styles.dividerText, { color: theme.textMuted }]}>or</Text>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              </View>

              {/* Social / Campus SSO button */}
              <TouchableOpacity
                style={[styles.googleBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={handleGoogleSSO}
                accessibilityRole="button"
              >
                <Ionicons name="logo-google" size={16} color="#EA4335" style={{ marginRight: 8 }} />
                <Text style={[styles.googleBtnText, { color: theme.text }]}>Continue with Google</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal visible={forgotModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Reset Password</Text>
            <Text style={[styles.modalDesc, { color: theme.textSecondary }]}>
              Password resets are handled by university IT administrators. Default demo credentials:
            </Text>
            <View style={[styles.credsBox, { backgroundColor: theme.surface }]}>
              <Text style={[styles.credLine, { color: theme.text }]}>
                Student: <Text style={{ fontWeight: '700' }}>student@rbu.edu / Student123!</Text>
              </Text>
              <Text style={[styles.credLine, { color: theme.text }]}>
                Teacher: <Text style={{ fontWeight: '700' }}>teacher@rbu.edu / Teacher123!</Text>
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.modalCloseBtn, { backgroundColor: theme.primary }]}
              onPress={() => setForgotModalVisible(false)}
              accessibilityRole="button"
            >
              <Text style={styles.modalCloseText}>Got It</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    maxWidth: 440,
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
    marginBottom: 18,
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
  input: {
    height: 46,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 14,
  },
  passwordWrapper: {
    position: 'relative',
    marginBottom: 8,
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
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loginBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  disabledBtn: {
    opacity: 0.6,
    cursor: 'not-allowed' as any,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  googleBtn: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  googleBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  credsBox: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 4,
  },
  credLine: {
    fontSize: 12,
  },
  modalCloseBtn: {
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
