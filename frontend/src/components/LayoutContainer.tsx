import React from 'react';
import { View, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

// Mobile-responsive wrapper providing a clean centered app frame on web viewports
export const LayoutContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useAppTheme();

  return (
    <SafeAreaView style={[styles.outerContainer, { backgroundColor: theme.background }]}>
      <View style={[styles.innerFrame, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  innerFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        height: '100%',
        borderLeftWidth: 1,
        borderRightWidth: 1,
      },
      default: {
        height: '100%',
      },
    }),
  },
});
