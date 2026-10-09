import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Map, PieChart, Activity, CheckSquare, Users } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#090D16',
          borderTopColor: 'rgba(51, 65, 85, 0.7)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#38BDF8',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Live Map',
          tabBarIcon: ({ color, size }) => <Map size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="attribution"
        options={{
          title: 'Why Bad?',
          tabBarIcon: ({ color, size }) => <PieChart size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="exposure"
        options={{
          title: 'My Score',
          tabBarIcon: ({ color, size }) => <Activity size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="actions"
        options={{
          title: 'Actions',
          tabBarIcon: ({ color, size }) => <CheckSquare size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => <Users size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
