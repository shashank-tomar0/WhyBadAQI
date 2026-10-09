import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontFamily, Spacing } from '../constants/theme';

interface MetricTileProps {
  label: string;
  value: string | number;
  subValue?: string;
  accentColor?: string;
  style?: ViewStyle;
}

/**
 * MetricTile — High-density 2-column tabular readout cell matching the
 * Dieter Rams / Nothing OS brutalist instrument grid in design.md.
 */
export default function MetricTile({
  label,
  value,
  subValue,
  accentColor,
  style,
}: MetricTileProps) {
  return (
    <View style={[styles.tile, style]}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Text
        style={[
          styles.value,
          accentColor ? { color: accentColor } : null,
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>
      {subValue ? (
        <Text style={styles.subValue} numberOfLines={1}>
          {subValue.toUpperCase()}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minHeight: 88,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.bg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  value: {
    fontFamily: FontFamily.mono,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Colors.textPrimary,
  },
  subValue: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
    color: Colors.textSecondary,
    marginTop: Spacing.xxs,
  },
});
