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
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Design tokens — matches OnboardingScreen ─────────────────────────────────
const GREEN      = '#00C853';
const GREEN_TINT = 'rgba(0, 200, 83, 0.15)';
const BG         = '#0A0E1A';
const CARD_BG    = '#131929';
const BORDER     = '#1E2A3D';
const WHITE      = '#FFFFFF';
const GREY       = '#6B7A8D';
const LIGHT_GREY = '#8A96A8';

// ─── Quiz topic data ──────────────────────────────────────────────────────────
// Each object becomes one tappable row card. Add more topics here when needed.
const TOPICS = [
  {
    id: 'options-basics',
    title: 'Options Basics',
    subtitle: 'Calls, puts, contracts',
  },
  {
    id: 'pricing-premium',
    title: 'Pricing & Premium',
    subtitle: 'How options are valued',
  },
  {
    id: 'strategies',
    title: 'Strategies',
    subtitle: 'Common trade setups',
  },
];

// Bottom tab bar — Quiz is the active tab on this screen
const TABS = [
  { icon: 'home',              label: 'Home',    active: false },
  { icon: 'book-open-variant', label: 'Learn',   active: false },
  { icon: 'bullseye',          label: 'Quiz',    active: true  },
  { icon: 'notebook-outline',  label: 'Journal', active: false },
  { icon: 'account',           label: 'Profile', active: false },
];

// ─── QuizScreen ───────────────────────────────────────────────────────────────
export default function QuizScreen({ navigation }) {
  // Tapping any topic card counts as completing the quiz.
  // Marks onboarding done in storage and resets the navigation stack to Main
  // so the user can never press back into the onboarding flow.
  const handleTopicSelect = async () => {
    await AsyncStorage.setItem('@onboarding_complete', 'true');
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>

        {/* ScrollView lets the content scroll on smaller devices */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* ══════════════════════════════════════════════
              SECTION 1 — Top navigation bar
              × close button on the left, screen title next to it
          ══════════════════════════════════════════════ */}
          <View style={styles.navBar}>
            <TouchableOpacity style={styles.closeBtn} activeOpacity={0.7} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="close" size={20} color={LIGHT_GREY} />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Skill Quiz</Text>
          </View>

          {/* ══════════════════════════════════════════════
              SECTION 2 — Page heading and descriptor line
          ══════════════════════════════════════════════ */}
          <View style={styles.headingBlock}>
            <Text style={styles.heading}>Choose a Topic</Text>
            <Text style={styles.descriptor}>
              5 questions · 20 seconds each · Test your knowledge
            </Text>
          </View>

          {/* ══════════════════════════════════════════════
              SECTION 3 — Topic cards
              One tappable card per quiz topic.
              Layout: medal icon | title + subtitle | chevron
          ══════════════════════════════════════════════ */}
          <View style={styles.cardList}>
            {TOPICS.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={styles.topicCard}
                activeOpacity={0.75}
                onPress={handleTopicSelect}
              >
                {/* Medal icon in a small rounded square on the left */}
                <View style={styles.topicIconBox}>
                  <MaterialCommunityIcons name="medal-outline" size={22} color={GREEN} />
                </View>

                {/* Topic name and short description in the centre */}
                <View style={styles.topicText}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicSubtitle}>{topic.subtitle}</Text>
                </View>

                {/* Right-pointing chevron arrow */}
                <MaterialCommunityIcons name="chevron-right" size={22} color={GREEN} />
              </TouchableOpacity>
            ))}
          </View>

          {/* ══════════════════════════════════════════════
              SECTION 4 — "How it works" info box
              Explains the quiz rules in a subtle inset card.
              "How it works:" is bold green; the rest is muted.
          ══════════════════════════════════════════════ */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>How it works: </Text>
              Answer 5 multiple-choice questions. Each correct answer earns 20 XP.
              You have 20 seconds per question — the timer resets between questions.
            </Text>
          </View>

        </ScrollView>

        {/* ══════════════════════════════════════════════
            BOTTOM TAB BAR — pinned below the scroll area.
            The active "Quiz" tab has a circular highlight
            ring around its icon to make it stand out.
        ══════════════════════════════════════════════ */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity key={tab.label} style={styles.tabItem} activeOpacity={0.7}>
              {/* Wrap the active icon in a circle highlight; others render directly */}
              {tab.active ? (
                <View style={styles.activeTabIcon}>
                  <MaterialCommunityIcons name={tab.icon} size={22} color={GREEN} />
                </View>
              ) : (
                <MaterialCommunityIcons name={tab.icon} size={22} color={GREY} />
              )}
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

  screen:   { flex: 1, backgroundColor: BG },
  safeArea: { flex: 1 },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },

  // ── Nav bar ──
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    gap: 10,
  },
  closeBtn: { padding: 4 },
  navTitle: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '600',
  },

  // ── Page heading ──
  headingBlock: { marginBottom: 28 },
  heading: {
    color: WHITE,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  descriptor: {
    color: LIGHT_GREY,
    fontSize: 14,
    lineHeight: 20,
  },

  // ── Topic card list ──
  cardList: {
    gap: 12,
    marginBottom: 28,
  },

  // Dark background, border, rounded corners — matches OnboardingScreen card
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  // Green-tinted icon bubble — matches OnboardingScreen iconBubble
  topicIconBox: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: GREEN_TINT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  topicText: { flex: 1 },
  topicTitle: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  topicSubtitle: {
    color: GREY,
    fontSize: 13,
    lineHeight: 18,
  },

  // ── Info box — same card treatment as topic cards ──
  infoBox: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  infoText: {
    color: LIGHT_GREY,
    fontSize: 13,
    lineHeight: 21,
  },
  infoBold: {
    color: GREEN,
    fontWeight: '700',
  },

  // ── Bottom tab bar ──
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: CARD_BG,
    height: 64,
    paddingBottom: 4,
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

  // Circle highlight behind the active Quiz icon
  activeTabIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: GREEN,
    backgroundColor: GREEN_TINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
