// WhyBadAQI — Design Token System
// Dark-mode first, atmospheric palette

export const Colors = {
  // Brand core
  brand: '#38BDF8',         // sky-400 — primary CTA, active states
  brandDim: '#0284C7',      // sky-600 — pressed states, buttons

  // Backgrounds
  bgDeep: '#020617',        // near-black canvas
  bgBase: '#090D16',        // main screen background
  bgCard: 'rgba(15, 23, 42, 0.92)',   // frosted glass card
  bgCardLight: 'rgba(30, 41, 59, 0.75)', // slightly lighter card

  // Surface borders
  borderSubtle: 'rgba(51, 65, 85, 0.7)',
  borderBrand: 'rgba(56, 189, 248, 0.35)',

  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  textDisabled: '#64748B',

  // Semantic — Health grades
  healthGood: '#10B981',       // AQI ≤ 50  (Green)
  healthModerate: '#F59E0B',   // AQI ≤ 100 (Amber)
  healthPoor: '#F97316',       // AQI ≤ 200 (Orange)
  healthVeryPoor: '#EF4444',   // AQI ≤ 300 (Red)
  healthSevere: '#C026D3',     // AQI ≤ 400 (Purple)
  healthHazardous: '#991B1B',  // AQI > 400  (Maroon)

  // Source type colours (consistent across map, donut, legend)
  sourceStubble: '#FF6B35',    // Agricultural fire smoke — orange
  sourceTraffic: '#0077B6',    // Vehicular exhaust — blue
  sourceDust: '#D4A373',       // Construction/road dust — sandy brown
  sourceIndustry: '#7209B7',   // Factory emissions — purple

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#38BDF8',

  // Misc
  streak: '#FF6B35',
  whatsapp: '#25D366',
};

export const SourceConfig = {
  stubble: {
    label: 'Stubble Burning',
    color: Colors.sourceStubble,
    icon: 'flame',
    description: 'Agricultural field fire smoke plumes from upwind crop residue burning',
  },
  traffic: {
    label: 'Vehicular Exhaust',
    color: Colors.sourceTraffic,
    icon: 'car',
    description: 'Road traffic diesel & petrol exhaust on arterial corridors',
  },
  dust: {
    label: 'Construction Dust',
    color: Colors.sourceDust,
    icon: 'wind',
    description: 'Suspended particulates from construction sites and road surfaces',
  },
  industry: {
    label: 'Industrial Emissions',
    color: Colors.sourceIndustry,
    icon: 'factory',
    description: 'Continuous stack emissions from manufacturing clusters',
  },
};

export const AqiGrade = (aqi: number) => {
  if (aqi <= 50)  return { label: 'Good',        color: Colors.healthGood,       emoji: '🟢' };
  if (aqi <= 100) return { label: 'Moderate',    color: Colors.healthModerate,   emoji: '🟡' };
  if (aqi <= 200) return { label: 'Poor',        color: Colors.healthPoor,       emoji: '🟠' };
  if (aqi <= 300) return { label: 'Very Poor',   color: Colors.healthVeryPoor,   emoji: '🔴' };
  if (aqi <= 400) return { label: 'Severe',      color: Colors.healthSevere,     emoji: '🟣' };
  return           { label: 'Hazardous',          color: Colors.healthHazardous,  emoji: '⚫' };
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};
