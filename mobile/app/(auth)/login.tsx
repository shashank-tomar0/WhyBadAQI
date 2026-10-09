import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Wind, Shield, Flame, Sparkles } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login, quickDemoLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Required', 'Please enter your email and password');
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoMode = async () => {
    setSubmitting(true);
    try {
      await quickDemoLogin();
      router.replace('/(tabs)');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617', '#000000']} style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Brand Header */}
          <View style={styles.header}>
            <View style={styles.badgeRow}>
              <View style={styles.iconCircle}>
                <Wind size={28} color="#38BDF8" />
              </View>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <Flame size={28} color="#EF4444" />
              </View>
            </View>
            <Text style={styles.title}>WhyBadAQI</Text>
            <Text style={styles.tagline}>Hyperlocal Source Attribution & Dispersion Engine</Text>
            <Text style={styles.subtitle}>Know what’s poisoning your air right now, on your street.</Text>
          </View>

          {/* Frosted Glass Form Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="citizen@whybadaqi.ai"
                placeholderTextColor="#64748B"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#64748B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={submitting}>
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Authenticate & Enter</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR HACKATHON DEMO</Text>
              <View style={styles.divider} />
            </View>

            {/* 1-Tap Demo Mode for Judges & Evaluators */}
            <TouchableOpacity style={styles.demoButton} onPress={handleDemoMode} disabled={submitting}>
              <Sparkles size={18} color="#38BDF8" style={{ marginRight: 8 }} />
              <Text style={styles.demoButtonText}>Explore as Demo Citizen (Ward 45)</Text>
            </TouchableOpacity>
          </View>

          {/* Switch to Register */}
          <TouchableOpacity style={styles.footerLink} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.footerText}>
              Need a hyperlocal account? <Text style={styles.footerHighlight}>Register here</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 28 },
  badgeRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  title: { fontSize: 34, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  tagline: { fontSize: 13, fontWeight: '600', color: '#38BDF8', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
  subtitle: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginTop: 8, paddingHorizontal: 16 },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.75)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
  },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#F8FAFC', marginBottom: 18 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '500', color: '#CBD5E1', marginBottom: 6 },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.8)',
  },
  primaryButton: {
    backgroundColor: '#0284C7',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  divider: { flex: 1, height: 1, backgroundColor: 'rgba(71, 85, 105, 0.5)' },
  dividerText: { color: '#64748B', fontSize: 11, fontWeight: '700', marginHorizontal: 12, letterSpacing: 1 },
  demoButton: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  demoButtonText: { color: '#38BDF8', fontSize: 14, fontWeight: '600' },
  footerLink: { marginTop: 24, alignItems: 'center' },
  footerText: { color: '#94A3B8', fontSize: 14 },
  footerHighlight: { color: '#38BDF8', fontWeight: '700' },
});
