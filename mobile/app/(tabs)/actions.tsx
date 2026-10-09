import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, Dimensions, Share } from 'react-native';
import { api, ActionCard } from '../../services/api';
import { Shield, Bell, Share2, AlertTriangle, Clock, Activity, MapPin, Heart, Check, Sparkles } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ActionCardsScreen() {
  const [cards, setCards] = useState<ActionCard[]>([]);
  const [remindedIds, setRemindedIds] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      const res = await api.getActionCards();
      setCards(res.cards || []);
    } catch (e) {
      console.warn('Error loading action cards:', e);
    }
  };

  const handleSetReminder = (card: ActionCard) => {
    setRemindedIds((prev) => ({ ...prev, [card.id]: true }));
    Alert.alert(
      '🔔 Reminder Configured',
      `Push alert scheduled for ${card.reminder_time} today: "${card.title}"`
    );
  };

  const handleShareWhatsApp = async (card: ActionCard) => {
    const text = encodeURIComponent(
      `🚨 *WhyBadAQI Hyperlocal Advisory*\n\n*Action:* ${card.title}\n*Reason:* ${card.reason}\n*Impact:* ${card.expected_impact}\n\n👉 Track live source attribution on WhyBadAQI: https://whybadaqi.ai`
    );
    const waUrl = `whatsapp://send?text=${text}`;

    try {
      const canOpen = await Linking.canOpenURL(waUrl);
      if (canOpen) {
        await Linking.openURL(waUrl);
      } else {
        await Share.share({
          message: card.share_text,
          title: card.title,
        });
      }
    } catch {
      await Share.share({
        message: card.share_text,
        title: card.title,
      });
    }
  };

  const renderCardIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'activity': return <Activity size={22} color={color} />;
      case 'shield': return <Shield size={22} color={color} />;
      case 'map-pin': return <MapPin size={22} color={color} />;
      case 'heart': return <Heart size={22} color={color} />;
      default: return <Shield size={22} color={color} />;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badgePill}>
          <Sparkles size={12} color="#38BDF8" style={{ marginRight: 6 }} />
          <Text style={styles.badgeText}>PRESCRIPTIVE DEFENSE PROTOCOL</Text>
        </View>
        <Text style={styles.title}>Action Cards</Text>
        <Text style={styles.subtitle}>Prioritized decisions tailored to incoming smoke and traffic plumes</Text>
      </View>

      {/* Swipeable / Actionable Cards Feed */}
      <View style={styles.cardsFeed}>
        {cards.map((card) => {
          const isReminded = remindedIds[card.id];
          return (
            <View key={card.id} style={styles.actionCard}>
              {/* Card Category & Urgency */}
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardIconBox}>
                  {renderCardIcon(card.icon, card.urgency_color)}
                </View>
                <View style={{ flex: 1, paddingLeft: 12 }}>
                  <View style={[styles.categoryPill, { backgroundColor: `${card.urgency_color}25` }]}>
                    <Text style={[styles.categoryText, { color: card.urgency_color }]}>{card.category}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                </View>
              </View>

              {/* Action Breakdown Grid */}
              <View style={styles.detailsBox}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>CAUSAL REASON</Text>
                  <Text style={styles.detailValue}>{card.reason}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>TARGET DURATION</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Clock size={12} color="#38BDF8" style={{ marginRight: 4 }} />
                    <Text style={styles.detailValue}>{card.duration}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>MEASURED LUNG IMPACT</Text>
                  <Text style={[styles.detailValue, { color: '#10B981', fontWeight: '700' }]}>
                    {card.expected_impact}
                  </Text>
                </View>
              </View>

              {/* Action Buttons: Set Reminder & Share to WhatsApp */}
              <View style={styles.actionsFooter}>
                <TouchableOpacity
                  style={[styles.reminderBtn, isReminded && styles.reminderBtnActive]}
                  onPress={() => handleSetReminder(card)}
                >
                  {isReminded ? (
                    <>
                      <Check size={16} color="#10B981" style={{ marginRight: 6 }} />
                      <Text style={[styles.btnText, { color: '#10B981' }]}>Reminder Set</Text>
                    </>
                  ) : (
                    <>
                      <Bell size={16} color="#38BDF8" style={{ marginRight: 6 }} />
                      <Text style={[styles.btnText, { color: '#38BDF8' }]}>Set Reminder</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.shareWhatsAppBtn}
                  onPress={() => handleShareWhatsApp(card)}
                >
                  <Share2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.shareBtnText}>Share to WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
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
  cardsFeed: { gap: 16 },
  actionCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.7)',
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.4)',
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  categoryText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  cardTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', lineHeight: 22 },
  detailsBox: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 14,
    padding: 12,
    gap: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  detailValue: { color: '#F1F5F9', fontSize: 12, fontWeight: '600', maxWidth: '65%', textAlign: 'right' },
  actionsFooter: { flexDirection: 'row', gap: 10 },
  reminderBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  reminderBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  shareWhatsAppBtn: {
    flex: 1.2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25D366',
    borderRadius: 14,
    paddingVertical: 12,
  },
  btnText: { fontSize: 13, fontWeight: '700' },
  shareBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
