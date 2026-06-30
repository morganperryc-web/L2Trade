// ─── Imports ─────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../services/supabase';

// ─── Design tokens ────────────────────────────────────────────────────────────
const GREEN      = '#00C853';
const GREEN_TINT = 'rgba(0, 200, 83, 0.15)';
const BG         = '#0A0E1A';
const CARD_BG    = '#131929';
const BORDER     = '#1E2A3D';
const WHITE      = '#FFFFFF';
const GREY       = '#6B7A8D';
const LIGHT_GREY = '#8A96A8';
const RED_TINT   = 'rgba(244, 67, 54, 0.15)';
const RED        = '#F44336';

// Bottom navigation tabs
const TABS = [
  { icon: 'home',              label: 'Home',    active: false },
  { icon: 'book-open-variant', label: 'Learn',   active: true  },
  { icon: 'bullseye',          label: 'Quiz',    active: false },
  { icon: 'notebook-outline',  label: 'Journal', active: false },
  { icon: 'account',           label: 'Profile', active: false },
];

// ─── LessonScreen ─────────────────────────────────────────────────────────────
// Receives a full lesson object from HomeScreen via route.params.lesson.
// Lesson shape: { id, title, xp_reward, concept_cards: [], quiz_questions: [] }
//
// concept_cards items:  { title, explanation, image_url }
// quiz_questions items: { question, options: [], correct_answer, explanation }
//
// Flow: step through all concept_cards → then all quiz_questions → save + go home
export default function LessonScreen({ navigation, route }) {
  // The lesson passed from HomeScreen — fall back to an empty shell if missing
  const lesson = route.params?.lesson ?? null;

  const conceptCards  = lesson?.concept_cards  || [];
  const quizQuestions = lesson?.quiz_questions || [];
  const totalSteps    = conceptCards.length + quizQuestions.length;

  // ─── Step state ────────────────────────────────────────────────────────────
  // currentStep is a single index across both phases:
  //   0 … conceptCards.length-1  → concept phase
  //   conceptCards.length …      → quiz phase
  const [currentStep,    setCurrentStep]    = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);  // user's chosen option
  const [answered,       setAnswered]       = useState(false); // locked in after tap
  const [correctCount,   setCorrectCount]   = useState(0);     // running quiz score
  const [saving,         setSaving]         = useState(false); // true while writing to Supabase

  // ─── Derived values ────────────────────────────────────────────────────────
  const isConceptPhase = currentStep < conceptCards.length;
  const quizIndex      = currentStep - conceptCards.length;

  const currentCard     = isConceptPhase ? conceptCards[currentStep] : null;
  const currentQuestion = !isConceptPhase ? quizQuestions[quizIndex] : null;

  const isLastStep = totalSteps > 0 && currentStep === totalSteps - 1;

  // Progress bar fills proportionally to how far through all steps the user is
  const progressPercent = totalSteps > 0
    ? `${Math.round(((currentStep + 1) / totalSteps) * 100)}%`
    : '100%';

  // XP reward for this lesson; this is what we save when the lesson completes.
  const xpEarned = lesson?.xp_reward ?? 50;

  // ─── Answer selection ──────────────────────────────────────────────────────
  const handleAnswerSelect = (option) => {
    if (answered) return; // prevent changing answer after submitting
    setSelectedAnswer(option);
    setAnswered(true);
    if (option === currentQuestion?.correct_answer) {
      setCorrectCount(prev => prev + 1);
    }
  };

  // ─── Advance to next step or complete ─────────────────────────────────────
  const handleNext = async () => {
    // In the quiz phase the user must select an answer before advancing
    if (!isConceptPhase && !answered) return;

    if (isLastStep) {
      await handleComplete();
      return;
    }

    setCurrentStep(prev => prev + 1);
    setSelectedAnswer(null);
    setAnswered(false);
  };

  // ─── Save progress and return home ────────────────────────────────────────
  const handleComplete = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !lesson) {
        navigation.navigate('Home');
        return;
      }

      const { error: progressError } = await supabase.from('user_progress').insert({
        user_id:      user.id,
        lesson_id:    lesson.id,
        completed:    true,
        xp_earned:    xpEarned,
        completed_at: new Date().toISOString(),
      });

      if (progressError) {
        throw progressError;
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('xp_total, streak_count, longest_streak, last_lesson_date')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      const updatedXpTotal = (profile?.xp_total ?? 0) + xpEarned;
      const today = new Date();
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const lastLessonDate = profile?.last_lesson_date ? new Date(profile.last_lesson_date) : null;

      const isSameLocalDate = (dateA, dateB) =>
        dateA && dateB &&
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate();

      const isYesterdayLocal = (dateA, dateB) => {
        if (!dateA || !dateB) return false;
        const yesterday = new Date(dateB);
        yesterday.setDate(yesterday.getDate() - 1);
        return isSameLocalDate(dateA, yesterday);
      };

      let newStreakCount = 1;
      if (lastLessonDate && isSameLocalDate(lastLessonDate, todayDate)) {
        newStreakCount = profile?.streak_count ?? 1;
      } else if (lastLessonDate && isYesterdayLocal(lastLessonDate, todayDate)) {
        newStreakCount = (profile?.streak_count ?? 0) + 1;
      } else {
        newStreakCount = 1;
      }

      const updatedLongestStreak = Math.max(profile?.longest_streak ?? 0, newStreakCount);
      const todayDateString = todayDate.toISOString().split('T')[0];

      const { error: updateError } = await supabase
        .from('users')
        .update({
          xp_total:        updatedXpTotal,
          streak_count:    newStreakCount,
          longest_streak:  updatedLongestStreak,
          last_lesson_date: todayDateString,
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      navigation.navigate('Home');
    } catch (err) {
      console.error('LessonScreen complete error:', err.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Tab bar helper ────────────────────────────────────────────────────────
  const handleTabPress = (label) => {
    if (label === 'Home')    navigation.navigate('Home');
    if (label === 'Learn')   navigation.navigate('Lesson');
    if (label === 'Profile') navigation.navigate('Profile');
  };

  // ─── Fallback: no lesson passed (user opened Learn tab directly) ──────────
  if (!lesson) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: LIGHT_GREY, fontSize: 15 }}>
          Tap a lesson from the Home screen to start.
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ marginTop: 24 }}>
          <Text style={{ color: GREEN, fontWeight: '700' }}>← Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Button label changes on the last step ─────────────────────────────────
  const continueLabel = saving
    ? 'Saving…'
    : isLastStep
      ? `Complete  +${xpEarned} XP`
      : 'Next  →';

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>

        {/* ══════════════════════════════════════════════
            TOP BAR — close | progress | lives + XP
        ══════════════════════════════════════════════ */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.closeBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Home')}>
            <MaterialCommunityIcons name="close" size={20} color={LIGHT_GREY} />
          </TouchableOpacity>

          {/* Progress bar: fills as the user advances through all steps */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: progressPercent }]} />
          </View>

          {/* XP pill shows how much XP the user will earn for this lesson */}
          <View style={styles.xpPill}>
            <MaterialCommunityIcons name="lightning-bolt" size={13} color="#FFD600" />
            <Text style={styles.xpText}>{xpEarned}</Text>
          </View>
        </View>

        {/* ══════════════════════════════════════════════
            SCROLLABLE CONTENT
            Shows either a concept card or a quiz question
            depending on which phase the user is in.
        ══════════════════════════════════════════════ */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          // Reset scroll position to top each time the step changes
          key={currentStep}
        >
          {/* Phase tag + lesson title (shown throughout) */}
          <Text style={styles.lessonTag}>
            {isConceptPhase ? 'LESSON' : 'QUIZ'}
          </Text>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>

          {/* ── CONCEPT PHASE — card with title and explanation ── */}
          {isConceptPhase && currentCard && (
            <>
              {/* Card title in a styled inset card */}
              <View style={styles.conceptCard}>
                <Text style={styles.conceptCardTitle}>{currentCard.title}</Text>
              </View>

              {/* Explanation as the main body text */}
              <Text style={styles.bodyText}>{currentCard.explanation}</Text>

              {/* Step counter e.g. "Card 2 of 4" */}
              <Text style={styles.stepCounter}>
                Card {currentStep + 1} of {conceptCards.length}
              </Text>
            </>
          )}

          {/* ── QUIZ PHASE — question + selectable options + feedback ── */}
          {!isConceptPhase && currentQuestion && (
            <>
              {/* The question text */}
              <Text style={styles.questionText}>{currentQuestion.question}</Text>

              {/* Answer options — each is a tappable card */}
              <View style={styles.optionsList}>
                {(currentQuestion.options || []).map((option, i) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect  = option === currentQuestion.correct_answer;

                  // After answering: green border for correct, red for wrong selected
                  let optionStyle = styles.optionCard;
                  if (answered && isCorrect)             optionStyle = styles.optionCorrect;
                  if (answered && isSelected && !isCorrect) optionStyle = styles.optionWrong;

                  return (
                    <TouchableOpacity
                      key={i}
                      style={optionStyle}
                      activeOpacity={0.75}
                      onPress={() => handleAnswerSelect(option)}
                      disabled={answered}
                    >
                      <Text style={[
                        styles.optionText,
                        answered && isCorrect  && styles.optionTextCorrect,
                        answered && isSelected && !isCorrect && styles.optionTextWrong,
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Explanation shown after the user locks in an answer */}
              {answered && (
                <View style={styles.feedbackBox}>
                  <MaterialCommunityIcons
                    name="lightbulb-outline"
                    size={16}
                    color="#FFD600"
                    style={{ marginTop: 1 }}
                  />
                  <Text style={styles.feedbackText}>{currentQuestion.explanation}</Text>
                </View>
              )}

              {/* Step counter e.g. "Question 1 of 3" */}
              <Text style={styles.stepCounter}>
                Question {quizIndex + 1} of {quizQuestions.length}
              </Text>
            </>
          )}
        </ScrollView>

        {/* ══════════════════════════════════════════════
            CONTINUE / NEXT / COMPLETE BUTTON
            In quiz phase the button is dimmed until an answer is selected.
        ══════════════════════════════════════════════ */}
        <View style={styles.continueSection}>
          <TouchableOpacity
            style={[
              styles.continueBtn,
              // Dim the button if in quiz phase and no answer selected yet
              (!isConceptPhase && !answered) && styles.continueBtnDisabled,
            ]}
            activeOpacity={0.85}
            onPress={handleNext}
            disabled={saving || (!isConceptPhase && !answered)}
          >
            {saving
              ? <ActivityIndicator color={WHITE} />
              : <Text style={styles.continueBtnText}>{continueLabel}</Text>
            }
          </TouchableOpacity>
        </View>

        {/* ── Bottom tab bar ── */}
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

  screen:   { flex: 1, backgroundColor: BG },
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
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
    gap: 3,
  },
  xpText: { color: WHITE, fontSize: 12, fontWeight: '600' },

  // ── Scroll area ──
  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 6, paddingBottom: 16 },

  lessonTag: {
    color: GREEN,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  lessonTitle: {
    color: WHITE,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 24,
  },

  // ── Concept card ──
  conceptCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  conceptCardTitle: {
    color: GREEN,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  bodyText: {
    color: WHITE,
    fontSize: 15,
    lineHeight: 25,
    marginBottom: 16,
  },

  stepCounter: {
    color: GREY,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },

  // ── Quiz question ──
  questionText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    marginBottom: 20,
  },

  optionsList: { gap: 10, marginBottom: 16 },

  // Default option card
  optionCard: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  // Correct answer — green highlight
  optionCorrect: {
    backgroundColor: GREEN_TINT,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: GREEN,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  // Wrong answer the user selected — red highlight
  optionWrong: {
    backgroundColor: RED_TINT,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: RED,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  optionText:        { color: WHITE,  fontSize: 15 },
  optionTextCorrect: { color: GREEN,  fontWeight: '700' },
  optionTextWrong:   { color: RED,    fontWeight: '700' },

  // Explanation shown after answering
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
  feedbackText: {
    flex: 1,
    color: LIGHT_GREY,
    fontSize: 13,
    lineHeight: 20,
  },

  // ── Continue button ──
  continueSection: { paddingHorizontal: 24, paddingVertical: 12 },
  continueBtn: {
    backgroundColor: GREEN,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnDisabled: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
  },
  continueBtnText: { color: WHITE, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },

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
  tabItem:        { alignItems: 'center', gap: 4 },
  tabLabel:       { fontSize: 11, color: GREY },
  tabLabelActive: { color: GREEN, fontWeight: '600' },
});
