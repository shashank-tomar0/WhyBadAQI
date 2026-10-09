import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/AuthContext';
import {
  registerForPushNotifications,
  setupNotificationListeners,
  scheduleDailySummary,
} from '../services/notifications';

export default function RootLayout() {
  useEffect(() => {
    // Register push token and schedule daily summary on app launch
    registerForPushNotifications().catch(() => {/* silently degrade if denied */});
    scheduleDailySummary(8, 0).catch(() => {});

    // Attach notification listeners for the app lifetime
    const cleanup = setupNotificationListeners(
      (n) => console.log('[App] Notification received:', n.request.content.title),
      (r) => console.log('[App] Notification tapped:', r.notification.request.content.title)
    );
    return cleanup;
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#090D16' },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="share-card"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
