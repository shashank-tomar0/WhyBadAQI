import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api, LiveAttributionData } from '../../services/api';
import { Colors, FontFamily, Spacing, SourceConfig } from '../../constants/theme';
import AsciiButton from '../../components/AsciiButton';
import HeroAqi from '../../components/HeroAqi';
import MetricTile from '../../components/MetricTile';
import HourlyScrub from '../../components/HourlyScrub';

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

  const dominantSource = data?.attribution?.dominant_source || 'stubble';
  const dominantConfig = SourceConfig[dominantSource as keyof typeof SourceConfig] || SourceConfig.stubble;
  const dominantPercent = data?.attribution?.dominant_share || 52;

  // Build hourly timeline for the scrub row
  const timeline = (data?.forecast_24h || []).slice(0, 8).map((f, i) => ({
    hourLabel: i === 0 ? 'NOW' : `+${f.hour_offset}H`,
    aqi: f.aqi,
    dominantSourceCode: dominantSource.slice(0, 3).toUpperCase(),
    sourceColor: dominantConfig.color,
  }));

  if (loading && !data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="small" color={Colors.black} />
        <Text style={styles.loadingText}>INITIALIZING ATMOSPHERIC SENSORS...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Bar Header */}
      <View style={styles.topBar}>
        <Text style={styles.appTitle}>WHYBADAQI</Text>
        <AsciiButton
          label="SHARE"
          prefix=">"
          size="sm"
          onPress={() => router.push('/share-card')}
        />
      </View>

      {/* Current Location Strip */}
      <View style={styles.locationStrip}>
        <Text style={styles.locationText}>
          • STATION: SECTOR 62, NOIDA (28.61°N, 77.20°E)
        </Text>
        <Text style={styles.locationStatus}>[ONLINE]</Text>
      </View>

      {/* Massive Hero AQI & Attribution Readout */}
      <HeroAqi
        aqi={data?.aqi || 312}
        locationName="NEW DELHI NCR"
        primarySourceLabel={dominantConfig.label}
        primaryPercentage={dominantPercent}
        minAqi={140}
        maxAqi={390}
      />

      {/* Layer Filter Controls */}
      <View style={styles.layerFilterStrip}>
        <Text style={styles.filterLabel}>FILTER LAYER:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {(['all', 'stubble', 'traffic', 'dust', 'industry'] as const).map((layer) => {
            const isSelected = activeLayer === layer;
            return (
              <AsciiButton
                key={layer}
                label={layer}
                prefix={isSelected ? '*' : ''}
                variant={isSelected ? 'primary' : 'secondary'}
                size="sm"
                onPress={() => setActiveLayer(layer)}
              />
            );
          })}
        </ScrollView>
      </View>

      {/* High-Precision Radar / Sensor Grid Canvas */}
      <View style={styles.radarContainer}>
        <View style={styles.radarHeader}>
          <Text style={styles.radarCoord}>28°36'50"N • 77°12'32"E</Text>
          <Text style={styles.radarMeta}>
            PLUMES: {data?.heatmap_points.length || 18} • FIRMS FIRES: {data?.hotspots.filter(h => h.type === 'stubble').length || 14}
          </Text>
        </View>

        {/* Crosshair & Grid Lines */}
        <View style={styles.radarBox}>
          <View style={styles.crosshairH} />
          <View style={styles.crosshairV} />
          <View style={styles.centerTarget} />

          {/* Active Hotspots mapped to the grid */}
          {(data?.hotspots || []).map((h) => {
            const isVisible = activeLayer === 'all' || activeLayer === h.type;
            if (!isVisible) return null;
            return (
              <View
                key={h.id}
                style={[
                  styles.hotspotBox,
                  {
                    top: h.type === 'stubble' ? '24%' : h.type === 'traffic' ? '58%' : '72%',
                    left: h.type === 'stubble' ? '30%' : h.type === 'traffic' ? '65%' : '20%',
                  },
                ]}
              >
                <Text style={[styles.hotspotTag, { color: h.color }]}>
                  {`[${h.type.toUpperCase().slice(0, 4)}]`}
                </Text>
                <Text style={styles.hotspotName}>{h.name}</Text>
              </View>
            );
          })}

          {/* User Location Center Pin */}
          <View style={styles.userCenterPin}>
            <Text style={styles.userCenterText}>[YOU]</Text>
          </View>
        </View>
      </View>

      {/* High-Density 2-Column Metric Grid */}
      <View style={styles.metricGrid}>
        <View style={styles.metricRow}>
          <MetricTile
            label="PRIMARY SOURCE"
            value={`${dominantPercent}%`}
            subValue={dominantConfig.label}
            accentColor={dominantConfig.color}
          />
          <MetricTile
            label="WIND VECTOR"
            value={`${data?.attribution?.wind?.speed_kmh || 14.5} KM/H`}
            subValue={`${data?.attribution?.wind?.direction_deg || 301}° ${data?.attribution?.wind?.cardinal || 'NW'}`}
          />
        </View>

        <View style={styles.metricRow}>
          <MetricTile
            label="EXPOSURE SCORE"
            value={`${data?.exposure_score || 78}/100`}
            subValue="HIGH INHALATION RISK"
            accentColor={Colors.brandAccent}
          />
          <MetricTile
            label="SURROGATE CONFIDENCE"
            value="94.2%"
            subValue="GAUSSIAN PLUME PHY"
          />
        </View>

        <View style={styles.metricRow}>
          <MetricTile
            label="ACTIVE HOTSPOTS"
            value={`${data?.hotspots.length || 4} SITES`}
            subValue="NASA FIRMS + CPCB"
          />
          <MetricTile
            label="6-HR PEAK AQI"
            value={`${data?.forecast_24h[4]?.aqi || 365}`}
            subValue="EXPECTED @ 8:00 PM"
          />
        </View>
      </View>

      {/* Hourly Attribution Scrub */}
      <HourlyScrub
        timeline={timeline}
        selectedHour={selectedHour}
        onSelectHour={(idx) => setSelectedHour(idx)}
      />

      {/* Bottom Action Footer */}
      <View style={styles.bottomActions}>
        <AsciiButton
          label="COMMUNITY INCIDENT REPORT"
          prefix="+"
          variant="secondary"
          onPress={() => router.push('/(tabs)/community')}
          style={{ marginBottom: Spacing.sm }}
        />
        <AsciiButton
          label="PRESCRIPTIVE ACTION ADVISORY"
          prefix=">"
          variant="primary"
          onPress={() => router.push('/(tabs)/actions')}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },
  loadingText: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  appTitle: {
    fontFamily: FontFamily.mono,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    color: Colors.textPrimary,
  },
  locationStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs + 2,
    borderBottomWidth: 0.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bgSubtle,
  },
  locationText: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textSecondary,
  },
  locationStatus: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.healthGood,
  },
  layerFilterStrip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  filterLabel: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  filterScroll: {
    gap: Spacing.xs,
  },
  radarContainer: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  radarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  radarCoord: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Colors.textMuted,
  },
  radarMeta: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textMuted,
  },
  radarBox: {
    height: 180,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.bgSubtle,
    position: 'relative',
    overflow: 'hidden',
  },
  crosshairH: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
    backgroundColor: Colors.border,
  },
  crosshairV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
    backgroundColor: Colors.border,
  },
  centerTarget: {
    position: 'absolute',
    top: '44%',
    left: '46%',
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  hotspotBox: {
    position: 'absolute',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  hotspotTag: {
    fontFamily: FontFamily.mono,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  hotspotName: {
    fontFamily: FontFamily.mono,
    fontSize: 8,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  userCenterPin: {
    position: 'absolute',
    top: '46%',
    left: '46%',
    backgroundColor: Colors.black,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  userCenterText: {
    fontFamily: FontFamily.mono,
    fontSize: 8,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  metricGrid: {
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  metricRow: {
    flexDirection: 'row',
  },
  bottomActions: {
    padding: Spacing.lg,
    backgroundColor: Colors.bg,
  },
});
