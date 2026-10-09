import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Linking, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Wind, Flame, Shield, Award, Share2, X, Sparkles, QrCode } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ShareCardModal() {
  const router = useRouter();

  const handleShare = async () => {
    try {
      await Share.share({
        title: 'My WhyBadAQI Report',
        message: '💨 Today my air is 312 AQI (Severe), with 54.2% driven by Stubble Burning smoke on NW winds.\n\nI’m protecting my lungs and on a 4-day clean route streak with WhyBadAQI!\n\nCheck what’s driving pollution on your street: https://whybadaqi.ai',
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleWhatsAppStatus = async () => {
    const text = encodeURIComponent(
      '🚨 *WhyBadAQI Hyperlocal Citizen Card*\n\n• AQI: *312 (Severe)*\n• Primary Driver: *Stubble Burning (54.2%)*\n• My Clean Air Streak: *4 Days* 🔥\n\nKnow what’s causing your air right now: https://whybadaqi.ai'
    );
    const url = `whatsapp://send?text=${text}`;
    try {
      const can = await Linking.canOpenURL(url);
      if (can) {
        await Linking.openURL(url);
      } else {
        await handleShare();
      }
    } catch {
      await handleShare();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617', '#000000']} style={StyleSheet.absoluteFillObject} />

      {/* Top Close Button */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <X size={20} color="#CBD5E1" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>VIRAL SCORE CARD</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* The Branded Viral Card for Instagram / WhatsApp screenshot */}
        <View style={styles.viralCard}>
          <LinearGradient
            colors={['#1E293B', '#0F172A', '#020617']}
            style={styles.cardGradient}
          >
            {/* Brand Logo Header */}
            <View style={styles.cardHeader}>
              <View style={styles.brandRow}>
                <View style={styles.brandIconCircle}>
                  <Wind size={20} color="#38BDF8" />
                </View>
                <Text style={styles.brandName}>WhyBadAQI</Text>
              </View>
              <View style={styles.wardBadge}>
                <Text style={styles.wardBadgeText}>WARD 45 (CENTRAL)</Text>
              </View>
            </View>

            {/* Score & Gauge */}
            <View style={styles.cardBody}>
              <Text style={styles.cardSubTitle}>HYPERLOCAL SMOG EXPOSURE</Text>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreNumber}>42</Text>
                <Text style={styles.scoreMax}>/100</Text>
              </View>
              <View style={styles.healthGradePill}>
                <Text style={styles.healthGradeText}>Severe Inhaled Risk</Text>
              </View>
            </View>

            {/* Source Dissection Breakdown Box */}
            <View style={styles.breakdownBox}>
              <Text style={styles.breakdownTitle}>DOMINANT DRIVERS TODAY</Text>
              <View style={styles.sourceBar}>
                <View style={[styles.barSegment, { flex: 54, backgroundColor: '#FF6B35' }]} />
                <View style={[styles.barSegment, { flex: 25, backgroundColor: '#0077B6' }]} />
                <View style={[styles.barSegment, { flex: 12, backgroundColor: '#D4A373' }]} />
                <View style={[styles.barSegment, { flex: 9, backgroundColor: '#7209B7' }]} />
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.sourceNote}>
                  🔥 <Text style={{ color: '#FF6B35', fontWeight: '700' }}>54.2%</Text> Stubble Burning
                </Text>
                <Text style={styles.sourceNote}>
                  🚗 <Text style={{ color: '#0077B6', fontWeight: '700' }}>24.8%</Text> Traffic
                </Text>
              </View>
            </View>

            {/* Viral Hooks: Streaks & Badges */}
            <View style={styles.cardFooter}>
              <View style={styles.streakBadge}>
                <Flame size={14} color="#FF6B35" style={{ marginRight: 4 }} />
                <Text style={styles.streakBadgeText}>4-Day Clean Streak</Text>
              </View>
              <View style={styles.verifiedWatermark}>
                <Sparkles size={12} color="#38BDF8" style={{ marginRight: 4 }} />
                <Text style={styles.verifiedWatermarkText}>whybadaqi.ai</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.waBtn} onPress={handleWhatsAppStatus}>
            <Share2 size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.waBtnText}>Share to WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.systemShareBtn} onPress={handleShare}>
            <Text style={styles.systemShareText}>Instagram / Story</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: { color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  scroll: { alignItems: 'center', padding: 20 },
  viralCard: {
    width: width - 40,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    shadowColor: '#38BDF8',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  cardGradient: { padding: 24 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  brandName: { color: '#FFFFFF', fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  wardBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.8)',
  },
  wardBadgeText: { color: '#38BDF8', fontSize: 9, fontWeight: '800' },
  cardBody: { alignItems: 'center', marginVertical: 24 },
  cardSubTitle: { color: '#94A3B8', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
  scoreNumber: { color: '#EF4444', fontSize: 64, fontWeight: '900', letterSpacing: -2 },
  scoreMax: { color: '#64748B', fontSize: 20, fontWeight: '700', marginLeft: 4 },
  healthGradePill: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  healthGradeText: { color: '#EF4444', fontSize: 12, fontWeight: '800' },
  breakdownBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
  },
  breakdownTitle: { color: '#94A3B8', fontSize: 9, fontWeight: '800', letterSpacing: 0.8, marginBottom: 8 },
  sourceBar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
  barSegment: { height: '100%' },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sourceNote: { color: '#E2E8F0', fontSize: 11 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  streakBadgeText: { color: '#FF6B35', fontSize: 11, fontWeight: '800' },
  verifiedWatermark: { flexDirection: 'row', alignItems: 'center' },
  verifiedWatermarkText: { color: '#38BDF8', fontSize: 11, fontWeight: '700' },
  actionRow: { width: '100%', marginTop: 24, gap: 12 },
  waBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 15,
    borderRadius: 16,
  },
  waBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  systemShareBtn: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.8)',
  },
  systemShareText: { color: '#38BDF8', fontSize: 14, fontWeight: '700' },
});
