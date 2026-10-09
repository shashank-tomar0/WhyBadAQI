import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../constants/theme';
import { SourceConfig } from '../constants/theme';

interface SourceBadgeProps {
  source: 'stubble' | 'traffic' | 'dust' | 'industry';
  percentage: number;
  showPercent?: boolean;
  size?: 'sm' | 'md';
}

/**
 * SourceBadge — compact coloured chip showing a pollution source + percentage.
 * Used in maps, attribution cards, and timeline entries.
 */
export default function SourceBadge({ source, percentage, showPercent = true, size = 'md' }: SourceBadgeProps) {
  const config = SourceConfig[source];
  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: config.color + '28', borderColor: config.color + '70' }, isSmall && styles.badgeSm]}>
      <View style={[styles.dot, { backgroundColor: config.color }, isSmall && styles.dotSm]} />
      <Text style={[styles.label, { color: config.color }, isSmall && styles.labelSm]}>
        {config.label}{showPercent ? ` ${percentage}%` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 1,
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  badgeSm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: Radius.full,
  },
  dotSm: {
    width: 5,
    height: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  labelSm: {
    fontSize: 10,
  },
});
