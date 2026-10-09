import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Map, PieChart, Activity, CheckSquare, Users } from 'lucide-react-native';
import { Colors, FontFamily } from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bg,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 62,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: FontFamily.mono,
          fontSize: 9,
          fontWeight: '700',
          letterSpacing: 1.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '[MAP]',
          tabBarIcon: ({ color }) => <Map size={18} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="attribution"
        options={{
          title: '[WHY BAD]',
          tabBarIcon: ({ color }) => <PieChart size={18} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="exposure"
        options={{
          title: '[SCORE]',
          tabBarIcon: ({ color }) => <Activity size={18} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="actions"
        options={{
          title: '[ACTIONS]',
          tabBarIcon: ({ color }) => <CheckSquare size={18} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: '[REPORTS]',
          tabBarIcon: ({ color }) => <Users size={18} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}
