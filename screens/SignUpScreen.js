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
import { signUp } from '../services/auth';

// ─── Design tokens ────────────────────────────────────────────────────────────
const GREEN      = '#00C853';
const BG         = '#0A0E1A';
const CARD_BG    = '#131929';
const BORDER     = '#1E2A3D';
const WHITE      = '#FFFFFF';
const GREY       = '#6B7A8D';
const LIGHT_GREY = '#8A96A8';

// ─── SignUpScreen ─────────────────────────────────────────────────────────────
// Receives `track` ('beginner' or 'intermediate') from QuizScreen via
// route.params. Creates the Supabase auth user and public profile on submit.
// After a successful signup, App.js's onAuthStateChange fires automatically
// and switches the navigator to MainTabs — no navigation call needed here.
export default function SignUpScreen({ navigation, route }) {
  // The track the user picked on the quiz screen (determined by Q1 answer)
  const track = route.params?.track ?? 'beginner';
  // Quiz answers from QuizScreen
  const quiz_answers = route.params?.quiz_answers ?? {};

  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSignUp = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please fill in all three fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password too short', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      console.log('SignUpScreen: quiz_answers', quiz_answers);
      console.log('SignUpScreen: resolved track', track);
      await signUp({ email: email.trim(), password, username: username.trim(), track, quiz_answers });
      // No navigation here — App.js's onAuthStateChange handles it automatically
    } catch (err) {
      Alert.alert('Sign up failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        {/* KeyboardAvoidingView shifts the form up when the keyboard opens */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >

            {/* ── Heading ── */}
            <Text style={styles.heading}>Create your{'\n'}account</Text>
            <Text style={styles.subheading}>
              Track:{' '}
              <Text style={styles.trackBadge}>
                {track.charAt(0).toUpperCase() + track.slice(1)}
              </Text>
            </Text>

            {/* ── Username field ── */}
            <View style={styles.field}>
              <Text style={styles.label}>USERNAME</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. TraderMike"
                placeholderTextColor={GREY}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

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
                placeholder="At least 6 characters"
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
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color={WHITE} />
                : <Text style={styles.btnText}>Create Account</Text>
              }
            </TouchableOpacity>

            {/* ── Switch to login ── */}
            <TouchableOpacity
              style={styles.switchRow}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.switchText}>
                Already have an account?{' '}
                <Text style={styles.switchLink}>Log in</Text>
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
  screen:  { flex: 1, backgroundColor: BG },
  safeArea: { flex: 1 },
  flex:    { flex: 1 },
  content: { padding: 24, paddingTop: 48 },

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
  trackBadge: {
    color: GREEN,
    fontWeight: '700',
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
