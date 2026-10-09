import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Colors, FontFamily, Spacing } from '../../constants/theme';
import AsciiButton from '../../components/AsciiButton';

export default function LoginScreen() {
  const router = useRouter();
  const { login, quickDemoLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('[INPUT REQUIRED]', 'Please enter your email and password credentials.');
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('[AUTHENTICATION FAILED]', err.message || 'Invalid credentials');
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Terminal Header */}
        <View style={styles.header}>
          <Text style={styles.tag}>ATMOSPHERIC DISPERSION & SOURCE ENGINE</Text>
          <Text style={styles.title}>WHYBADAQI</Text>
          <Text style={styles.subTitle}>
            • HYPERLOCAL DOSIMETRY • NASA FIRMS + CPCB + SURROGATE ML
          </Text>
        </View>

        {/* Auth Form Card */}
        <View style={styles.formBox}>
          <Text style={styles.formTag}>[TERMINAL ACCESS GATEWAY]</Text>

          <Text style={styles.label}>EMAIL IDENTIFIER:</Text>
          <TextInput
            style={styles.input}
            placeholder="USER@WHYBADAQI.AI"
            placeholderTextColor={Colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>PASSWORD CREDENTIAL:</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••••••"
            placeholderTextColor={Colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <AsciiButton
            label={submitting ? 'AUTHENTICATING...' : 'AUTHENTICATE ACCESS'}
            prefix=">"
            variant="primary"
            disabled={submitting}
            onPress={handleLogin}
            style={{ marginTop: Spacing.md }}
          />

          {/* Quick Demo Bypass for Evaluators */}
          <View style={styles.dividerBox}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>EVALUATOR SHORTCUT</Text>
            <View style={styles.dividerLine} />
          </View>

          <AsciiButton
            label="EVALUATOR 1-TAP DEMO BYPASS"
            prefix="*"
            variant="secondary"
            disabled={submitting}
            onPress={handleDemoMode}
          />
        </View>

        {/* Register link */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>NEED A CITIZEN SENSOR ACCOUNT?</Text>
          <AsciiButton
            label="CREATE NEW CREDENTIALS"
            prefix="+"
            variant="ghost"
            size="sm"
            onPress={() => router.push('/(auth)/register')}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl + 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: Spacing.xl,
  },
  tag: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  title: {
    fontFamily: FontFamily.mono,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
    color: Colors.textPrimary,
  },
  subTitle: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  formBox: {
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.bg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  formTag: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.brandAccent,
    marginBottom: Spacing.lg,
  },
  label: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  input: {
    fontFamily: FontFamily.mono,
    fontSize: 12,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.bgSubtle,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  dividerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontFamily: FontFamily.mono,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.sm,
  },
  footerRow: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  footerText: {
    fontFamily: FontFamily.mono,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
    color: Colors.textMuted,
  },
});
