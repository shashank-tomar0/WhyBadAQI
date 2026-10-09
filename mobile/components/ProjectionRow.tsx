import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, Spacing } from '../constants/theme';

interface ProjectionRowProps {
  dayLabel: string;
  sourceTag: string; // '[STUBBLE]'
  sourceColor?: string;
  minAqi: number;
  maxAqi: number;
  globalMax?: number; // default 500
}

/**
 * ProjectionRow — Multi-day / 7-day range row with ASCII bar gauge.
 * Replicates the multi-day forecast table in reference images 2 and 3.
 */
export default function ProjectionRow({
  dayLabel,
  sourceTag,
  sourceColor = Colors.textSecondary,
  minAqi,
  maxAqi,
  globalMax = 500,
}: ProjectionRowProps) {
  const minPercent = Math.max(0, Math.min(100, (minAqi / globalMax) * 100));
  const barWidthPercent = Math.max(10, Math.min(100 - minPercent, ((maxAqi - minAqi) / globalMax) * 100));

  return (
    <View style={styles.row}>
      <Text style={styles.dayLabel}>{dayLabel.toUpperCase()}</Text>
      <Text style={[styles.sourceTag, { color: sourceColor }]}>{sourceTag}</Text>
      
      <View style={styles.rangeContainer}>
        <Text style={styles.boundText}>{`L:${minAqi}`}</Text>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              {
                marginLeft: `${minPercent}%`,
                width: `${barWidthPercent}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.boundText}>{`H:${maxAqi}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 0.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  dayLabel: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Colors.textPrimary,
    width: 60,
  },
  sourceTag: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    width: 90,
  },
  rangeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  boundText: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: Colors.textMuted,
    width: 38,
  },
  barTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 0,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.black,
  },
});
