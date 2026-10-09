import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Share,
  Linking,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontFamily, Spacing } from '../constants/theme';
import AsciiButton from '../components/AsciiButton';
import HeroAqi from '../components/HeroAqi';

export default function ShareCardModal() {
  const router = useRouter();

  const handleShare = async () => {
    try {
      await Share.share({
        title: 'WhyBadAQI Dossier',
        message:
          '💨 Today my air is 312 AQI (Severe), with 54.2% driven by Stubble Burning smoke on 301° NW winds.\n\nI’m on a 4-day clean route streak with WhyBadAQI!\n\nCheck what’s driving pollution on your street: https://whybadaqi.ai',
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleWhatsAppStatus = async () => {
    const text = encodeURIComponent(
      '🚨 *WhyBadAQI Atmospheric Dossier*\n\n• AQI: *312 (Severe)*\n• Primary Driver: *Stubble Burning (54.2%)*\n• Wind Corridor: *301° NW @ 14.5 km/h*\n• Inhalation Dose: *78/100*\n• Clean Air Streak: *4 Days* 🔥\n\nKnow what’s causing your air right now: https://whybadaqi.ai'
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>ATMOSPHERIC DOSSIER EXPORT</Text>
        <AsciiButton
          label="CLOSE"
          prefix="X"
          variant="secondary"
          size="sm"
          onPress={() => router.back()}
        />
      </View>

      {/* The Printable Brutalist Instrument Card */}
      <View style={styles.dossierCard}>
        {/* Header Block */}
        <View style={styles.dossierHeader}>
          <Text style={styles.dossierBrand}>WHYBADAQI</Text>
          <Text style={styles.dossierCoord}>28°36'50"N • 77°12'32"E</Text>
        </View>

        <Text style={styles.stationLabel}>
          • STATION: WARD 45 (INDO-GANGETIC CORRIDOR)
        </Text>

        {/* Hero AQI Display inside the card */}
        <HeroAqi
          aqi={312}
          locationName="NEW DELHI NCR"
          primarySourceLabel="STUBBLE BURNING"
          primaryPercentage={54.2}
          minAqi={140}
          maxAqi={385}
        />

        {/* Breakdown Summary Grid */}
        <View style={styles.breakdownBox}>
          <Text style={styles.breakdownHeader}>SOURCE APPORTIONMENT BREAKDOWN:</Text>
          <Text style={styles.breakdownLine}>[STUBBLE]  54.2%  PUNJAB/HARYANA FIRE INFLOW</Text>
          <Text style={styles.breakdownLine}>[TRAFFIC]  24.8%  VEHICULAR ARTERIAL EXHAUST</Text>
          <Text style={styles.breakdownLine}>[DUST]     12.1%  CIVIL ROAD & CONSTRUCTION SILT</Text>
          <Text style={styles.breakdownLine}>[INDUSTRY]  8.9%  REGIONAL INDUSTRIAL STACKS</Text>
        </View>

        {/* Inhaled Dose & Streak */}
        <View style={styles.streakBox}>
          <Text style={styles.streakLabel}>PERSONAL INHALED DOSE: 78 / 100</Text>
          <Text style={styles.streakSub}>
            ACTIVE CLEAN ROUTE CHOICE STREAK: 4 CONSECUTIVE DAYS
          </Text>
        </View>

        {/* Verification Footer */}
        <View style={styles.dossierFooter}>
          <Text style={styles.footerText}>
            VERIFIED VIA NASA FIRMS MODIS + CPCB SENSORS + GAUSSIAN SURROGATE
          </Text>
          <Text style={styles.urlText}>HTTPS://WHYBADAQI.AI</Text>
        </View>
      </View>

      {/* Sharing CTAs */}
      <View style={styles.actionsBox}>
        <AsciiButton
          label="SHARE DOSSIER TO WHATSAPP"
          prefix=">"
          variant="primary"
          onPress={handleWhatsAppStatus}
          style={{ marginBottom: Spacing.sm }}
        />
        <AsciiButton
          label="EXPORT VIA SYSTEM SHARE"
          prefix="+"
          variant="secondary"
          onPress={handleShare}
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
  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  topBarTitle: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: Colors.textMuted,
  },
  dossierCard: {
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.bg,
    marginBottom: Spacing.xl,
  },
  dossierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.black,
  },
  dossierBrand: {
    fontFamily: FontFamily.mono,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    color: Colors.white,
  },
  dossierCoord: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textMuted,
  },
  stationLabel: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  breakdownBox: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgSubtle,
  },
  breakdownHeader: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  breakdownLine: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textPrimary,
    marginVertical: 2,
  },
  streakBox: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  streakLabel: {
    fontFamily: FontFamily.mono,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.textPrimary,
  },
  streakSub: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.brandAccent,
    marginTop: 4,
  },
  dossierFooter: {
    padding: Spacing.md,
    backgroundColor: Colors.bgSubtle,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: FontFamily.mono,
    fontSize: 8,
    fontWeight: '600',
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 4,
  },
  urlText: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    color: Colors.black,
  },
  actionsBox: {
    marginTop: Spacing.sm,
  },
});
