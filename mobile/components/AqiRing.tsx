import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

interface AqiRingProps {
  /** 0-100 personal exposure score */
  score: number;
  /** Override ring colour (defaults to auto-grade colour) */
  color?: string;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

/**
 * AqiRing — animated SVG-free arc ring gauge drawn using border-radius trick.
 * Shows a 0-100 score with animated fill that goes from grey to grade colour.
 * (React Native does not have SVG natively without react-native-svg, so we use
 * a layered View approach that works on all platforms without extra deps.)
 */
export default function AqiRing({ score, color, size = 160, strokeWidth = 14, label }: AqiRingProps) {
  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animVal, {
      toValue: score,
      useNativeDriver: false,
      tension: 50,
      friction: 8,
    }).start();
  }, [score]);

  const gradeColor = color || gradeColour(score);

  // We derive an approximate arc by rotating a half-circle mask
  // Angle: 0% = -90°, 100% = 270°  (full sweep = 360°)
  const rotDeg = animVal.interpolate({
    inputRange: [0, 100],
    outputRange: ['-90deg', '270deg'],
  });

  const half = size / 2;
  const inner = size - strokeWidth * 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background track */}
      <View style={[styles.ring, {
        width: size, height: size, borderRadius: half,
        borderWidth: strokeWidth, borderColor: 'rgba(51,65,85,0.6)',
      }]} />

      {/* Animated fill ring — CSS trick: clip left half, rotate */}
      <Animated.View style={[styles.halfMask, {
        width: size, height: size, borderRadius: half,
        borderWidth: strokeWidth, borderColor: gradeColor,
        transform: [{ rotate: rotDeg }],
        opacity: score > 0 ? 1 : 0,
      }]} />

      {/* Centre content */}
      <View style={[styles.centre, { width: inner, height: inner, borderRadius: inner / 2 }]}>
        <Text style={[styles.scoreText, { color: gradeColor, fontSize: size * 0.22 }]}>
          {score}
        </Text>
        <Text style={styles.outOf}>/100</Text>
        {label ? <Text style={styles.labelText}>{label}</Text> : null}
      </View>
    </View>
  );
}

function gradeColour(score: number) {
  if (score <= 25) return Colors.healthGood;
  if (score <= 50) return Colors.healthModerate;
  if (score <= 75) return Colors.healthPoor;
  return Colors.healthVeryPoor;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
  },
  halfMask: {
    position: 'absolute',
  },
  centre: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgBase,
  },
  scoreText: {
    fontWeight: '800',
    letterSpacing: -1,
  },
  outOf: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
    marginTop: -2,
  },
  labelText: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
});
