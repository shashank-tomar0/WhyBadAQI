import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, Modal, Dimensions } from 'react-native';
import { api, CommunityReport, LeaderboardData } from '../../services/api';
import { Camera, ShieldCheck, Flame, MapPin, ThumbsUp, Plus, Trophy, Award, Clock, Sparkles, CheckCircle2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

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
      Alert.alert('Details Required', 'Please provide a brief description of the observed pollution source');
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
      Alert.alert('✅ Verified Report Submitted', res.message || 'Report published with GPS & Photo trust badge');
      setModalVisible(false);
      setDescription('');
      loadCommunityData();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badgePill}>
          <Sparkles size={12} color="#38BDF8" style={{ marginRight: 6 }} />
          <Text style={styles.badgeText}>PHOTO-VERIFIED COMMUNITY SENSING</Text>
        </View>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Community Feed</Text>
            <Text style={styles.subtitle}>Hyperlocal ground-truth reports from Ward 45 citizens</Text>
          </View>
          <TouchableOpacity style={styles.addReportBtn} onPress={() => setModalVisible(true)}>
            <Plus size={18} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.addReportBtnText}>Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Ward Leaderboard Banner */}
      <View style={styles.leaderboardCard}>
        <View style={styles.boardHeader}>
          <Trophy size={18} color="#F59E0B" style={{ marginRight: 8 }} />
          <Text style={styles.boardTitle}>WARD 45 REPUTATION LEADERBOARD</Text>
        </View>

        <View style={styles.topReportersRow}>
          {(leaderboard?.top_reporters.slice(0, 3) || []).map((rep) => (
            <View key={rep.rank} style={styles.topReporterCol}>
              <View style={[styles.avatarCircle, rep.rank === 1 && styles.rank1Ring]}>
                <Text style={styles.rankNum}>#{rep.rank}</Text>
              </View>
              <Text style={styles.repName} numberOfLines={1}>{rep.name}</Text>
              <Text style={styles.repScore}>{rep.reports_count} reports</Text>
              <View style={styles.repStreakPill}>
                <Flame size={10} color="#FF6B35" style={{ marginRight: 2 }} />
                <Text style={styles.repStreakText}>{rep.streak}d streak</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Verified Reports Feed */}
      <Text style={styles.feedTitle}>RECENT VERIFIED INCIDENTS</Text>
      <View style={styles.feedList}>
        {reports.map((rep) => (
          <View key={rep.id} style={styles.reportCard}>
            {/* User & Trust Badge Header */}
            <View style={styles.reportCardHeader}>
              <View>
                <Text style={styles.reporterName}>{rep.user_name}</Text>
                <View style={styles.coordsRow}>
                  <MapPin size={11} color="#94A3B8" style={{ marginRight: 4 }} />
                  <Text style={styles.coordsText}>
                    {rep.latitude.toFixed(4)}° N, {rep.longitude.toFixed(4)}° E
                  </Text>
                </View>
              </View>
              <View style={styles.trustBadge}>
                <ShieldCheck size={13} color="#10B981" style={{ marginRight: 4 }} />
                <Text style={styles.trustBadgeText}>{rep.trust_badge}</Text>
              </View>
            </View>

            {/* Photo Attachment */}
            {rep.photo_url && (
              <Image source={{ uri: rep.photo_url }} style={styles.reportImage} resizeMode="cover" />
            )}

            {/* Category Tag & Description */}
            <View style={styles.reportBody}>
              <View style={styles.categoryBadge}>
                <Flame size={12} color="#FF6B35" style={{ marginRight: 4 }} />
                <Text style={styles.categoryBadgeText}>{rep.category}</Text>
              </View>
              <Text style={styles.descriptionText}>{rep.description}</Text>
            </View>

            {/* Upvote & Action Bar */}
            <View style={styles.cardFooter}>
              <TouchableOpacity style={styles.upvoteBtn}>
                <ThumbsUp size={14} color="#38BDF8" style={{ marginRight: 6 }} />
                <Text style={styles.upvoteText}>{rep.upvotes} Confirmed</Text>
              </TouchableOpacity>
              <Text style={styles.timestampText}>Verified 2h ago</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Report Incident Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Submit Verified Emission Report</Text>
            <Text style={styles.modalSub}>Attaches GPS coordinates & camera timestamp proof</Text>

            <Text style={styles.inputLabel}>EMISSION CATEGORY</Text>
            <View style={styles.categorySelector}>
              {['Open Garbage Fire', 'Uncovered Construction Dust', 'Industrial Plume'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, category === cat && styles.catChipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>INCIDENT OBSERVATION NOTE</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Thick black smoke rising from behind vacant warehouse on Main Arterial Rd..."
              placeholderTextColor="#64748B"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <View style={styles.gpsStampBox}>
              <CheckCircle2 size={16} color="#10B981" style={{ marginRight: 6 }} />
              <Text style={styles.gpsStampText}>Hyperlocal Geotag: 28.6189° N, 77.2120° E (Ward 45)</Text>
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitReport} disabled={submitting}>
                <Text style={styles.submitBtnText}>{submitting ? 'Verifying...' : 'Broadcast Report'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
  addReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addReportBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  leaderboardCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.7)',
    marginBottom: 20,
  },
  boardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  boardTitle: { color: '#F59E0B', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  topReportersRow: { flexDirection: 'row', justifyContent: 'space-around' },
  topReporterCol: { alignItems: 'center', width: 95 },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  rank1Ring: { borderWidth: 2, borderColor: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.15)' },
  rankNum: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  repName: { color: '#F1F5F9', fontSize: 11, fontWeight: '700', textAlign: 'center' },
  repScore: { color: '#94A3B8', fontSize: 10 },
  repStreakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  repStreakText: { color: '#FF6B35', fontSize: 9, fontWeight: '700' },
  feedTitle: { color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 12 },
  feedList: { gap: 16 },
  reportCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.7)',
  },
  reportCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  reporterName: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  coordsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  coordsText: { color: '#94A3B8', fontSize: 10 },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  trustBadgeText: { color: '#10B981', fontSize: 10, fontWeight: '700' },
  reportImage: { width: '100%', height: 160 },
  reportBody: { padding: 14 },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryBadgeText: { color: '#FF6B35', fontSize: 11, fontWeight: '700' },
  descriptionText: { color: '#E2E8F0', fontSize: 13, lineHeight: 18 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 4,
  },
  upvoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  upvoteText: { color: '#38BDF8', fontSize: 12, fontWeight: '700' },
  timestampText: { color: '#64748B', fontSize: 11 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.8)',
  },
  modalTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  modalSub: { color: '#94A3B8', fontSize: 12, marginTop: 4, marginBottom: 18 },
  inputLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '800', letterSpacing: 0.8, marginBottom: 8 },
  categorySelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  catChip: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.7)',
  },
  catChipActive: { backgroundColor: 'rgba(56, 189, 248, 0.2)', borderColor: '#38BDF8' },
  catChipText: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  catChipTextActive: { color: '#38BDF8', fontWeight: '800' },
  modalInput: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 14,
    padding: 14,
    color: '#FFF',
    fontSize: 13,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.8)',
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  gpsStampBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  gpsStampText: { color: '#10B981', fontSize: 11, fontWeight: '600' },
  modalButtonsRow: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
  },
  cancelBtnText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
  submitBtn: {
    flex: 1.5,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#0284C7',
  },
  submitBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});
