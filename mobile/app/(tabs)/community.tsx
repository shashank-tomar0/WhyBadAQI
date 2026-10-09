import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { api, CommunityReport, LeaderboardData } from '../../services/api';
import { Colors, FontFamily, Spacing } from '../../constants/theme';
import AsciiButton from '../../components/AsciiButton';
import MetricTile from '../../components/MetricTile';

export default function CommunityReportsScreen() {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState('Open Garbage Fire');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    try {
      const [reps, board] = await Promise.all([
        api.getCommunityReports(),
        api.getLeaderboard(),
      ]);
      setReports(reps || []);
      setLeaderboard(board || null);
    } catch (e) {
      console.warn('Error loading community data:', e);
    }
  };

  const handleSubmitReport = async () => {
    if (!description) {
      Alert.alert('[INPUT REQUIRED]', 'Please provide details of the observed emission source.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.createReport({
        category,
        description,
        latitude: 28.6189,
        longitude: 77.2120,
        photo_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
      });
      Alert.alert('[VERIFIED REPORT SUBMITTED]', res.message || 'Report published with GPS & Photo trust badge.');
      setModalVisible(false);
      setDescription('');
      loadCommunityData();
    } catch (e: any) {
      Alert.alert('[ERROR]', e.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.screenTag}>GROUND TRUTH CITIZEN SENSING</Text>
          <AsciiButton
            label="NEW REPORT"
            prefix="+"
            variant="primary"
            size="sm"
            onPress={() => setModalVisible(true)}
          />
        </View>
        <Text style={styles.title}>COMMUNITY FEED</Text>
        <Text style={styles.subTitle}>
          • GEO-TAGGED OBSERVATIONS FOR WARD 45
        </Text>
      </View>

      {/* Ward Leaderboard Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>WARD 45 REPUTATION LEADERBOARD</Text>
      </View>

      {/* Leaderboard Table */}
      <View style={styles.leaderboardBox}>
        {(leaderboard?.top_reporters || [
          { rank: 1, name: 'SHASHANK T.', reports_count: 14, streak: 5, badge: 'TOP REPORTER' },
          { rank: 2, name: 'ANANYA R.', reports_count: 11, streak: 3, badge: 'VALIDATOR' },
          { rank: 3, name: 'VIKRAM M.', reports_count: 9, streak: 2, badge: 'SENTINEL' },
        ]).map((item, idx: number) => (
          <View key={idx} style={styles.leaderRow}>
            <Text style={styles.rankText}>{`#${item.rank}`}</Text>
            <View style={styles.leaderInfo}>
              <Text style={styles.leaderName}>{item.name.toUpperCase()}</Text>
              <Text style={styles.leaderWard}>WARD 45</Text>
            </View>
            <Text style={styles.leaderPoints}>{`${item.reports_count} RPTS`}</Text>
            <Text style={styles.leaderBadge}>{`[${item.badge}]`}</Text>
          </View>
        ))}
      </View>

      {/* Verified Incident Feed */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PHOTO-VERIFIED INCIDENT STREAM</Text>
      </View>

      <View style={styles.feedContainer}>
        {reports.map((report) => (
          <View key={report.id} style={styles.reportBox}>
            <View style={styles.reportMetaRow}>
              <Text style={styles.reportCategory}>{`[${report.category.toUpperCase()}]`}</Text>
              <Text style={styles.reportTime}>{(report.created_at || 'RECENT').toUpperCase()}</Text>
            </View>

            <Text style={styles.reportLocation}>
              {`• COORDS: ${report.latitude.toFixed(4)}°N, ${report.longitude.toFixed(4)}°E`}
            </Text>

            <Text style={styles.reportDesc}>{report.description}</Text>

            <View style={styles.reportFooter}>
              <Text style={styles.trustBadge}>[GPS & PHOTO VERIFIED]</Text>
              <Text style={styles.reporterName}>
                {`BY: ${report.user_name.toUpperCase()}`}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Report Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTag}>SUBMIT FIELD INCIDENT</Text>
            <AsciiButton
              label="CLOSE"
              prefix="X"
              variant="secondary"
              size="sm"
              onPress={() => setModalVisible(false)}
            />
          </View>

          <Text style={styles.modalTitle}>LOG GROUND TRUTH</Text>
          <Text style={styles.modalSub}>
            • YOUR OBSERVATION FEEDS THE HYPERLOCAL SURROGATE MODEL
          </Text>

          {/* Category Chooser */}
          <Text style={styles.formLabel}>SELECT POLLUTION CATEGORY:</Text>
          <View style={styles.categoryRow}>
            {['Open Garbage Fire', 'Construction Dust', 'Diesel Trucks', 'Industrial Smoke'].map((cat) => (
              <AsciiButton
                key={cat}
                label={cat}
                prefix={category === cat ? '*' : ''}
                variant={category === cat ? 'primary' : 'secondary'}
                size="sm"
                onPress={() => setCategory(cat)}
                style={{ marginBottom: Spacing.xs }}
              />
            ))}
          </View>

          {/* Description Input */}
          <Text style={styles.formLabel}>OBSERVATION DETAILS:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="DESCRIBE VISIBLE SMOKE/DUST, DURATION, AND APPROXIMATE VICINITY..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          <View style={styles.geoStamp}>
            <Text style={styles.geoStampText}>
              • AUTOMATIC METADATA: GPS STAMP (28.6189°N, 77.2120°E) • TIMESTAMP: CURRENT
            </Text>
          </View>

          <AsciiButton
            label={submitting ? 'TRANSMITTING...' : 'TRANSMIT VERIFIED REPORT'}
            prefix=">"
            variant="primary"
            disabled={submitting}
            onPress={handleSubmitReport}
            style={{ marginTop: Spacing.lg }}
          />
        </ScrollView>
      </Modal>
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
  leaderboardBox: {
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  rankText: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    fontWeight: '900',
    width: 32,
    color: Colors.textMuted,
  },
  leaderInfo: {
    flex: 1,
  },
  leaderName: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  leaderWard: {
    fontFamily: FontFamily.mono,
    fontSize: 8,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  leaderPoints: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  leaderBadge: {
    fontFamily: FontFamily.mono,
    fontSize: 8,
    fontWeight: '800',
    color: Colors.healthGood,
  },
  feedContainer: {
    paddingVertical: Spacing.sm,
  },
  reportBox: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.bg,
  },
  reportMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  reportCategory: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: Colors.brandAccent,
  },
  reportTime: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  reportLocation: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  reportDesc: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    lineHeight: 16,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 0.5,
    borderColor: Colors.border,
  },
  trustBadge: {
    fontFamily: FontFamily.mono,
    fontSize: 8,
    fontWeight: '800',
    color: Colors.healthGood,
    letterSpacing: 0.5,
  },
  reporterName: {
    fontFamily: FontFamily.mono,
    fontSize: 8,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  modalTag: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textMuted,
  },
  modalTitle: {
    fontFamily: FontFamily.mono,
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  modalSub: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    marginTop: 4,
  },
  formLabel: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  categoryRow: {
    gap: Spacing.xs,
  },
  textInput: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.bgSubtle,
    padding: Spacing.md,
    color: Colors.textPrimary,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  geoStamp: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: Colors.bgSubtle,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  geoStampText: {
    fontFamily: FontFamily.mono,
    fontSize: 8,
    fontWeight: '600',
    color: Colors.textMuted,
  },
});
