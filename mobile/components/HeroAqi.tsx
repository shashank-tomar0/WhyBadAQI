import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, Spacing, AqiGrade } from '../constants/theme';

interface HeroAqiProps {
  aqi: number;
  locationName: string;
  timeString?: string;
  primarySourceLabel: string;
  primaryPercentage: number;
  minAqi?: number;
  maxAqi?: number;
}

/**
 * HeroAqi — Bold Brutalist Monospace Digital Readout.
 * Exactly mirrors the hero display in the reference images (Images 2 & 3).
 */
export default function HeroAqi({
  aqi,
  locationName,
  timeString = '8:30 PM',
  primarySourceLabel,
  primaryPercentage,
  minAqi = Math.max(20, aqi - 45),
  maxAqi = aqi + 65,
}: HeroAqiProps) {
  const grade = AqiGrade(aqi);

  return (
    <View style={styles.container}>
      {/* Location & Time Header */}
      <View style={styles.headerRow}>
        <Text style={styles.locationText}>
          {`• ${locationName.toUpperCase()}`}
        </Text>
        <Text style={styles.timeText}>{timeString}</Text>
      </View>

      {/* Massive Tabular AQI Number */}
      <View style={styles.numberRow}>
        <Text style={styles.heroNumber}>{aqi}</Text>
        <Text style={styles.unitText}>AQI</Text>
      </View>

      {/* Condition / Source Apportionment Status */}
      <View style={styles.statusRow}>
        <Text style={[styles.statusText, { color: grade.color }]}>
          {`• ${grade.label} ${grade.tag}`}
        </Text>
        <Text style={styles.sourceText}>
          {`DOMINANT: ${primarySourceLabel} (${primaryPercentage}%)`}
        </Text>
      </View>

      {/* Range Bar Info */}
      <View style={styles.rangeRow}>
        <Text style={styles.rangeItem}>{`L:${minAqi}`}</Text>
        <Text style={styles.rangeItem}>{`H:${maxAqi}`}</Text>
        <Text style={styles.rangeItem}>{`EXPOSURE: ${grade.level}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.bg,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  locationText: {
    fontFamily: FontFamily.mono,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.textPrimary,
  },
  timeText: {
    fontFamily: FontFamily.mono,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    color: Colors.textMuted,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: Spacing.xs,
  },
  heroNumber: {
    fontFamily: FontFamily.mono,
    fontSize: 84,
    fontWeight: '900',
    lineHeight: 88,
    letterSpacing: -4,
    color: Colors.textPrimary,
  },
  unitText: {
    fontFamily: FontFamily.mono,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    marginTop: 14,
    marginLeft: 6,
  },
  statusRow: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  statusText: {
    fontFamily: FontFamily.mono,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  sourceText: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Colors.textSecondary,
  },
  rangeRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    paddingTop: Spacing.sm,
    borderTopWidth: 0.5,
    borderColor: Colors.border,
  },
  rangeItem: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: Colors.textMuted,
  },
});
