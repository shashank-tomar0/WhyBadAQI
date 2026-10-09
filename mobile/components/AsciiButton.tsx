import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, FontFamily, Spacing } from '../constants/theme';

interface AsciiButtonProps {
  label: string;
  onPress: () => void;
  prefix?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * AsciiButton — Bracketed Brutalist Button matching Nothing OS / Teenage Engineering aesthetic.
 * Examples: `[+] ADD LOCATION`, `[>] VIEW ATTRIBUTION`, `[ENABLE]`, `[X]`
 */
export default function AsciiButton({
  label,
  onPress,
  prefix,
  variant = 'secondary',
  disabled = false,
  style,
  textStyle,
  size = 'md',
}: AsciiButtonProps) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  const fullText = prefix ? `[${prefix}] ${label.toUpperCase()}` : `[ ${label.toUpperCase()} ]`;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.65}
      style={[
        styles.base,
        isPrimary && styles.primary,
        isDanger && styles.danger,
        isGhost && styles.ghost,
        size === 'sm' && styles.sizeSm,
        size === 'lg' && styles.sizeLg,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          isPrimary && styles.textPrimary,
          isDanger && styles.textDanger,
          size === 'sm' && styles.textSm,
          textStyle,
        ]}
      >
        {fullText}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.white,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  danger: {
    borderColor: Colors.brandAccent,
    backgroundColor: '#FEF2F2',
  },
  ghost: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.xs,
  },
  sizeSm: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  sizeLg: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  disabled: {
    opacity: 0.35,
  },
  text: {
    fontFamily: FontFamily.mono,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Colors.textPrimary,
  },
  textPrimary: {
    color: Colors.textInverse,
  },
  textDanger: {
    color: Colors.brandAccent,
  },
  textSm: {
    fontSize: 10,
    letterSpacing: 0.8,
  },
});
