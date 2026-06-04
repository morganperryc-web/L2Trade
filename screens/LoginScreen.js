// ─── Imports ─────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { signIn } from '../services/auth';

// ─── Design tokens ────────────────────────────────────────────────────────────
const GREEN      = '#00C853';
const BG         = '#0A0E1A';
const CARD_BG    = '#131929';
const BORDER     = '#1E2A3D';
const WHITE      = '#FFFFFF';
const GREY       = '#6B7A8D';
const LIGHT_GREY = '#8A96A8';

// ─── LoginScreen ──────────────────────────────────────────────────────────────
// After a successful signIn, App.js's onAuthStateChange fires automatically
// and switches the navigator to MainTabs — no navigation call needed here.
export default function LoginScreen({ navigation }) {
  const [email,   setEmail]   = useState('');
  const [password,setPassword]= useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await signIn({ email: email.trim(), password });
      // No navigation here — App.js's onAuthStateChange handles it automatically
    } catch (err) {
      Alert.alert('Login failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >

            {/* ── Back button ── */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            {/* ── Heading ── */}
            <Text style={styles.heading}>Welcome{'\n'}back</Text>
            <Text style={styles.subheading}>Sign in to continue learning.</Text>

            {/* ── Email field ── */}
            <View style={styles.field}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={GREY}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            {/* ── Password field ── */}
            <View style={styles.field}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="Your password"
                placeholderTextColor={GREY}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* ── Submit button ── */}
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color={WHITE} />
                : <Text style={styles.btnText}>Log In</Text>
              }
            </TouchableOpacity>

            {/* ── Switch to sign up ── */}
            <TouchableOpacity
              style={styles.switchRow}
              onPress={() => navigation.navigate('SignUp')}
              activeOpacity={0.7}
            >
              <Text style={styles.switchText}>
                Don't have an account?{' '}
                <Text style={styles.switchLink}>Sign up</Text>
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: BG },
  safeArea: { flex: 1 },
  flex:     { flex: 1 },
  content:  { padding: 24, paddingTop: 24 },

  backBtn:  { marginBottom: 32 },
  backText: {
    color: GREY,
    fontSize: 14,
    fontWeight: '500',
  },

  heading: {
    color: WHITE,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 40,
    marginBottom: 8,
  },
  subheading: {
    color: LIGHT_GREY,
    fontSize: 14,
    marginBottom: 36,
  },

  field: { marginBottom: 20 },
  label: {
    color: LIGHT_GREY,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  input: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: WHITE,
    fontSize: 15,
  },

  btn: {
    backgroundColor: GREEN,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  btnDisabled: { opacity: 0.55 },
  btnText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  switchRow: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  switchText: {
    color: GREY,
    fontSize: 14,
  },
  switchLink: {
    color: GREEN,
    fontWeight: '600',
  },
});
