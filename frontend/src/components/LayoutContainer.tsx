import React from 'react';
import { View, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

// Responsive wrapper providing adaptive desktop centering and fluid mobile sizing
export const LayoutContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useAppTheme();

  return (
    <SafeAreaView style={[styles.outerContainer, { backgroundColor: theme.background }]}>
      <View style={[styles.innerFrame, { backgroundColor: theme.card }]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    alignItems: 'center',
  },
  innerFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 860,
    minHeight: '100%',
    ...Platform.select({
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
    }),
  },
});
