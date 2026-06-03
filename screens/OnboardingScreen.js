import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// AsyncStorage lets us flag that the user has finished onboarding
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Data ────────────────────────────────────────────────────────────────────
// Each object drives one feature card: icon character, bold title, grey subtitle.
const FEATURES = [
  {
    id: 'lessons',
    icon: '⚡',
    title: 'Daily Lessons',
    subtitle: '5-min lessons on trading strategies',
  },
  {
    id: 'paper',
    icon: '↗',
    title: 'Paper Trading',
    subtitle: 'Practice with virtual money',
  },
  {
    id: 'compete',
    icon: '🏆',
    title: 'Compete & Win',
    subtitle: 'Climb the leaderboard weekly',
  },
];

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function OnboardingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E1A" />

      {/* APP LOGO — dark rounded square with a green trending-up arrow */}
      <View style={styles.logoWrap}>
        <View style={styles.logoBox}>
          <Text style={styles.logoArrow}>↗</Text>
        </View>
      </View>

      {/* HEADLINE — large bold app name plus one-liner value proposition */}
      <View style={styles.headlineWrap}>
        <Text style={styles.headline}>Welcome to{'\n'}EduWhale</Text>
        <Text style={styles.subheadline}>
          Learn to day trade like a pro with bite-sized lessons and real-time
          practice
        </Text>
      </View>

      {/* FEATURE CARDS — one row per feature, icon on the left, text on the right */}
      <View style={styles.cardsWrap}>
        {FEATURES.map((f) => (
          <View key={f.id} style={styles.card}>
            {/* Green-tinted icon bubble */}
            <View style={styles.iconBubble}>
              <Text style={styles.iconText}>{f.icon}</Text>
            </View>

            {/* Card label + description */}
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{f.title}</Text>
              <Text style={styles.cardSubtitle}>{f.subtitle}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA BUTTONS — full-width green primary button, plain text secondary */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Quiz')}
        >
          <Text style={styles.primaryBtnText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.7}
          onPress={async () => {
            // Skip onboarding entirely and go straight to the main app.
            // Mark as done so this is also skipped on every future launch.
            await AsyncStorage.setItem('@onboarding_complete', 'true');
            navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
          }}
        >
          <Text style={styles.secondaryBtnText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const GREEN = '#00C853';
const NAVY = '#0A0E1A';
const CARD_BG = '#131929';
const BORDER = '#1E2A3D';
const WHITE = '#FFFFFF';
const GREY = '#6B7A8D';
const LIGHT_GREY = '#8A96A8';

const styles = StyleSheet.create({
  // Full-screen dark navy container — SafeAreaView handles notch/home bar
  screen: {
    flex: 1,
    backgroundColor: NAVY,
    paddingHorizontal: 24,
  },

  // ── Logo ──────────────────────────────────────────────────────────────────

  // Centres the logo box horizontally at the top of the screen
  logoWrap: {
    alignItems: 'center',
    marginTop: 44,
    marginBottom: 28,
  },

  // Dark rounded square that mimics an app icon — green border gives it pop
  logoBox: {
    width: 72,
    height: 72,
    backgroundColor: '#151C2E',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Arrow character styled to match the green accent colour
  logoArrow: {
    fontSize: 34,
    color: GREEN,
    fontWeight: '700',
    lineHeight: 40,
  },

  // ── Headline ──────────────────────────────────────────────────────────────

  headlineWrap: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },

  // Bold, large headline — two lines via the embedded newline in the JSX
  headline: {
    fontSize: 32,
    fontWeight: '800',
    color: WHITE,
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 12,
  },

  // Muted single-sentence pitch below the headline
  subheadline: {
    fontSize: 15,
    fontWeight: '400',
    color: LIGHT_GREY,
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── Feature cards ─────────────────────────────────────────────────────────

  // Stacks the three cards with even spacing; flex:1 pushes CTAs to the bottom
  cardsWrap: {
    flex: 1,
    gap: 12,
  },

  // Single card: dark background, subtle border, rounded corners
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  // Translucent green circle that holds the icon — conveys the green theme
  iconBubble: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 200, 83, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  // Icon character inside the bubble
  iconText: {
    fontSize: 20,
    color: GREEN,
    lineHeight: 26,
  },

  // Right-side text column — takes remaining horizontal space
  cardText: {
    flex: 1,
  },

  // Bold card label
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: WHITE,
    marginBottom: 3,
  },

  // Dimmed description line below the title
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: GREY,
    lineHeight: 18,
  },

  // ── CTA buttons ───────────────────────────────────────────────────────────

  // Anchors the button group to the bottom with breathing room
  ctaWrap: {
    paddingTop: 20,
    paddingBottom: 12,
    gap: 10,
  },

  // Full-width solid green primary button
  primaryBtn: {
    backgroundColor: GREEN,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: WHITE,
    letterSpacing: 0.3,
  },

  // Text-only secondary button — no background, no border
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },

  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: GREY,
  },
});
