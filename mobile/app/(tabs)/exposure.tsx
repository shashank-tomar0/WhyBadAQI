import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api, ExposureScoreData } from '../../services/api';
import { Colors, FontFamily, Spacing } from '../../constants/theme';
import AsciiButton from '../../components/AsciiButton';
import MetricTile from '../../components/MetricTile';
import ProjectionRow from '../../components/ProjectionRow';

export default function ExposureScoreScreen() {
  const router = useRouter();
  const [data, setData] = useState<ExposureScoreData | null>(null);

  useEffect(() => {
    loadExposure();
  }, []);

  const loadExposure = async () => {
    try {
      const res = await api.getExposureScore();
      setData(res);
    } catch (e) {
      console.warn('Error loading exposure score:', e);
    }
  };

  const score = Math.round(data?.daily_exposure_score ?? 78);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.screenTag}>INHALATION DOSE TRACKER</Text>
          <Text style={styles.wardStatus}>{`[${data?.ward?.toUpperCase() || 'WARD 45'}]`}</Text>
        </View>
        <Text style={styles.title}>MY EXPOSURE SCORE</Text>
        <Text style={styles.subTitle}>
          • HYPERLOCAL DOSIMETRY & PROTECTIVE CHOICES
        </Text>
      </View>

      {/* Hero Score Readout */}
      <View style={styles.heroScoreCard}>
        <View style={styles.scoreNumberRow}>
          <Text style={styles.scoreNumber}>{score}</Text>
          <Text style={styles.scoreUnit}>/100</Text>
        </View>
        <Text style={styles.scoreLabel}>
          {`• STATUS: ${data?.score_label?.toUpperCase() || 'MODERATE CONTROL'}`}
        </Text>
        <Text style={styles.streakNotice}>
          {`STREAK: ${data?.streak_days ?? 4} CONSECUTIVE DAYS OF LOW-EXPOSURE CHOICES`}
        </Text>
      </View>

      {/* Commute Route Comparison Callout */}
      <View style={styles.routeBox}>
        <Text style={styles.routeHeader}>[COMMUTE ROUTE COMPARISON]</Text>
        <Text style={styles.routeDetail}>
          {data?.commute_comparison?.headline || 'YOUR COMMUTE EXPOSURE IS +18% HIGHER THAN CLEANEST ALTERNATIVE VIA INNER RING RD.'}
        </Text>
      </View>

      {/* High-Density Metrics Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>DOSIMETRY METRICS</Text>
      </View>

      <View style={styles.metricGrid}>
        <View style={styles.metricRow}>
          <MetricTile
            label="ACTIVE STREAK"
            value={`${data?.streak_days ?? 4} DAYS`}
            subValue="CONSECUTIVE DAYS"
            accentColor={Colors.sourceStubble}
          />
          <MetricTile
            label="ROUTE DELTA"
            value={`+${data?.commute_comparison?.cleanest_route?.reduction || '18%'}`}
            subValue="HIGHWAY VS CLEAN ROUTE"
          />
        </View>

        <View style={styles.metricRow}>
          <MetricTile
            label="CUMULATIVE DOSE"
            value="42 µG/M³"
            subValue="INHALED ESTIMATE"
          />
          <MetricTile
            label="WARD RANK"
            value="#14 / 240"
            subValue="TOP 6% IN WARD"
          />
        </View>
      </View>

      {/* Weekly Inhalation History */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>7-DAY EXPOSURE HISTORY</Text>
      </View>

      <View style={styles.historyTable}>
        {(data?.weekly_history || [
          { day: 'MON', score: 85 },
          { day: 'TUE', score: 72 },
          { day: 'WED', score: 64 },
          { day: 'THU', score: 78 },
          { day: 'FRI', score: 82 },
          { day: 'SAT', score: 90 },
          { day: 'SUN', score: 78 },
        ]).map((item, idx) => (
          <ProjectionRow
            key={idx}
            dayLabel={item.day}
            sourceTag={`[${item.score >= 80 ? 'CLEAN' : item.score >= 60 ? 'MODERATE' : 'POOR'}]`}
            sourceColor={item.score >= 80 ? Colors.healthGood : item.score >= 60 ? Colors.healthModerate : Colors.healthPoor}
            minAqi={100 - item.score}
            maxAqi={100}
            globalMax={100}
          />
        ))}
      </View>

      {/* Badge Gallery */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>ACHIEVEMENT BADGES</Text>
      </View>

      <View style={styles.badgesContainer}>
        {(data?.badges || [
          { id: '1', title: 'Route Optimizer', unlocked: true, icon: 'navigation' },
          { id: '2', title: 'Clean Air Champ', unlocked: true, icon: 'shield-check' },
          { id: '3', title: 'Early Warner', unlocked: false, icon: 'bell' },
        ]).map((b) => (
          <View key={b.id} style={styles.badgeRow}>
            <Text style={[styles.badgeTag, { color: b.unlocked ? Colors.black : Colors.textMuted }]}>
              {`[${b.icon?.toUpperCase() || 'BADGE'}]`}
            </Text>
            <View style={styles.badgeInfo}>
              <Text style={[styles.badgeTitle, !b.unlocked && styles.badgeLocked]}>
                {b.title.toUpperCase()}
              </Text>
              <Text style={styles.badgeStatus}>
                {b.unlocked ? '[UNLOCKED]' : '[IN PROGRESS]'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Share Button */}
      <View style={styles.footerAction}>
        <AsciiButton
          label="GENERATE SHAREABLE SCORE CARD"
          prefix=">"
          variant="primary"
          onPress={() => router.push('/share-card')}
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  screenTag: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textMuted,
  },
  wardStatus: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.textSecondary,
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
  heroScoreCard: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  scoreNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontFamily: FontFamily.mono,
    fontSize: 78,
    fontWeight: '900',
    lineHeight: 80,
    letterSpacing: -3,
    color: Colors.textPrimary,
  },
  scoreUnit: {
    fontFamily: FontFamily.mono,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textMuted,
    marginLeft: 6,
  },
  scoreLabel: {
    fontFamily: FontFamily.mono,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  streakNotice: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  routeBox: {
    padding: Spacing.lg,
    backgroundColor: Colors.bgSubtle,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  routeHeader: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  routeDetail: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    lineHeight: 18,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  routeHighlight: {
    fontWeight: '800',
    color: Colors.brandAccent,
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
  metricGrid: {
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  metricRow: {
    flexDirection: 'row',
  },
  historyTable: {
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  badgesContainer: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  badgeTag: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '800',
    width: 100,
  },
  badgeInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeTitle: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textPrimary,
  },
  badgeLocked: {
    color: Colors.textMuted,
  },
  badgeStatus: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: Colors.textMuted,
  },
  footerAction: {
    padding: Spacing.lg,
    backgroundColor: Colors.bg,
  },
});
