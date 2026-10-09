/**
 * WhyBadAQI — Push Notification Service
 * =======================================
 * Registers the device for Expo push notifications, stores the token,
 * and exposes helpers for:
 *   - threshold-triggered AQI alerts ("AQI just crossed 200 in your area")
 *   - daily exposure summary notifications
 *   - community report acknowledgements
 *
 * Works on iOS, Android, and (partially) Expo web.
 * Reference: https://docs.expo.dev/push-notifications/push-notifications-setup/
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PUSH_TOKEN_KEY = '@whybadaqi:push_token';

// Configure foreground notification behaviour
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------
export async function registerForPushNotifications(): Promise<string | null> {
  // Push tokens only work on physical devices
  if (!Device.isDevice) {
    console.warn('[Notifications] Push tokens require a physical device (Expo Go on simulator won\'t work)');
    return null;
  }

  // Android requires an explicit notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('whybadaqi-alerts', {
      name: 'WhyBadAQI Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#38BDF8',
      sound: 'default',
      description: 'Personalized air quality alerts and exposure warnings',
    });
  }

  // Request permission
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('[Notifications] Permission not granted — push alerts disabled');
    return null;
  }

  // Fetch Expo push token
  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: 'whybadaqi', // Replace with your actual EAS project ID
  })).data;

  await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
  console.info(`[Notifications] Push token registered: ${token.slice(0, 30)}...`);
  return token;
}

export async function getStoredPushToken(): Promise<string | null> {
  return AsyncStorage.getItem(PUSH_TOKEN_KEY);
}

// ---------------------------------------------------------------------------
// Local Notification Helpers
// (Server-side push notifications would call the Expo Push API with the token)
// ---------------------------------------------------------------------------

/** Fire an immediate local AQI threshold alert. */
export async function sendAqiAlert(aqi: number, location: string, primarySource: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `🚨 AQI Alert — ${location}`,
      body: `AQI reached ${aqi} (${aqiLabel(aqi)}). Primary source: ${primarySource}. Open WhyBadAQI for actions.`,
      data: { type: 'aqi_alert', aqi, location },
      sound: 'default',
    },
    trigger: null, // Immediate
  });
}

/** Schedule a daily 8am exposure summary notification. */
export async function scheduleDailySummary(hour = 8, minute = 0) {
  // Cancel any existing daily summary first
  await cancelDailySummary();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌬️ Your Daily Air Quality Summary',
      body: 'Check your exposure score, top sources, and today\'s recommended actions in WhyBadAQI.',
      data: { type: 'daily_summary' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
  console.info(`[Notifications] Daily summary scheduled for ${hour}:${String(minute).padStart(2, '0')}`);
}

const DAILY_SUMMARY_ID_KEY = '@whybadaqi:daily_summary_id';

async function cancelDailySummary() {
  const existing = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of existing) {
    if ((n.content.data as any)?.type === 'daily_summary') {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
}

/** Send a badge unlock congratulation notification. */
export async function sendBadgeUnlockNotification(badgeName: string, emoji: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${emoji} Badge Unlocked!`,
      body: `You earned the "${badgeName}" badge. Keep making clean-air choices!`,
      data: { type: 'badge_unlock', badge: badgeName },
    },
    trigger: null,
  });
}

/** Send a community report acknowledgement. */
export async function sendReportConfirmation(location: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📍 Report Submitted',
      body: `Your pollution report near ${location} has been geo-tagged and added to the community map. Thanks!`,
      data: { type: 'report_confirm' },
    },
    trigger: null,
  });
}

// ---------------------------------------------------------------------------
// Notification Listener Setup (call once in root _layout.tsx)
// ---------------------------------------------------------------------------
export function setupNotificationListeners(
  onReceive?: (notification: Notifications.Notification) => void,
  onResponse?: (response: Notifications.NotificationResponse) => void
) {
  const receiveListener = Notifications.addNotificationReceivedListener(n => {
    console.info('[Notifications] Received:', n.request.content.title);
    onReceive?.(n);
  });

  const responseListener = Notifications.addNotificationResponseReceivedListener(r => {
    console.info('[Notifications] Tapped:', r.notification.request.content.title);
    onResponse?.(r);
  });

  return () => {
    receiveListener.remove();
    responseListener.remove();
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function aqiLabel(aqi: number): string {
  if (aqi <= 50)  return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 200) return 'Poor';
  if (aqi <= 300) return 'Very Poor';
  if (aqi <= 400) return 'Severe';
  return 'Hazardous';
}
