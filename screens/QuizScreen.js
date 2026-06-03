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

// Bottom tab bar — Quiz is the active tab on this screen.
// The active tab gets a special circular highlight behind its icon.
const TABS = [
  { icon: 'home',              label: 'Home',    active: false },
  { icon: 'book-open-variant', label: 'Learn',   active: false },
  { icon: 'bullseye',          label: 'Quiz',    active: true  },
  { icon: 'notebook-outline',  label: 'Journal', active: false },
  { icon: 'account',           label: 'Profile', active: false },
];

// ─── QuizScreen ───────────────────────────────────────────────────────────────
export default function QuizScreen() {
  return (
    // Same dark-green gradient as the onboarding and profile screens
    <LinearGradient colors={['#0A2E1A', '#0D3B22']} style={styles.gradient}>
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
            <TouchableOpacity style={styles.closeBtn} activeOpacity={0.7}>
              <MaterialCommunityIcons name="close" size={20} color="#8FBC8F" />
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
              >
                {/* Medal icon in a small rounded square on the left */}
                <View style={styles.topicIconBox}>
                  <MaterialCommunityIcons
                    name="medal-outline"
                    size={22}
                    color="#00E676"
                  />
                </View>

                {/* Topic name and short description in the centre */}
                <View style={styles.topicText}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicSubtitle}>{topic.subtitle}</Text>
                </View>

                {/* Right-pointing chevron arrow */}
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color="#4CAF50"
                />
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
              {/* Wrap the active icon in a circle highlight; others get no wrapper */}
              {tab.active ? (
                <View style={styles.activeTabIcon}>
                  <MaterialCommunityIcons name={tab.icon} size={22} color="#00E676" />
                </View>
              ) : (
                <MaterialCommunityIcons
                  name={tab.icon}
                  size={22}
                  color="rgba(255,255,255,0.45)"
                />
              )}
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

  // Full-screen gradient background
  gradient: { flex: 1 },
  safeArea: { flex: 1 },

  // ScrollView padding — left/right consistent with other screens, generous bottom gap
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },

  // ── Nav bar ──
  // Thin row at the top: × on the left, title text immediately after
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    gap: 10,
  },
  closeBtn: {
    padding: 4, // extra tap area without changing visual size
  },
  navTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // ── Page heading ──
  headingBlock: {
    marginBottom: 28,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  descriptor: {
    color: '#4CAF50',
    fontSize: 13,
    lineHeight: 20,
  },

  // ── Topic card list ──
  cardList: {
    gap: 12,
    marginBottom: 28,
  },

  // Individual topic card: semi-transparent lighter-green rectangle
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 16,
    padding: 16,
  },

  // Small rounded square that holds the medal icon
  topicIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  // Text column stretches to fill the space between icon and chevron
  topicText: {
    flex: 1,
  },
  topicTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  topicSubtitle: {
    color: '#8FBC8F',
    fontSize: 13,
  },

  // ── How it works info box ──
  // Same semi-transparent treatment as the topic cards but no tap state
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 14,
    padding: 16,
  },
  infoText: {
    color: '#8FBC8F',
    fontSize: 13,
    lineHeight: 21,
  },
  // Bold green prefix "How it works:" inside the same <Text>
  infoBold: {
    color: '#4CAF50',
    fontWeight: '700',
  },

  // ── Bottom tab bar ──
  // Sits outside the ScrollView so it never scrolls away
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(0,0,0,0.18)',
    height: 64,
    paddingBottom: 4,
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

  // Circle highlight behind the active Quiz icon
  activeTabIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0,230,118,0.45)',
    backgroundColor: 'rgba(0,230,118,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
