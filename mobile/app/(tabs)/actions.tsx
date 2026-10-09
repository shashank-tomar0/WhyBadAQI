import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  Share,
} from 'react-native';
import { api, ActionCard } from '../../services/api';
import { Colors, FontFamily, Spacing } from '../../constants/theme';
import AsciiButton from '../../components/AsciiButton';

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
      '[REMINDER CONFIGURED]',
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTag}>INTERVENTION ENGINE</Text>
        <Text style={styles.title}>ACTION CARDS</Text>
        <Text style={styles.subTitle}>
          • PRESCRIPTIVE BEHAVIORAL PROTOCOLS
        </Text>
      </View>

      {/* Advisory Cards List */}
      <View style={styles.cardsContainer}>
        {cards.map((card, index) => {
          const isReminded = remindedIds[card.id];
          return (
            <View key={card.id || index} style={styles.cardBox}>
              {/* Card Meta Row */}
              <View style={styles.metaRow}>
                <Text style={styles.metaBadge}>{`[ADVISORY ${index + 1}]`}</Text>
                <Text style={styles.timingText}>{card.duration.toUpperCase()}</Text>
              </View>

              {/* Title */}
              <Text style={styles.cardTitle}>{card.title.toUpperCase()}</Text>

              {/* Reason */}
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>CAUSE / RATIONALE:</Text>
                <Text style={styles.infoBody}>{card.reason}</Text>
              </View>

              {/* Expected Impact */}
              <View style={styles.impactBlock}>
                <Text style={styles.impactLabel}>EXPECTED IMPACT:</Text>
                <Text style={styles.impactValue}>
                  {card.expected_impact.toUpperCase()}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                <AsciiButton
                  label={isReminded ? 'ALERT SET' : 'SET REMINDER'}
                  prefix={isReminded ? '*' : '+'}
                  variant={isReminded ? 'primary' : 'secondary'}
                  size="sm"
                  onPress={() => handleSetReminder(card)}
                  style={{ flex: 1 }}
                />
                <AsciiButton
                  label="SHARE TO RWA"
                  prefix=">"
                  variant="primary"
                  size="sm"
                  onPress={() => handleShareWhatsApp(card)}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          );
        })}
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
  screenTag: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
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
  cardsContainer: {
    paddingVertical: Spacing.sm,
  },
  cardBox: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.bg,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  metaBadge: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.brandAccent,
  },
  timingText: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textMuted,
  },
  cardTitle: {
    fontFamily: FontFamily.mono,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  infoBlock: {
    marginBottom: Spacing.sm,
  },
  infoLabel: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  infoBody: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    lineHeight: 16,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  impactBlock: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.bgSubtle,
    borderWidth: 0.5,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  impactLabel: {
    fontFamily: FontFamily.mono,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  impactValue: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.healthGood,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
