import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { api, LiveAttributionData } from '../../services/api';
import { Flame, Car, Wind, Factory, AlertTriangle, Compass, Clock, Share2, Layers } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function LiveMapScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LiveAttributionData | null>(null);
  const [selectedHour, setSelectedHour] = useState(0);
  const [activeLayer, setActiveLayer] = useState<'all' | 'stubble' | 'traffic' | 'dust' | 'industry'>('all');

  useEffect(() => {
    fetchFeed(selectedHour);
  }, [selectedHour]);

  const fetchFeed = async (hourOffset: number) => {
    try {
      const res = await api.getLiveAttribution(28.6139, 77.2090, hourOffset);
      setData(res);
    } catch (e) {
      console.warn('Error fetching live map feed:', e);
    } finally {
      setLoading(false);
    }
  };

  const getSourceColor = (type: string) => {
    switch (type) {
      case 'stubble': return '#FF6B35'; // Orange
      case 'traffic': return '#0077B6'; // Blue
      case 'dust': return '#D4A373';    // Brown
      case 'industry': return '#7209B7';// Purple
      default: return '#E63946';
    }
  };

  return (
    <View style={styles.container}>
      {/* Dark Live Atmospheric Map Canvas */}
      <View style={styles.mapCanvas}>
        {/* Dark Map Grid & Vector Flow Background */}
        <LinearGradient colors={['#090D16', '#0F172A', '#06090F']} style={StyleSheet.absoluteFillObject}>
          {/* Heatmap Plumes & Points */}
          <View style={styles.plumesContainer}>
            {data?.heatmap_points.map((pt, idx) => {
              const visible = activeLayer === 'all' || activeLayer === pt.dominant_source;
              if (!visible) return null;
              return (
                <View
                  key={`pt-${idx}`}
                  style={[
                    styles.heatmapBubble,
                    {
                      backgroundColor: pt.color,
                      opacity: pt.weight * 0.45,
                      top: `${20 + (idx % 5) * 14}%`,
                      left: `${10 + (Math.floor(idx / 3) % 4) * 22}%`,
                      transform: [{ scale: 1.0 + pt.weight * 0.8 }],
                    },
                  ]}
                />
              );
            })}

            {/* Pulsing Red Fire Markers (NASA FIRMS Feed) */}
            {data?.hotspots.map((spot) => (
              <View
                key={spot.id}
                style={[
                  styles.hotspotMarker,
                  {
                    top: spot.type === 'stubble' ? '28%' : spot.type === 'traffic' ? '54%' : '68%',
                    left: spot.type === 'stubble' ? '32%' : spot.type === 'traffic' ? '65%' : '24%',
                  },
                ]}
              >
                <View style={[styles.pulseRing, { borderColor: spot.color }]} />
                <View style={[styles.hotspotDot, { backgroundColor: spot.color }]}>
                  {spot.type === 'stubble' && <Flame size={12} color="#FFF" />}
                  {spot.type === 'traffic' && <Car size={12} color="#FFF" />}
                  {spot.type === 'industry' && <Factory size={12} color="#FFF" />}
                </View>
                <View style={styles.markerBadge}>
                  <Text style={styles.markerText}>{spot.name}</Text>
                  <Text style={[styles.markerSubtext, { color: spot.color }]}>{spot.intensity}</Text>
                </View>
              </View>
            ))}

            {/* User Hyperlocal Pin with Personal Exposure Ring */}
            <View style={styles.userPinContainer}>
              <View style={[styles.userExposureRing, { borderColor: data?.health_color || '#E74C3C' }]}>
                <View style={[styles.userPulseHalo, { backgroundColor: data?.health_color || '#E74C3C' }]} />
                <View style={styles.userCenterDot}>
                  <Text style={styles.userPinLabel}>YOU</Text>
                </View>
              </View>
              <View style={styles.userAddressTag}>
                <Text style={styles.userStreetText}>Connaught Place, Ring Rd</Text>
                <Text style={styles.userCoordsText}>28.6139° N, 77.2090° E</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Top Floating Control Pill */}
        <View style={styles.topBar}>
          <View style={styles.livePill}>
            <View style={styles.liveIndicator} />
            <Text style={styles.liveText}>LIVE SURROGATE DISPERSION</Text>
          </View>
          <TouchableOpacity style={styles.shareIconButton} onPress={() => router.push('/share-card')}>
            <Share2 size={18} color="#38BDF8" />
          </TouchableOpacity>
        </View>

        {/* Source Layer Filter Chips */}
        <View style={styles.layerBar}>
          <TouchableOpacity
            style={[styles.layerChip, activeLayer === 'all' && styles.layerChipActive]}
            onPress={() => setActiveLayer('all')}
          >
            <Text style={[styles.layerChipText, activeLayer === 'all' && styles.layerChipTextActive]}>All Sources</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.layerChip, activeLayer === 'stubble' && { backgroundColor: 'rgba(255, 107, 53, 0.3)' }]}
            onPress={() => setActiveLayer('stubble')}
          >
            <Flame size={12} color="#FF6B35" style={{ marginRight: 4 }} />
            <Text style={[styles.layerChipText, { color: '#FF6B35' }]}>Stubble (54%)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.layerChip, activeLayer === 'traffic' && { backgroundColor: 'rgba(0, 119, 182, 0.3)' }]}
            onPress={() => setActiveLayer('traffic')}
          >
            <Car size={12} color="#0077B6" style={{ marginRight: 4 }} />
            <Text style={[styles.layerChipText, { color: '#0077B6' }]}>Traffic</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 24-Hour Predictive Time Scrubber */}
      <View style={styles.scrubberContainer}>
        <View style={styles.scrubberHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Clock size={14} color="#94A3B8" style={{ marginRight: 6 }} />
            <Text style={styles.scrubberTitle}>24-HOUR FORECAST SCRUBBER</Text>
          </View>
          <Text style={styles.scrubberTimeLabel}>
            {selectedHour === 0 ? 'NOW' : `+${selectedHour}h (${data?.forecast_24h[selectedHour]?.timestamp || ''})`}
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timelineRow}>
          {data?.forecast_24h.slice(0, 13).map((item) => (
            <TouchableOpacity
              key={item.hour_offset}
              style={[
                styles.hourTick,
                selectedHour === item.hour_offset && styles.hourTickSelected,
              ]}
              onPress={() => setSelectedHour(item.hour_offset)}
            >
              <Text style={[styles.hourTickTime, selectedHour === item.hour_offset && styles.hourTickTextActive]}>
                {item.hour_offset === 0 ? 'Now' : `+${item.hour_offset}h`}
              </Text>
              <Text style={[styles.hourTickAqi, { color: item.aqi > 300 ? '#EF4444' : '#F59E0B' }]}>
                {item.aqi}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Sheet Card: Personal Exposure & Attribution */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeaderRow}>
          <View>
            <Text style={styles.sheetSub}>HYPERLOCAL EXPOSURE SCORE</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 2 }}>
              <Text style={[styles.scoreValue, { color: data?.health_color || '#EF4444' }]}>
                {data?.exposure_score ?? 42}
              </Text>
              <Text style={styles.scoreMax}> / 100</Text>
              <View style={[styles.gradeBadge, { backgroundColor: `${data?.health_color || '#EF4444'}25` }]}>
                <Text style={[styles.gradeText, { color: data?.health_color || '#EF4444' }]}>
                  {data?.health_grade || 'Severe'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.detailsBtn} onPress={() => router.push('/(tabs)/attribution')}>
            <Text style={styles.detailsBtnText}>Why Is It Bad? →</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Dominant Source Pill & Wind Vector */}
        <View style={styles.quickSourceRow}>
          <View style={styles.sourceTag}>
            <Flame size={14} color="#FF6B35" style={{ marginRight: 6 }} />
            <Text style={styles.sourceTagText}>
              Primary Driver: <Text style={{ color: '#FF6B35', fontWeight: '700' }}>Stubble Burning (54%)</Text>
            </Text>
          </View>
          <View style={styles.windTag}>
            <Compass size={14} color="#38BDF8" style={{ marginRight: 4 }} />
            <Text style={styles.windTagText}>NW @ 14.5 km/h</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090D16' },
  mapCanvas: { flex: 1, position: 'relative' },
  plumesContainer: { flex: 1, position: 'relative', overflow: 'hidden' },
  heatmapBubble: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    filter: 'blur(35px)',
  },
  hotspotMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    opacity: 0.6,
    top: -9,
  },
  hotspotDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
  },
  markerText: { color: '#F8FAFC', fontSize: 10, fontWeight: '700' },
  markerSubtext: { fontSize: 9, fontWeight: '600' },
  userPinContainer: {
    position: 'absolute',
    top: '46%',
    left: '46%',
    alignItems: 'center',
  },
  userExposureRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  userPulseHalo: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    opacity: 0.25,
  },
  userCenterDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0284C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userPinLabel: { color: '#FFF', fontSize: 8, fontWeight: '900' },
  userAddressTag: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    alignItems: 'center',
  },
  userStreetText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  userCoordsText: { color: '#94A3B8', fontSize: 9 },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  liveIndicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  liveText: { color: '#38BDF8', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  shareIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  layerBar: {
    position: 'absolute',
    top: 96,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  layerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.8)',
  },
  layerChipActive: { backgroundColor: 'rgba(56, 189, 248, 0.2)', borderColor: '#38BDF8' },
  layerChipText: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  layerChipTextActive: { color: '#38BDF8' },
  scrubberContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
  },
  scrubberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scrubberTitle: { color: '#94A3B8', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  scrubberTimeLabel: { color: '#38BDF8', fontSize: 11, fontWeight: '700' },
  timelineRow: { flexDirection: 'row', gap: 10, paddingVertical: 4 },
  hourTick: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    minWidth: 54,
  },
  hourTickSelected: {
    backgroundColor: 'rgba(56, 189, 248, 0.25)',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  hourTickTime: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  hourTickTextActive: { color: '#38BDF8', fontWeight: '800' },
  hourTickAqi: { fontSize: 12, fontWeight: '800', marginTop: 2 },
  bottomSheet: {
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.7)',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#475569',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetSub: { color: '#94A3B8', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  scoreValue: { fontSize: 32, fontWeight: '900' },
  scoreMax: { color: '#64748B', fontSize: 14, fontWeight: '600', marginLeft: 2 },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 10,
  },
  gradeText: { fontSize: 11, fontWeight: '800' },
  detailsBtn: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  detailsBtnText: { color: '#38BDF8', fontSize: 12, fontWeight: '700' },
  quickSourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  sourceTag: { flexDirection: 'row', alignItems: 'center' },
  sourceTagText: { color: '#CBD5E1', fontSize: 12 },
  windTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  windTagText: { color: '#38BDF8', fontSize: 11, fontWeight: '600' },
});
