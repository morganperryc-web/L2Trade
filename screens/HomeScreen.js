import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// useFocusEffect re-runs its callback every time this screen comes into view —
// including when the user returns from LessonScreen after finishing a lesson.
import { useFocusEffect } from '@react-navigation/native';
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

export default function HomeScreen({ navigation }) {
  // ─── State ─────────────────────────────────────────────────────────────────
  const [profile,    setProfile]    = useState(null);  // xp_total, streak_count, track
  const [nextLesson, setNextLesson] = useState(null);  // next uncompleted lesson object
  const [todayDone,  setTodayDone]  = useState(false); // true if user already did a lesson today
  const [loading,    setLoading]    = useState(true);

  // ─── Data fetching ──────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user profile for XP and streak display
      const { data: prof, error: profErr } = await supabase
        .from('users')
        .select('track, xp_total, streak_count')
        .eq('id', user.id)
        .single();
      if (profErr) throw profErr;
      setProfile(prof);

      // Get IDs of every lesson this user has already completed
      const { data: completed } = await supabase
        .from('user_progress')
        .select('lesson_id, completed_at')
        .eq('user_id', user.id)
        .eq('completed', true);

      const completedIds = (completed || []).map(r => r.lesson_id);

      // Check if the user already finished a lesson today
      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);
      const doneToday = (completed || []).some(
        r => r.completed_at && new Date(r.completed_at) >= todayMidnight
      );
      setTodayDone(doneToday);

      // Find the next uncompleted lesson ordered by order_index.
      // NOTE: lessons.track stores module names ("M2 — Efficient Diversification")
      // which is different from users.track ("beginner"/"intermediate").
      // We intentionally do NOT filter by track here — all 130 lessons are shown
      // in order regardless of module. A difficulty/level filter can be added later
      // once the lessons table has a dedicated difficulty column populated.
      let query = supabase
        .from('lessons')
        .select('id, title, order_index, xp_reward, concept_cards, quiz_questions')
        .order('order_index', { ascending: true })
        .limit(1);

      if (completedIds.length > 0) {
        query = query.not('id', 'in', `(${completedIds.join(',')})`);
      }

      const { data: lessons, error: lessonErr } = await query;
      if (lessonErr) throw lessonErr;
      setNextLesson(lessons?.[0] ?? null);
    } catch (err) {
      console.error('HomeScreen fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch every time this screen gains focus.
  // This fires on first mount AND whenever the user navigates back here
  // (e.g. after completing a lesson), so the "next lesson" always updates.
  useFocusEffect(fetchData);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleStartLesson = () => {
    if (!nextLesson || todayDone) return;
    // Pass the full lesson object to LessonScreen so it can display
    // concept_cards and quiz_questions without making another DB call.
    navigation.navigate('Lesson', { lesson: nextLesson });
  };

  // ─── Derived display values ─────────────────────────────────────────────────
  const xpDisplay     = profile?.xp_total     ?? 0;
  const streakDisplay = profile?.streak_count  ?? 0;
  const lessonTitle   = loading
    ? 'Loading...'
    : nextLesson
      ? nextLesson.title
      : 'All lessons complete!';

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={BG} />

        {/* ── Header: app label + live XP and streak badges ── */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>OPTIQ</Text>
          <View style={styles.headerRight}>
            {/* Streak badge — real value from users table */}
            <View style={styles.badge}>
              <MaterialCommunityIcons name="fire" size={14} color="#FFD166" />
              <Text style={styles.badgeText}>{streakDisplay}</Text>
            </View>
            {/* XP badge — real value from users table */}
            <View style={styles.xpBadge}>
              <MaterialCommunityIcons name="bolt" size={14} color={GREEN} />
              <Text style={styles.xpText}>{xpDisplay} XP</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>

          {/* ── Daily goal card (static UI, lesson count wired in next sprint) ── */}
          <View style={styles.dailyGoalCard}>
            <View style={styles.dailyGoalHeader}>
              <Text style={styles.dailyGoalTitle}>DAILY GOAL</Text>
              <Text style={styles.dailyGoalCount}>{todayDone ? '1/1 done' : '0/1 lessons'}</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: todayDone ? '100%' : '0%' }]} />
            </View>
            <Text style={styles.dailyGoalSub}>
              {todayDone ? 'Great work! See you tomorrow.' : 'Complete your lesson to hit your daily goal'}
            </Text>
          </View>

          {/* ── Action tiles: Today's Lesson + Skill Quiz ── */}
          <View style={styles.actionRow}>

            {/* Today's Lesson tile — disabled with different message if already done today */}
            <TouchableOpacity
              style={[styles.largeTile, todayDone && styles.doneTile]}
              activeOpacity={todayDone ? 1 : 0.85}
              onPress={handleStartLesson}
              disabled={todayDone || loading || !nextLesson}
            >
              <View style={styles.tileIconWrap}>
                {loading ? (
                  <ActivityIndicator size="small" color={WHITE} />
                ) : todayDone ? (
                  <MaterialCommunityIcons name="check-circle" size={22} color={WHITE} />
                ) : (
                  <MaterialCommunityIcons name="book-open-page-variant" size={22} color={BG} />
                )}
              </View>
              <View style={styles.tileLabelBlock}>
                {/* Shows the real lesson title from Supabase */}
                <Text style={styles.tileTitle} numberOfLines={2}>
                  {todayDone ? 'Come back tomorrow' : lessonTitle}
                </Text>
                <Text style={styles.tileSubtitle}>
                  {todayDone ? 'Lesson complete ✓' : `${nextLesson?.xp_reward ?? 0} XP · ~5 min`}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Skill Quiz tile (not yet wired to quiz flow) */}
            <TouchableOpacity style={[styles.largeTile, styles.darkTile]} activeOpacity={0.85}>
              <View style={styles.tileIconWrapAlt}>
                <MaterialCommunityIcons name="bullseye" size={22} color={GREEN} />
              </View>
              <View>
                <Text style={[styles.tileTitle, styles.tileTitleAlt]}>Skill Quiz</Text>
                <Text style={styles.tileSubtitle}>Test your knowledge</Text>
              </View>
            </TouchableOpacity>

          </View>

          {/* ── Your Path — static for now, full dynamic wiring in next sprint ── */}
          <Text style={styles.sectionTitle}>Your Path</Text>
          <View style={styles.pathList}>
            {[
              { title: 'Options Basics', subtitle: 'Calls, puts, and how contracts work', progress: '0%', count: '' },
              { title: 'Strike Price & Expiration', subtitle: 'In-the-money, at-the-money, out-of-the-money', progress: '0%', count: '' },
              { title: 'Option Premium & Greeks', subtitle: 'Delta, theta, vega, and what they mean', progress: '0%', count: '' },
              { title: 'Strategies: Covered Calls', subtitle: 'Generate income from stocks you own', progress: '0%', count: '' },
            ].map((m, i) => (
              <View key={i} style={styles.pathCard}>
                <View style={styles.pathLeft}>
                  <View style={styles.pathIcon}>
                    <MaterialCommunityIcons
                      name={i === 0 ? 'book-open-outline' : i === 1 ? 'target' : 'chart-box-outline'}
                      size={18}
                      color={GREEN}
                    />
                  </View>
                </View>
                <View style={styles.pathRight}>
                  <View style={styles.pathTopRow}>
                    <Text style={styles.pathTitle}>{m.title}</Text>
                    <Text style={styles.pathCount}>{m.count}</Text>
                  </View>
                  <Text style={styles.pathSubtitle}>{m.subtitle}</Text>
                  <View style={styles.pathProgressTrack}>
                    <View style={[styles.pathProgressFill, { width: m.progress }]} />
                  </View>
                </View>
              </View>
            ))}
          </View>

        </ScrollView>

        {/* ── Bottom tab bar ── */}
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
            <MaterialCommunityIcons name="home" size={22} color={GREEN} />
            <Text style={styles.tabLabelActive}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.7} onPress={() => navigation.navigate('Lesson')}>
            <MaterialCommunityIcons name="book-open-variant" size={22} color={GREY} />
            <Text style={styles.tabLabel}>Learn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.7} onPress={() => navigation.navigate('Profile')}>
            <MaterialCommunityIcons name="account" size={22} color={GREY} />
            <Text style={styles.tabLabel}>Profile</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: BG },
  safeArea: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  appTitle: { color: WHITE, fontSize: 20, fontWeight: '800', letterSpacing: 0.6 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeText: { color: '#FFD166', marginLeft: 6, fontWeight: '700' },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  xpText: { color: GREEN, marginLeft: 6, fontWeight: '700' },

  content: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 10 },

  dailyGoalCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  dailyGoalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dailyGoalTitle: { color: LIGHT_GREY, fontWeight: '700', fontSize: 13, letterSpacing: 0.8 },
  dailyGoalCount: { color: GREEN, fontWeight: '700', fontSize: 13 },
  progressBarTrack: { height: 8, backgroundColor: BORDER, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: 8, backgroundColor: GREEN, borderRadius: 4 },
  dailyGoalSub: { color: GREY, marginTop: 8, fontSize: 12 },

  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  largeTile: {
    flex: 1,
    backgroundColor: GREEN,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  // Muted style shown when today's lesson is already complete
  doneTile: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
  },
  darkTile: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
  },
  tileIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tileIconWrapAlt: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: GREEN_TINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabelBlock: { flex: 1 },
  tileTitle: { color: WHITE, fontSize: 14, fontWeight: '700', lineHeight: 19 },
  tileTitleAlt: { color: WHITE },
  tileSubtitle: { color: LIGHT_GREY, fontSize: 11, marginTop: 3 },

  sectionTitle: { color: LIGHT_GREY, fontWeight: '700', fontSize: 13, letterSpacing: 0.8, marginBottom: 12 },

  pathList: { gap: 12, marginBottom: 24 },
  pathCard: {
    flexDirection: 'row',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  pathLeft: { paddingRight: 12 },
  pathIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: GREEN_TINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathRight: { flex: 1 },
  pathTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pathTitle: { color: WHITE, fontWeight: '700', fontSize: 15 },
  pathCount: { color: GREY, fontWeight: '600', fontSize: 13 },
  pathSubtitle: { color: GREY, fontSize: 13, marginTop: 4, marginBottom: 8, lineHeight: 18 },
  pathProgressTrack: { height: 6, backgroundColor: BORDER, borderRadius: 3, overflow: 'hidden' },
  pathProgressFill: { height: 6, backgroundColor: GREEN, borderRadius: 3 },

  tabBar: {
    height: 64,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: CARD_BG,
  },
  tabItem: { alignItems: 'center', gap: 4 },
  tabLabel: { color: GREY, fontSize: 11 },
  tabLabelActive: { color: GREEN, fontSize: 11, fontWeight: '700' },
});
