import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { G, Circle, Path } from 'react-native-svg';
import { api, LiveAttributionData } from '../../services/api';
import { Wind, Compass, Flame, Car, Factory, AlertCircle, ArrowRight, Clock, Sparkles } from 'lucide-react-native';

const { width } = Dimensions.get('window');

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

  const breakdown = data?.attribution.breakdown || {
    stubble: 54.2,
    traffic: 24.8,
    dust: 12.1,
    industry: 8.9,
  };

  // Donut chart stroke circumference math
  const radius = 64;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  const stubbleStroke = (breakdown.stubble / 100) * circumference;
  const trafficStroke = (breakdown.traffic / 100) * circumference;
  const dustStroke = (breakdown.dust / 100) * circumference;
  const industryStroke = (breakdown.industry / 100) * circumference;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Screen Title & Location */}
      <View style={styles.header}>
        <View style={styles.badgePill}>
          <Sparkles size={12} color="#38BDF8" style={{ marginRight: 6 }} />
          <Text style={styles.badgeText}>REAL-TIME ATTRIBUTION ENGINE</Text>
        </View>
        <Text style={styles.title}>Why Is It Bad?</Text>
        <Text style={styles.subtitle}>
          Hyperlocal PM2.5 dissection for <Text style={{ color: '#38BDF8', fontWeight: '700' }}>Ward 45 (Your Street)</Text>
        </Text>
      </View>

      {/* Donut Chart Breakdown Card */}
      <View style={styles.chartCard}>
        <Text style={styles.cardHeader}>SOURCE CONTRIBUTIONS (%)</Text>

        <View style={styles.donutRow}>
          {/* Custom SVG Donut Chart */}
          <View style={styles.donutWrapper}>
            <Svg width={160} height={160} viewBox="0 0 160 160">
              <G rotation="-90" origin="80, 80">
                {/* Stubble Arc */}
                <Circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#FF6B35"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${stubbleStroke} ${circumference}`}
                  strokeDashoffset={0}
                  fill="transparent"
                />
                {/* Traffic Arc */}
                <Circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#0077B6"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${trafficStroke} ${circumference}`}
                  strokeDashoffset={-stubbleStroke}
                  fill="transparent"
                />
                {/* Dust Arc */}
                <Circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#D4A373"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dustStroke} ${circumference}`}
                  strokeDashoffset={-(stubbleStroke + trafficStroke)}
                  fill="transparent"
                />
                {/* Industry Arc */}
                <Circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#7209B7"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${industryStroke} ${circumference}`}
                  strokeDashoffset={-(stubbleStroke + trafficStroke + dustStroke)}
                  fill="transparent"
                />
              </G>
            </Svg>
            <View style={styles.donutCenterLabel}>
              <Text style={styles.donutCenterValue}>{data?.aqi || 312}</Text>
              <Text style={styles.donutCenterSub}>AQI</Text>
            </View>
          </View>

          {/* Legend Table */}
          <View style={styles.legendCol}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF6B35' }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.legendName}>Stubble Smoke</Text>
                <Text style={styles.legendShare}>{breakdown.stubble}% share</Text>
              </View>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#0077B6' }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.legendName}>Vehicular Exhaust</Text>
                <Text style={styles.legendShare}>{breakdown.traffic}% share</Text>
              </View>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#D4A373' }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.legendName}>Construction Dust</Text>
                <Text style={styles.legendShare}>{breakdown.dust}% share</Text>
              </View>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#7209B7' }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.legendName}>Factory Emissions</Text>
                <Text style={styles.legendShare}>{breakdown.industry}% share</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Atmospheric Wind-Vector Transport Compass */}
      <View style={styles.windCard}>
        <View style={styles.windHeader}>
          <Compass size={20} color="#38BDF8" style={{ marginRight: 8 }} />
          <Text style={styles.windTitle}>ATMOSPHERIC WIND DISPERSION VECTOR</Text>
        </View>

        <View style={styles.windContentRow}>
          <View style={styles.windCompassGraphic}>
            <View style={styles.compassCircle}>
              {/* Compass Needle pointing NW (typical stubble trajectory) */}
              <View style={styles.needlePointer} />
              <Text style={styles.compassLabelN}>N</Text>
              <Text style={styles.compassLabelW}>W</Text>
              <Text style={styles.compassLabelE}>E</Text>
              <Text style={styles.compassLabelS}>S</Text>
            </View>
          </View>

          <View style={styles.windMetrics}>
            <Text style={styles.windTrajectory}>Flowing from North-West (315°)</Text>
            <Text style={styles.windSpeed}>Velocity: 14.5 km/h</Text>
            <Text style={styles.windEffect}>
              Strong NW advection carries agricultural fire plumes across 180 km directly into Delhi-NCR basin.
            </Text>
          </View>
        </View>
      </View>

      {/* Plain Language Explanation Card */}
      <View style={styles.explainCard}>
        <View style={styles.explainHeader}>
          <AlertCircle size={18} color="#FF6B35" style={{ marginRight: 8 }} />
          <Text style={styles.explainTitle}>PLAIN-LANGUAGE SUMMARY</Text>
        </View>
        <Text style={styles.explainBody}>
          {data?.attribution.explanation ||
            'Smoke from Haryana and Punjab farm fires is blowing in on steady NW winds (14.5 km/h), accounting for 54.2% of your local PM2.5. Evening commuter congestion along the arterial corridor traps another 24.8% of micro-particles.'}
        </Text>
      </View>

      {/* "What Changed?" Mini-Timeline */}
      <View style={styles.timelineCard}>
        <View style={styles.timelineHeader}>
          <Clock size={18} color="#38BDF8" style={{ marginRight: 8 }} />
          <Text style={styles.timelineTitle}>WHAT CHANGED TODAY?</Text>
        </View>

        {data?.attribution.timeline.map((item, idx) => (
          <View key={idx} style={styles.timelineItem}>
            <View style={styles.timeBulletContainer}>
              <View style={[styles.timeBullet, idx === 2 && styles.timeBulletActive]} />
              {idx !== data.attribution.timeline.length - 1 && <View style={styles.timeLine} />}
            </View>
            <View style={styles.timeContent}>
              <Text style={styles.timeLabel}>{item.time}</Text>
              <Text style={styles.timeEventText}>{item.event}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090D16' },
  content: { padding: 18, paddingBottom: 40 },
  header: { marginBottom: 18, marginTop: 40 },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    marginBottom: 8,
  },
  badgeText: { color: '#38BDF8', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  title: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
  chartCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.7)',
    marginBottom: 16,
  },
  cardHeader: { color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 16 },
  donutRow: { flexDirection: 'row', alignItems: 'center' },
  donutWrapper: { position: 'relative', width: 160, height: 160, justifyContent: 'center', alignItems: 'center' },
  donutCenterLabel: { position: 'absolute', alignItems: 'center' },
  donutCenterValue: { fontSize: 28, fontWeight: '900', color: '#FFFFFF' },
  donutCenterSub: { fontSize: 10, fontWeight: '800', color: '#94A3B8' },
  legendCol: { flex: 1, paddingLeft: 18, gap: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  legendName: { color: '#F1F5F9', fontSize: 12, fontWeight: '700' },
  legendShare: { color: '#94A3B8', fontSize: 11 },
  windCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.7)',
    marginBottom: 16,
  },
  windHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  windTitle: { color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  windContentRow: { flexDirection: 'row', alignItems: 'center' },
  windCompassGraphic: { width: 90, height: 90, justifyContent: 'center', alignItems: 'center' },
  compassCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  needlePointer: {
    width: 3,
    height: 38,
    backgroundColor: '#EF4444',
    transform: [{ rotate: '-45deg' }],
  },
  compassLabelN: { position: 'absolute', top: 2, fontSize: 9, fontWeight: '900', color: '#38BDF8' },
  compassLabelS: { position: 'absolute', bottom: 2, fontSize: 9, fontWeight: '900', color: '#64748B' },
  compassLabelW: { position: 'absolute', left: 4, fontSize: 9, fontWeight: '900', color: '#38BDF8' },
  compassLabelE: { position: 'absolute', right: 4, fontSize: 9, fontWeight: '900', color: '#64748B' },
  windMetrics: { flex: 1, paddingLeft: 14 },
  windTrajectory: { color: '#F8FAFC', fontSize: 13, fontWeight: '700' },
  windSpeed: { color: '#38BDF8', fontSize: 12, fontWeight: '600', marginTop: 2 },
  windEffect: { color: '#94A3B8', fontSize: 11, marginTop: 4, lineHeight: 16 },
  explainCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.65)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
    marginBottom: 16,
  },
  explainHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  explainTitle: { color: '#FF6B35', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  explainBody: { color: '#F1F5F9', fontSize: 13, lineHeight: 20 },
  timelineCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.7)',
  },
  timelineHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  timelineTitle: { color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  timelineItem: { flexDirection: 'row' },
  timeBulletContainer: { alignItems: 'center', width: 20 },
  timeBullet: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#64748B', marginTop: 4 },
  timeBulletActive: { backgroundColor: '#38BDF8', width: 10, height: 10, borderRadius: 5 },
  timeLine: { flex: 1, width: 2, backgroundColor: 'rgba(71, 85, 105, 0.4)', marginVertical: 4 },
  timeContent: { flex: 1, paddingBottom: 16, paddingLeft: 10 },
  timeLabel: { color: '#38BDF8', fontSize: 11, fontWeight: '700' },
  timeEventText: { color: '#CBD5E1', fontSize: 12, marginTop: 2, lineHeight: 17 },
});
