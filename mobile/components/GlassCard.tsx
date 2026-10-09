import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius } from '../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Use gradient border effect for featured cards */
  featured?: boolean;
  padding?: number;
}

/**
 * GlassCard — frosted glass card matching WhyBadAQI dark aesthetic.
 * Wraps children in a semi-transparent card with a subtle gradient border.
 */
export default function GlassCard({ children, style, featured = false, padding = 16 }: GlassCardProps) {
  if (featured) {
    return (
      <LinearGradient
        colors={['rgba(56,189,248,0.25)', 'rgba(56,189,248,0.06)', 'rgba(15,23,42,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, style]}
      >
        <View style={[styles.inner, { padding }]}>
          {children}
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, { padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  gradient: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderBrand,
    overflow: 'hidden',
  },
  inner: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg - 1,
  },
});
