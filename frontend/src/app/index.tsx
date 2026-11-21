import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppSelector } from '../store';
import { useAppTheme } from '../context/ThemeContext';
import { LayoutContainer } from '../components/LayoutContainer';

// Guest Home Landing Screen as designed in wireframe mockup
export default function GuestHomeScreen() {
  const { theme, isDark, toggleTheme } = useAppTheme();
  const { isAuthenticated, isRestoring, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isRestoring && isAuthenticated && user) {
      if (user.role === 'TEACHER') {
        router.replace('/(teacher)');
      } else {
        router.replace('/(student)');
      }
    }
  }, [isRestoring, isAuthenticated, user]);

  return (
    <LayoutContainer>
      {/* Top Navigation Header */}
      <View style={[styles.topNav, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.navBrand}>
          <View style={[styles.navLogoBox, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="school-outline" size={20} color={theme.primary} />
          </View>
          <Text style={[styles.navTitle, { color: theme.text }]}>EduRank LMS</Text>
        </View>

        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.themeBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
          accessibilityLabel="Toggle Day or Night Mode"
          accessibilityRole="button"
        >
          <Feather name={isDark ? 'sun' : 'moon'} size={18} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
        {/* Welcome Hero Banner */}
        <View style={[styles.welcomeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.welcomeHeading, { color: theme.text }]}>Welcome</Text>

          <View style={[styles.appLogoBox, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="school" size={48} color={theme.primary} />
            <Text style={[styles.appLogoText, { color: theme.primary }]}>EduRank</Text>
          </View>

          <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
            Your College Academic Performance & Real-Time Student Leaderboard Platform
          </Text>

          <View style={styles.getStartedBlock}>
            <Text style={[styles.getStartedLabel, { color: theme.textMuted }]}>Get Started</Text>
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.loginBtn, { backgroundColor: theme.primary }]}
                onPress={() => router.push('/(auth)/login')}
                accessibilityRole="button"
              >
                <Text style={styles.loginBtnText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  styles.registerBtn,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
                onPress={() => router.push('/(auth)/register')}
                accessibilityRole="button"
              >
                <Text style={[styles.registerBtnText, { color: theme.text }]}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Feature Highlights Section */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionHeading, { color: theme.text }]}>Feature Highlights</Text>

          <View style={styles.featuresGrid}>
            {/* Card 1 */}
            <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.featureIconCircle, { backgroundColor: theme.primaryLight }]}>
                <Feather name="user" size={20} color={theme.primary} />
              </View>
              <Text style={[styles.featureTitle, { color: theme.text }]}>Manage Profile</Text>
              <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
                Comprehensive academic records, department credentials & settings.
              </Text>
            </View>

            {/* Card 2 */}
            <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.featureIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="trophy-outline" size={20} color="#B45309" />
              </View>
              <Text style={[styles.featureTitle, { color: theme.text }]}>View Rankings</Text>
              <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
                Live class scoreboard with real-time points tracking and tie-breaking.
              </Text>
            </View>

            {/* Card 3 */}
            <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.featureIconCircle, { backgroundColor: theme.accentLight }]}>
                <Ionicons name="star-outline" size={20} color={theme.accent} />
              </View>
              <Text style={[styles.featureTitle, { color: theme.text }]}>Point Allocation</Text>
              <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
                Faculty point distribution with reasons, category chips & audit logs.
              </Text>
            </View>

            {/* Card 4 */}
            <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.featureIconCircle, { backgroundColor: '#EFF6FF' }]}>
                <Feather name="trending-up" size={20} color="#2563EB" />
              </View>
              <Text style={[styles.featureTitle, { color: theme.text }]}>Growth Analytics</Text>
              <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
                Class percentile distribution, departmental filtering & audit trail.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  topNav: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navLogoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
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
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeHeading: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 16,
  },
  appLogoBox: {
    width: 90,
    height: 90,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appLogoText: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  welcomeSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    maxWidth: 420,
  },
  getStartedBlock: {
    width: '100%',
    alignItems: 'center',
  },
  getStartedLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    maxWidth: 360,
  },
  actionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  loginBtn: {},
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  registerBtn: {
    borderWidth: 1,
  },
  registerBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
    marginLeft: 4,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    minWidth: 160,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  featureIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
});
