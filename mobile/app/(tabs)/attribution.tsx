import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { api, LiveAttributionData } from '../../services/api';
import { Colors, FontFamily, Spacing, SourceConfig } from '../../constants/theme';
import AsciiButton from '../../components/AsciiButton';
import MetricTile from '../../components/MetricTile';
import ProjectionRow from '../../components/ProjectionRow';

export default function AttributionScreen() {
  const [data, setData] = useState<LiveAttributionData | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.getLiveAttribution(28.6139, 77.2090, 0);
      setData(res);
    } catch (e) {
      console.warn('Error loading attribution:', e);
    }
  };

  const breakdown = data?.attribution?.breakdown || {
    stubble: 54,
    traffic: 25,
    dust: 12,
    industry: 9,
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.screenTag}>SOURCE ATTRIBUTION ENGINE</Text>
        <Text style={styles.title}>WHY IS IT BAD?</Text>
        <Text style={styles.subTitle}>
          • STATION: WARD 45 (HYPERLOCAL STREET GRID)
        </Text>
      </View>

      {/* Primary Attribution Source Bars */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>REAL-TIME SOURCE APPORTIONMENT (%)</Text>
      </View>

      <View style={styles.sourcesContainer}>
        {(['stubble', 'traffic', 'dust', 'industry'] as const).map((key) => {
          const cfg = SourceConfig[key];
          const pct = breakdown[key] || 0;
          return (
            <View key={key} style={styles.sourceRow}>
              <View style={styles.sourceLabelCol}>
                <Text style={[styles.sourceTag, { color: cfg.color }]}>
                  {cfg.tag}
                </Text>
                <Text style={styles.sourceName}>{cfg.label}</Text>
              </View>

              <View style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${pct}%`, backgroundColor: cfg.color },
                    ]}
                  />
                </View>
                <Text style={styles.percentText}>{pct}%</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Atmospheric Met Conditions Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>ATMOSPHERIC & METEOROLOGICAL METRICS</Text>
      </View>

      <View style={styles.metricGrid}>
        <View style={styles.metricRow}>
          <MetricTile
            label="WIND VECTOR"
            value={`${data?.attribution?.wind?.speed_kmh || 14.5} KM/H`}
            subValue={`${data?.attribution?.wind?.direction_deg || 301}° ${data?.attribution?.wind?.cardinal || 'NW'}`}
          />
          <MetricTile
            label="BOUNDARY LAYER"
            value="620 M"
            subValue="THERMAL INVERSION"
          />
        </View>

        <View style={styles.metricRow}>
          <MetricTile
            label="DISPERSION TAU"
            value="4.8 HRS"
            subValue="GAUSSIAN DRIFT"
          />
          <MetricTile
            label="ACTIVE FIRES"
            value="32 HOTSPOTS"
            subValue="NASA FIRMS MODIS"
          />
        </View>
      </View>

      {/* Plain-Language Scientific Synthesis */}
      <View style={styles.narrativeCard}>
        <Text style={styles.narrativeTag}>[ATMOSPHERIC SYNTHESIS]</Text>
        <Text style={styles.narrativeBody}>
          {data?.attribution?.explanation ||
            'Smoke from 32 active Punjab/Haryana crop residue fire clusters is blowing south-east along a 301° NW wind corridor. Shallow planetary boundary layer height (620m) traps vehicular exhaust and biomass aerosols in the lower troposphere, driving 54% of current PM2.5 concentrations.'}
        </Text>
      </View>

      {/* 24-Hour Diurnal Projection */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>24-HOUR SOURCE SHIFT PROJECTION</Text>
      </View>

      <View style={styles.projectionTable}>
        {(data?.forecast_24h || []).slice(0, 6).map((fc, i) => (
          <ProjectionRow
            key={i}
            dayLabel={i === 0 ? 'NOW' : `+${fc.hour_offset}H`}
            sourceTag={`[STU]`}
            sourceColor={SourceConfig.stubble.color}
            minAqi={Math.max(40, fc.aqi - 35)}
            maxAqi={fc.aqi + 40}
          />
        ))}
      </View>

      {/* Refresh / Export Button */}
      <View style={styles.footerAction}>
        <AsciiButton
          label="DOWNLOAD EVIDENCE PACK (CSV/PDF)"
          prefix=">"
          variant="primary"
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  screenTag: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  title: {
    fontFamily: FontFamily.mono,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: Colors.textPrimary,
  },
  subTitle: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.bgSubtle,
    borderBottomWidth: 0.5,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.textMuted,
  },
  sourcesContainer: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  sourceLabelCol: {
    width: 130,
  },
  sourceTag: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sourceName: {
    fontFamily: FontFamily.mono,
    fontSize: 8,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  barCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.borderLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  barFill: {
    height: '100%',
  },
  percentText: {
    fontFamily: FontFamily.mono,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Colors.textPrimary,
    width: 38,
    textAlign: 'right',
  },
  metricGrid: {
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  metricRow: {
    flexDirection: 'row',
  },
  narrativeCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.bg,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  narrativeTag: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.brandAccent,
    marginBottom: Spacing.xs,
  },
  narrativeBody: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    lineHeight: 18,
    color: Colors.textSecondary,
    letterSpacing: 0.4,
  },
  projectionTable: {
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  footerAction: {
    padding: Spacing.lg,
    backgroundColor: Colors.bg,
  },
});
