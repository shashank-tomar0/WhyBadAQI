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

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ward, setWard] = useState('Ward 45 (Central / Connaught Place)');
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('[INPUT REQUIRED]', 'Please fill in name, email, and password credentials.');
      return;
    }
    setSubmitting(true);
    try {
      await register(name, email, password, ward);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('[REGISTRATION FAILED]', err.message || 'Error creating account');
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
          <Text style={styles.tag}>CITIZEN SENSOR ONBOARDING</Text>
          <Text style={styles.title}>NEW OPERATOR</Text>
          <Text style={styles.subTitle}>
            • ENROLL IN HYPERLOCAL ATMOSPHERIC DISPERSION GRID
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formBox}>
          <Text style={styles.formTag}>[CREDENTIAL CONFIGURATION]</Text>

          <Text style={styles.label}>OPERATOR NAME:</Text>
          <TextInput
            style={styles.input}
            placeholder="ROHAN SHARMA"
            placeholderTextColor={Colors.textMuted}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>EMAIL IDENTIFIER:</Text>
          <TextInput
            style={styles.input}
            placeholder="OPERATOR@WHYBADAQI.AI"
            placeholderTextColor={Colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>SECURITY KEY (PASSWORD):</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••••••"
            placeholderTextColor={Colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>RESIDENCE WARD ZONE:</Text>
          <TextInput
            style={styles.input}
            placeholder="WARD 45 (CENTRAL DELHI)"
            placeholderTextColor={Colors.textMuted}
            value={ward}
            onChangeText={setWard}
          />

          <AsciiButton
            label={submitting ? 'INITIALIZING...' : 'INITIALIZE ACCOUNT'}
            prefix=">"
            variant="primary"
            disabled={submitting}
            onPress={handleRegister}
            style={{ marginTop: Spacing.md }}
          />
        </View>

        {/* Back to Login */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>ALREADY HAVE CREDENTIALS?</Text>
          <AsciiButton
            label="RETURN TO TERMINAL LOGIN"
            prefix="<"
            variant="ghost"
            size="sm"
            onPress={() => router.back()}
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
    paddingTop: Spacing.xxl + 10,
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
