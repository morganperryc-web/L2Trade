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
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// ─── Lesson data ──────────────────────────────────────────────────────────────
// Change these values to reuse this screen for a different lesson
const LESSON = {
  title: 'What is a Call Option?',
  totalSteps: 5,     // used to calculate how full the progress bar is
  currentStep: 1,    // step 1 of 5 → bar is 20% filled
  lives: 3,          // number of hearts shown in the top-right
  xpEarned: 0,       // XP accumulated so far this lesson
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
  // How much of the progress bar to fill (e.g. step 1 of 5 → 20%)
  const progressPercent = `${(LESSON.currentStep / LESSON.totalSteps) * 100}%`;

  // Maps a custom tab bar label to the correct React Navigation tab name.
  // 'Lesson' is the Tab.Screen name we registered in App.js for LessonScreen.
  const handleTabPress = (label) => {
    if (label === 'Home')    navigation.navigate('Home');
    if (label === 'Learn')   navigation.navigate('Lesson');
    if (label === 'Profile') navigation.navigate('Profile');
    // Quiz and Journal are not yet registered as main tabs — no-op for now
  };

  return (
    // Same dark-green gradient used on every screen in the app
    <LinearGradient colors={['#0A2E1A', '#0D3B22']} style={styles.gradient}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>

        {/* ══════════════════════════════════════════════
            SECTION 1 — Top bar
            Three elements in a row:
              Left   → × close button
              Centre → thin progress bar (how far through the lesson)
              Right  → red hearts (lives) + lightning bolt XP counter
        ══════════════════════════════════════════════ */}
        <View style={styles.topBar}>

          {/* Close / exit button */}
          <TouchableOpacity style={styles.closeBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Home')}>
            <MaterialCommunityIcons name="close" size={20} color="#8FBC8F" />
          </TouchableOpacity>

          {/* Progress bar: outer track (dark) + inner fill (green) */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: progressPercent }]} />
          </View>

          {/* Lives and XP — displayed as a tight horizontal group */}
          <View style={styles.statusGroup}>
            {/* Render one heart icon per remaining life */}
            {Array.from({ length: LESSON.lives }).map((_, i) => (
              <MaterialCommunityIcons key={i} name="heart" size={17} color="#F44336" />
            ))}

            {/* XP pill: lightning bolt + number */}
            <View style={styles.xpPill}>
              <MaterialCommunityIcons name="lightning-bolt" size={13} color="#FFD600" />
              <Text style={styles.xpText}>{LESSON.xpEarned}</Text>
            </View>
          </View>

        </View>

        {/* ══════════════════════════════════════════════
            SECTION 2 — Scrollable lesson content
            Everything between the top bar and the
            Continue button can scroll on small screens
        ══════════════════════════════════════════════ */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* Small green "LESSON" category tag above the title */}
          <Text style={styles.lessonTag}>LESSON</Text>

          {/* Main lesson title — large and bold */}
          <Text style={styles.lessonTitle}>{LESSON.title}</Text>

          {/* ── Concept diagram card ──────────────────────────
              Visual showing the relationship between what you
              pay (the Premium) and what you lock in (Strike Price).
              Layout: [You Pay / Premium] › [Strike Price / $150]
              ─────────────────────────────────────────────── */}
          <View style={styles.diagramCard}>

            {/* Two info boxes connected by a right-arrow chevron */}
            <View style={styles.diagramRow}>

              {/* Left box — the cost side */}
              <View style={styles.diagramBox}>
                <Text style={styles.diagramBoxLabel}>You Pay</Text>
                <Text style={styles.diagramBoxGreen}>Premium</Text>
              </View>

              {/* Arrow between the two concepts */}
              <MaterialCommunityIcons name="chevron-right" size={22} color="#8FBC8F" />

              {/* Right box — the benefit side */}
              <View style={styles.diagramBox}>
                <Text style={styles.diagramBoxLabel}>Strike Price</Text>
                <Text style={styles.diagramBoxWhite}>$150</Text>
              </View>

            </View>

            {/* Contract-type label centred beneath the two boxes */}
            <Text style={styles.diagramFooter}>CALL OPTION</Text>
          </View>

          {/* ── Body explanation paragraph ───────────────────── */}
          <Text style={styles.bodyText}>{LESSON.body}</Text>

          {/* ── Tip box ─────────────────────────────────────────
              A highlighted hint with a yellow lightbulb icon.
              The icon and text sit side-by-side in a row.
              ─────────────────────────────────────────────── */}
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
            Pinned above the tab bar; full-width pill
            shape matching the onboarding "Get Started"
            button so the design stays consistent
        ══════════════════════════════════════════════ */}
        <View style={styles.continueSection}>
          <TouchableOpacity style={styles.continueBtn} activeOpacity={0.85} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>

        {/* ══════════════════════════════════════════════
            BOTTOM TAB BAR
            Sits outside the ScrollView so it never scrolls.
            Learn tab is highlighted green.
        ══════════════════════════════════════════════ */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity key={tab.label} style={styles.tabItem} activeOpacity={0.7} onPress={() => handleTabPress(tab.label)}>
              <MaterialCommunityIcons
                name={tab.icon}
                size={22}
                color={tab.active ? '#00E676' : 'rgba(255,255,255,0.45)'}
              />
              <Text style={[styles.tabLabel, tab.active && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // Full-screen gradient
  gradient: { flex: 1 },
  safeArea:  { flex: 1 },

  // ── Top bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 12,
  },
  closeBtn: {
    padding: 4, // extra tap area without changing visual size
  },

  // Thin pill track that spans all the space between the close button and the status group
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: '#00E676',
    borderRadius: 3,
  },

  // Heart icons + XP pill sit tightly together
  statusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginLeft: 4,
    gap: 3,
  },
  xpText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Scroll area ──
  scroll:        { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 16,
  },

  // Small uppercase tag above the title
  lessonTag: {
    color: '#4CAF50',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 8,
  },

  // Large bold lesson title
  lessonTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 34,
    marginBottom: 24,
  },

  // ── Concept diagram card ──
  diagramCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: 20,
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

  // Each of the two inner boxes (left: Premium, right: $150)
  diagramBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  // Small grey-green label above the value in each box
  diagramBoxLabel: {
    color: '#8FBC8F',
    fontSize: 11,
    marginBottom: 6,
  },
  // Green value — used for the cost/premium side
  diagramBoxGreen: {
    color: '#00E676',
    fontSize: 17,
    fontWeight: 'bold',
  },
  // White value — used for the strike price side
  diagramBoxWhite: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  // "CALL OPTION" caption centred below the two boxes
  diagramFooter: {
    color: '#4CAF50',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
  },

  // ── Body text ──
  bodyText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 25,
    marginBottom: 20,
  },

  // ── Tip box ──
  // Horizontal row: lightbulb icon on the left, tip text on the right
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  tipIcon: {
    marginTop: 1, // nudge icon down so it aligns with the first text line
  },
  tipText: {
    flex: 1,
    color: '#C8E6C9',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },

  // ── Continue button ──
  continueSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  continueBtn: {
    backgroundColor: '#00E676',
    borderRadius: 28,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
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
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  tabItem: {
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
  },
  tabLabelActive: {
    color: '#00E676',
    fontWeight: '600',
  },
});
