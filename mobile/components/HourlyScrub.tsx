import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontFamily, Spacing } from '../constants/theme';

interface HourItem {
  hourLabel: string;
  aqi: number;
  dominantSourceCode: string; // 'STU' | 'TRA' | 'DUS' | 'IND'
  sourceColor?: string;
}

interface HourlyScrubProps {
  timeline: HourItem[];
  selectedHour?: number;
  onSelectHour?: (index: number) => void;
}

/**
 * HourlyScrub — Horizontal Monospace Timeline Scrub
 * Mirrors the hourly weather forecast strip in reference images 2 and 3.
 */
export default function HourlyScrub({
  timeline,
  selectedHour = 0,
  onSelectHour,
}: HourlyScrubProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>HOURLY ATTRIBUTION PROJECTION</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {timeline.map((item, idx) => {
          const isSelected = selectedHour === idx;
          return (
            <TouchableOpacity
              key={`${item.hourLabel}-${idx}`}
              onPress={() => onSelectHour?.(idx)}
              activeOpacity={0.7}
              style={[
                styles.item,
                isSelected && styles.itemSelected,
              ]}
            >
              <Text style={[styles.hourText, isSelected && styles.textSelected]}>
                {item.hourLabel}
              </Text>
              <Text style={[styles.sourceBadge, { color: item.sourceColor || Colors.textSecondary }]}>
                {`[${item.dominantSourceCode}]`}
              </Text>
              <Text style={[styles.aqiText, isSelected && styles.textSelected]}>
                {item.aqi}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  sectionHeader: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  item: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 64,
  },
  itemSelected: {
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.bgSubtle,
  },
  hourText: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  sourceBadge: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginVertical: 2,
  },
  aqiText: {
    fontFamily: FontFamily.mono,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  textSelected: {
    color: Colors.black,
  },
});
