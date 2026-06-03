// ─── Imports ─────────────────────────────────────────────────────────────────
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// ─── Design tokens — matches OnboardingScreen ─────────────────────────────────
const GREEN      = '#00C853';
const GREEN_TINT = 'rgba(0, 200, 83, 0.15)';
const BG         = '#0A0E1A';
const CARD_BG    = '#131929';
const BORDER     = '#1E2A3D';
const WHITE      = '#FFFFFF';
const GREY       = '#6B7A8D';
const LIGHT_GREY = '#8A96A8';

// ─── Lesson data ──────────────────────────────────────────────────────────────
// Change these values to reuse this screen for a different lesson
const LESSON = {
  title: 'What is a Call Option?',
  totalSteps: 5,
  currentStep: 1,
  lives: 3,
  xpEarned: 0,
  body:
    'A call option gives you the right — but not the obligation — to buy 100 shares of ' +
    'a stock at a fixed price (called the strike price) before a specific date (the ' +
    'expiration date).',
  tip: "Think of it like a reservation. You lock in today's price to buy later.",
};

// Bottom navigation tabs — Learn is active on this screen
const TABS = [
  { icon: 'home',              label: 'Home',    active: false },
  { icon: 'book-open-variant', label: 'Learn',   active: true  },
  { icon: 'bullseye',          label: 'Quiz',    active: false },
  { icon: 'notebook-outline',  label: 'Journal', active: false },
  { icon: 'account',           label: 'Profile', active: false },
];

// ─── LessonScreen ─────────────────────────────────────────────────────────────
export default function LessonScreen({ navigation }) {
  const progressPercent = `${(LESSON.currentStep / LESSON.totalSteps) * 100}%`;

  // Maps a custom tab bar label to the correct React Navigation tab name.
  const handleTabPress = (label) => {
    if (label === 'Home')    navigation.navigate('Home');
    if (label === 'Learn')   navigation.navigate('Lesson');
    if (label === 'Profile') navigation.navigate('Profile');
    // Quiz and Journal are not yet registered as main tabs — no-op for now
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>

        {/* ══════════════════════════════════════════════
            SECTION 1 — Top bar
            Left: × close | Centre: progress bar | Right: lives + XP
        ══════════════════════════════════════════════ */}
        <View style={styles.topBar}>

          {/* Close / exit button */}
          <TouchableOpacity style={styles.closeBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Home')}>
            <MaterialCommunityIcons name="close" size={20} color={LIGHT_GREY} />
          </TouchableOpacity>

          {/* Progress bar: outer track + inner fill */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: progressPercent }]} />
          </View>

          {/* Lives and XP */}
          <View style={styles.statusGroup}>
            {Array.from({ length: LESSON.lives }).map((_, i) => (
              <MaterialCommunityIcons key={i} name="heart" size={17} color="#F44336" />
            ))}
            <View style={styles.xpPill}>
              <MaterialCommunityIcons name="lightning-bolt" size={13} color="#FFD600" />
              <Text style={styles.xpText}>{LESSON.xpEarned}</Text>
            </View>
          </View>

        </View>

        {/* ══════════════════════════════════════════════
            SECTION 2 — Scrollable lesson content
        ══════════════════════════════════════════════ */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* Small green "LESSON" category tag above the title */}
          <Text style={styles.lessonTag}>LESSON</Text>

          {/* Main lesson title */}
          <Text style={styles.lessonTitle}>{LESSON.title}</Text>

          {/* ── Concept diagram card ── */}
          <View style={styles.diagramCard}>
            <View style={styles.diagramRow}>

              {/* Left box — the cost side */}
              <View style={styles.diagramBox}>
                <Text style={styles.diagramBoxLabel}>You Pay</Text>
                <Text style={styles.diagramBoxGreen}>Premium</Text>
              </View>

              <MaterialCommunityIcons name="chevron-right" size={22} color={GREY} />

              {/* Right box — the benefit side */}
              <View style={styles.diagramBox}>
                <Text style={styles.diagramBoxLabel}>Strike Price</Text>
                <Text style={styles.diagramBoxWhite}>$150</Text>
              </View>

            </View>

            {/* Contract-type label centred beneath the two boxes */}
            <Text style={styles.diagramFooter}>CALL OPTION</Text>
          </View>

          {/* ── Body explanation paragraph ── */}
          <Text style={styles.bodyText}>{LESSON.body}</Text>

          {/* ── Tip box ── */}
          <View style={styles.tipBox}>
            <MaterialCommunityIcons
              name="lightbulb-outline"
              size={18}
              color="#FFD600"
              style={styles.tipIcon}
            />
            <Text style={styles.tipText}>{LESSON.tip}</Text>
          </View>

        </ScrollView>

        {/* ══════════════════════════════════════════════
            SECTION 3 — Continue button
            Pinned above the tab bar; matches OnboardingScreen button style
        ══════════════════════════════════════════════ */}
        <View style={styles.continueSection}>
          <TouchableOpacity style={styles.continueBtn} activeOpacity={0.85} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>

        {/* ══════════════════════════════════════════════
            BOTTOM TAB BAR
            Learn tab is highlighted green.
        ══════════════════════════════════════════════ */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity key={tab.label} style={styles.tabItem} activeOpacity={0.7} onPress={() => handleTabPress(tab.label)}>
              <MaterialCommunityIcons
                name={tab.icon}
                size={22}
                color={tab.active ? GREEN : GREY}
              />
              <Text style={[styles.tabLabel, tab.active && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  screen:  { flex: 1, backgroundColor: BG },
  safeArea: { flex: 1 },

  // ── Top bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 12,
  },
  closeBtn: { padding: 4 },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: BORDER,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: GREEN,
    borderRadius: 3,
  },
  statusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginLeft: 4,
    gap: 3,
  },
  xpText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Scroll area ──
  scroll:        { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 6,
    paddingBottom: 16,
  },

  // Small uppercase tag
  lessonTag: {
    color: GREEN,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 8,
  },

  // Large bold lesson title
  lessonTitle: {
    color: WHITE,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: 24,
  },

  // ── Concept diagram card ──
  diagramCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  diagramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    width: '100%',
  },
  diagramBox: {
    flex: 1,
    backgroundColor: BG,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  diagramBoxLabel: {
    color: GREY,
    fontSize: 11,
    marginBottom: 6,
  },
  diagramBoxGreen: {
    color: GREEN,
    fontSize: 17,
    fontWeight: '700',
  },
  diagramBoxWhite: {
    color: WHITE,
    fontSize: 17,
    fontWeight: '700',
  },
  diagramFooter: {
    color: GREEN,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
  },

  // ── Body text ──
  bodyText: {
    color: WHITE,
    fontSize: 15,
    lineHeight: 25,
    marginBottom: 20,
  },

  // ── Tip box ──
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 10,
  },
  tipIcon: { marginTop: 1 },
  tipText: {
    flex: 1,
    color: LIGHT_GREY,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },

  // ── Continue button — matches OnboardingScreen primaryBtn ──
  continueSection: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  continueBtn: {
    backgroundColor: GREEN,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ── Bottom tab bar ──
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: CARD_BG,
  },
  tabItem: {
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: GREY,
  },
  tabLabelActive: {
    color: GREEN,
    fontWeight: '600',
  },
});
