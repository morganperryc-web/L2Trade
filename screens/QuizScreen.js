// ─── Imports ─────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
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

// ─── Quiz questions ──────────────────────────────────────────────────────────
// The user's answers are saved to the users table for profile analytics.
// Q1 answer determines the track: beginner or intermediate.
const QUESTIONS = [
  {
    id: 'experience',
    question: 'How long have you been investing?',
    options: [
      { label: 'Never started', trackValue: 'beginner' },
      { label: 'Under 1 year', trackValue: 'beginner' },
      { label: '1–3 years', trackValue: 'intermediate' },
      { label: '3+ years', trackValue: 'intermediate' },
    ],
  },
  {
    id: 'goal',
    question: "What's your main goal?",
    options: [
      { label: 'Learn trading basics' },
      { label: 'Build a strategy' },
      { label: 'Earn passive income' },
      { label: 'Test my skills' },
    ],
  },
  {
    id: 'commitment',
    question: 'How much time can you commit weekly?',
    options: [
      { label: 'Under 2 hours' },
      { label: '2–5 hours' },
      { label: '5–10 hours' },
      { label: '10+ hours' },
    ],
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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const question = QUESTIONS[currentQuestion];
  const answered = answers[question.id];

  // Handle option selection and advance to next question or signup
  const handleSelectOption = (option) => {
    const newAnswers = { ...answers, [question.id]: option.label };
    setAnswers(newAnswers);

    // If this is the last question, navigate to SignUp with answers and determined track
    if (currentQuestion === QUESTIONS.length - 1) {
      // Determine track from Q1 answer
      const firstQuestion = QUESTIONS[0];
      const q1Answer = newAnswers[firstQuestion.id];
      const selectedOption = firstQuestion.options.find(o => o.label === q1Answer);
      const track = selectedOption?.trackValue || 'beginner';

      navigation.navigate('SignUp', { track, quiz_answers: newAnswers });
    } else {
      // Advance to next question
      setCurrentQuestion(prev => prev + 1);
    }
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
          ══════════════════════════════════════════════ */}
          <View style={styles.navBar}>
            <TouchableOpacity style={styles.closeBtn} activeOpacity={0.7} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="close" size={20} color={LIGHT_GREY} />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Getting to know you</Text>
            <Text style={styles.stepCounter}>{currentQuestion + 1}/{QUESTIONS.length}</Text>
          </View>

          {/* ══════════════════════════════════════════════
              SECTION 2 — Progress bar
          ══════════════════════════════════════════════ */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }]} />
          </View>

          {/* ══════════════════════════════════════════════
              SECTION 3 — Current question
          ══════════════════════════════════════════════ */}
          <View style={styles.headingBlock}>
            <Text style={styles.heading}>{question.question}</Text>
          </View>

          {/* ══════════════════════════════════════════════
              SECTION 4 — Answer options
          ══════════════════════════════════════════════ */}
          <View style={styles.optionsList}>
            {question.options.map((option, i) => {
              const isSelected = answered === option.label;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  activeOpacity={0.75}
                  onPress={() => handleSelectOption(option)}
                >
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <MaterialCommunityIcons name="check" size={18} color={GREEN} />
                    </View>
                  )}
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10,
  },
  closeBtn: { padding: 4 },
  navTitle: {
    flex: 1,
    color: WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  stepCounter: {
    color: GREY,
    fontSize: 14,
  },

  // ── Progress bar ──
  progressTrack: {
    height: 4,
    backgroundColor: CARD_BG,
    borderRadius: 2,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: GREEN,
  },

  // ── Page heading ──
  headingBlock: { marginBottom: 28 },
  heading: {
    color: WHITE,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  // ── Options list ──
  optionsList: {
    gap: 12,
    marginBottom: 28,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  optionCardSelected: {
    borderColor: GREEN,
    backgroundColor: GREEN_TINT,
  },
  checkmark: {
    marginRight: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: GREEN_TINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
    color: LIGHT_GREY,
    fontSize: 15,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: WHITE,
    fontWeight: '600',
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

