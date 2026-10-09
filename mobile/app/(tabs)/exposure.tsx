import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { api, ExposureScoreData } from '../../services/api';
import { useRouter } from 'expo-router';
import { Award, Flame, Navigation, ShieldCheck, Bell, ArrowRight, Share2, TrendingUp, CheckCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

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

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  const renderBadgeIcon = (iconName: string, unlocked: boolean) => {
    const color = unlocked ? '#38BDF8' : '#64748B';
    switch (iconName) {
      case 'award': return <Award size={22} color={color} />;
      case 'navigation': return <Navigation size={22} color={color} />;
      case 'bell': return <Bell size={22} color={color} />;
      case 'shield-check': return <ShieldCheck size={22} color={color} />;
      default: return <Award size={22} color={color} />;
    }
  };

  const score = data?.daily_exposure_score ?? 78.5;
  const scoreColor = getScoreColor(score);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.wardTag}>{data?.ward || 'Ward 45 (Central)'}</Text>
          <TouchableOpacity style={styles.shareBtn} onPress={() => router.push('/share-card')}>
            <Share2 size={16} color="#38BDF8" style={{ marginRight: 6 }} />
            <Text style={styles.shareBtnText}>Share Score</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>My Exposure Score</Text>
        <Text style={styles.subtitle}>Fitness-tracked inhaled dose & protective choices</Text>
      </View>

      {/* Fitness-style Circular Gauge Card */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreGaugeCircle}>
          <View style={[styles.outerGlowRing, { borderColor: scoreColor }]} />
          <View style={styles.scoreInnerContent}>
            <Text style={[styles.scoreNumber, { color: scoreColor }]}>{Math.round(score)}</Text>
            <Text style={styles.scoreTotal}>/ 100</Text>
            <Text style={styles.scoreBadgeText}>{data?.score_label || 'Good Control'}</Text>
          </View>
        </View>

        <View style={styles.streakBanner}>
          <Flame size={20} color="#FF6B35" style={{ marginRight: 8 }} />
          <Text style={styles.streakText}>
            <Text style={styles.streakHighlight}>{data?.streak_days ?? 4} DAYS</Text> consecutive clean-air choices!
          </Text>
        </View>
      </View>

      {/* Commute Route Comparison Feature */}
      <View style={styles.routeCard}>
        <View style={styles.routeHeader}>
          <Navigation size={18} color="#38BDF8" style={{ marginRight: 8 }} />
          <Text style={styles.routeTitle}>HYPERLOCAL ROUTE COMPARISON</Text>
        </View>
        <Text style={styles.routeHeadline}>
          {data?.commute_comparison.headline || 'Your commute = 18% more PM2.5 than cleanest route'}
        </Text>

        <View style={styles.routeOptionsRow}>
          {/* Default Route */}
          <View style={styles.routeBox}>
            <Text style={styles.routeTypeLabel}>YOUR CURRENT ROUTE</Text>
            <Text style={styles.routeName}>Highway / Ring Road</Text>
            <Text style={styles.routeDoseRed}>84 µg/m³ inhaled</Text>
            <Text style={styles.routeDuration}>34 mins transit</Text>
          </View>

          {/* Cleanest Recommended Route */}
          <View style={[styles.routeBox, styles.routeBoxClean]}>
            <View style={styles.cleanPill}>
              <Text style={styles.cleanPillText}>18% CLEANER</Text>
            </View>
            <Text style={styles.routeTypeLabelClean}>RECOMMENDED ROUTE</Text>
            <Text style={styles.routeName}>Green Belt Boulevard</Text>
            <Text style={styles.routeDoseGreen}>69 µg/m³ inhaled</Text>
            <Text style={styles.routeDuration}>38 mins (+4m)</Text>
          </View>
        </View>
      </View>

      {/* Weekly History Mini Bar Chart */}
      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <TrendingUp size={16} color="#38BDF8" style={{ marginRight: 8 }} />
          <Text style={styles.historyTitle}>7-DAY EXPOSURE TREND</Text>
        </View>

        <View style={styles.barsContainer}>
          {(data?.weekly_history || []).map((h, i) => (
            <View key={i} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${h.score}%`,
                      backgroundColor: getScoreColor(h.score),
                    },
                  ]}
                />
              </View>
              <Text style={styles.barDay}>{h.day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Clean Air Badges Gallery */}
      <View style={styles.badgeSection}>
        <Text style={styles.badgeSectionTitle}>CLEAN AIR BADGE GALLERY</Text>
        <View style={styles.badgesGrid}>
          {(data?.badges || []).map((b) => (
            <View key={b.id} style={[styles.badgeItem, !b.unlocked && styles.badgeItemLocked]}>
              <View style={[styles.badgeIconCircle, b.unlocked && styles.badgeIconCircleUnlocked]}>
                {renderBadgeIcon(b.icon, b.unlocked)}
              </View>
              <Text style={[styles.badgeItemTitle, !b.unlocked && { color: '#64748B' }]}>{b.title}</Text>
              <Text style={styles.badgeItemDesc}>{b.description}</Text>
              {b.unlocked && (
                <View style={styles.unlockedTag}>
                  <CheckCircle size={10} color="#10B981" style={{ marginRight: 4 }} />
                  <Text style={styles.unlockedText}>UNLOCKED</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090D16' },
  content: { padding: 18, paddingBottom: 40 },
  header: { marginBottom: 18, marginTop: 40 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  wardTag: { color: '#38BDF8', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  shareBtnText: { color: '#38BDF8', fontSize: 11, fontWeight: '700' },
  title: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
  scoreCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.7)',
    marginBottom: 16,
  },
  scoreGaugeCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 8,
  },
  outerGlowRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 8,
    opacity: 0.85,
  },
  scoreInnerContent: { alignItems: 'center' },
  scoreNumber: { fontSize: 48, fontWeight: '900', letterSpacing: -1 },
  scoreTotal: { fontSize: 14, color: '#64748B', fontWeight: '700' },
  scoreBadgeText: { fontSize: 11, fontWeight: '800', color: '#94A3B8', marginTop: 4, letterSpacing: 0.5 },
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
    marginTop: 14,
  },
  streakText: { color: '#F1F5F9', fontSize: 12 },
  streakHighlight: { color: '#FF6B35', fontWeight: '800' },
  routeCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.7)',
    marginBottom: 16,
  },
  routeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  routeTitle: { color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  routeHeadline: { color: '#F8FAFC', fontSize: 14, fontWeight: '700', marginBottom: 14 },
  routeOptionsRow: { flexDirection: 'row', gap: 10 },
  routeBox: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.4)',
  },
  routeBoxClean: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  cleanPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
  },
  cleanPillText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  routeTypeLabel: { color: '#94A3B8', fontSize: 9, fontWeight: '800' },
  routeTypeLabelClean: { color: '#10B981', fontSize: 9, fontWeight: '800' },
  routeName: { color: '#FFF', fontSize: 12, fontWeight: '700', marginTop: 2 },
  routeDoseRed: { color: '#EF4444', fontSize: 11, fontWeight: '700', marginTop: 4 },
  routeDoseGreen: { color: '#10B981', fontSize: 11, fontWeight: '700', marginTop: 4 },
  routeDuration: { color: '#64748B', fontSize: 10, marginTop: 2 },
  historyCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.7)',
    marginBottom: 16,
  },
  historyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  historyTitle: { color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  barsContainer: { flexDirection: 'row', justifyContent: 'space-between', height: 100, alignItems: 'flex-end', paddingTop: 10 },
  barColumn: { alignItems: 'center', width: 32 },
  barTrack: { height: 75, width: 14, backgroundColor: 'rgba(51, 65, 85, 0.4)', borderRadius: 7, justifyContent: 'flex-end' },
  barFill: { width: 14, borderRadius: 7 },
  barDay: { color: '#94A3B8', fontSize: 10, marginTop: 6, fontWeight: '600' },
  badgeSection: { marginTop: 6 },
  badgeSectionTitle: { color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 12 },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeItem: {
    width: (width - 46) / 2,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.7)',
  },
  badgeItemLocked: { opacity: 0.45 },
  badgeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(51, 65, 85, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeIconCircleUnlocked: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  badgeItemTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  badgeItemDesc: { color: '#94A3B8', fontSize: 10, marginTop: 4, lineHeight: 14 },
  unlockedTag: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  unlockedText: { color: '#10B981', fontSize: 9, fontWeight: '800' },
});
