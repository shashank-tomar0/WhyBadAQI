// WhyBadAQI — Brutalist Monospace Precision Instrument System
// Inspired by Nothing OS, Teenage Engineering, and Dieter Rams / Braun instruments.
import { Platform } from 'react-native';

export const FontFamily = {
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'Courier, monospace',
  }),
};

export const Colors = {
  // Primary Monochromatic Canvas (Clean Paper White)
  bg: '#FFFFFF',
  bgSubtle: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceAlt: '#F3F4F6',
  
  // Borders & Dividers (1px Hairlines)
  border: '#E5E7EB',
  borderStrong: '#111827',
  borderLight: '#F3F4F6',

  // Typography
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  // High-Contrast Accent & Actions
  black: '#000000',
  white: '#FFFFFF',
  brand: '#111827',
  brandAccent: '#DC2626', // Sharp alert red

  // Atmospheric Source Apportionment Indicators
  sourceStubble: '#EA580C',   // Orange
  sourceTraffic: '#2563EB',   // Cobalt Blue
  sourceDust: '#D97706',      // Earthy Amber
  sourceIndustry: '#7C3AED',  // Royal Violet

  // Health Grades
  healthGood: '#16A34A',
  healthModerate: '#CA8A04',
  healthPoor: '#EA580C',
  healthVeryPoor: '#DC2626',
  healthSevere: '#9333EA',
  healthHazardous: '#7F1D1D',

  // Dark Canvas Alternative Tokens
  dark: {
    bg: '#000000',
    surface: '#0A0A0A',
    border: '#262626',
    borderStrong: '#FAFAFA',
    textPrimary: '#FFFFFF',
    textSecondary: '#A3A3A3',
    textMuted: '#525252',
  },

  // Backward-compatible aliases for existing components
  bgDeep: '#000000',
  bgBase: '#FFFFFF',
  bgCard: '#FFFFFF',
  bgCardLight: '#F9FAFB',
  borderSubtle: '#E5E7EB',
  borderBrand: '#111827',
};

export const Radius = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
  full: 9999,
};

export const SourceConfig = {
  stubble: {
    label: 'STUBBLE BURNING',
    tag: '[STUBBLE]',
    color: Colors.sourceStubble,
    icon: 'flame',
    description: 'PUNJAB/HARYANA BIOMASS SMOKE INFLOW ON NW WINDS',
  },
  traffic: {
    label: 'VEHICULAR EXHAUST',
    tag: '[TRAFFIC]',
    color: Colors.sourceTraffic,
    icon: 'car',
    description: 'ARTERIAL HIGHWAY DIESEL & PETROL FLEET EMISSIONS',
  },
  dust: {
    label: 'CONSTRUCTION DUST',
    tag: '[DUST]',
    color: Colors.sourceDust,
    icon: 'wind',
    description: 'CIVIL WORKS SUSPENDED PARTICULATES & ROAD SILT',
  },
  industry: {
    label: 'INDUSTRIAL STACKS',
    tag: '[INDUSTRY]',
    color: Colors.sourceIndustry,
    icon: 'factory',
    description: 'REGIONAL FACTORY PLUMES & BOILER EMISSIONS',
  },
};

export const AqiGrade = (aqi: number) => {
  if (aqi <= 50)  return { label: 'GOOD',        tag: '[GOOD]',        color: Colors.healthGood,       level: 'SAFE' };
  if (aqi <= 100) return { label: 'MODERATE',    tag: '[MODERATE]',    color: Colors.healthModerate,   level: 'ACCEPTABLE' };
  if (aqi <= 200) return { label: 'POOR',        tag: '[POOR]',        color: Colors.healthPoor,       level: 'UNHEALTHY' };
  if (aqi <= 300) return { label: 'VERY POOR',   tag: '[VERY POOR]',   color: Colors.healthVeryPoor,   level: 'DANGEROUS' };
  if (aqi <= 400) return { label: 'SEVERE',      tag: '[SEVERE]',      color: Colors.healthSevere,     level: 'HAZARDOUS' };
  return           { label: 'HAZARDOUS',   tag: '[HAZARDOUS]',   color: Colors.healthHazardous,  level: 'EMERGENCY' };
};

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};
