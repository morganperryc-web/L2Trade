// ─── Imports ─────────────────────────────────────────────────────────────────
import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../services/supabase';

// ─── Design tokens — matches OnboardingScreen ─────────────────────────────────
const GREEN      = '#00C853';
const GREEN_TINT = 'rgba(0, 200, 83, 0.15)';
const BG         = '#0A0E1A';
const CARD_BG    = '#131929';
const BORDER     = '#1E2A3D';
const WHITE      = '#FFFFFF';
const GREY       = '#6B7A8D';
const LIGHT_GREY = '#8A96A8';

// ─── Static data ──────────────────────────────────────────────────────────────
const WEEK_DATA = {
  values: [35, 52, 78, 62, 38, 65],
  labels: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

// Accuracy topics — bar colours kept as data-driven semantic colours
const TOPICS = [
  { name: 'Options Basics',    pct: 80, color: GREEN },
  { name: 'Pricing & Premium', pct: 60, color: '#FFC107' },
];

const STATS = [
  { icon: 'fire',              value: '7', label: 'Streak',  iconColor: '#FF7043' },
  { icon: 'book-open-variant', value: '5', label: 'Lessons', iconColor: GREEN     },
  { icon: 'bullseye',          value: '2', label: 'Quizzes', iconColor: GREEN     },
];

const TABS = [
  { icon: 'home',             label: 'Home',    active: false },
  { icon: 'book-open-variant',label: 'Learn',   active: false },
  { icon: 'bullseye',         label: 'Quiz',    active: false },
  { icon: 'notebook-outline', label: 'Journal', active: false },
  { icon: 'account',          label: 'Profile', active: true  },
];

// ─── SparkLine component ──────────────────────────────────────────────────────
// Draws a simple line chart using only React Native Views.
// Each segment between two data points is a thin View that is:
//   1. Sized to the exact pixel distance between the two points
//   2. Centred at the midpoint between those points
//   3. Rotated to the correct angle with transform: [{ rotate }]
// This avoids any SVG or third-party chart dependency.
function SparkLine({ values, labels }) {
  const [containerWidth, setContainerWidth] = useState(0);
  const CHART_HEIGHT = 72;
  const VERTICAL_PADDING = 10;
  const n = values.length;

  const dataMax = Math.max(...values);
  const dataMin = Math.min(...values);
  const dataRange = dataMax - dataMin || 1;

  const getPoint = (i) => ({
    x: n === 1 ? containerWidth / 2 : (i / (n - 1)) * containerWidth,
    y:
      CHART_HEIGHT -
      VERTICAL_PADDING -
      ((values[i] - dataMin) / dataRange) * (CHART_HEIGHT - VERTICAL_PADDING * 2),
  });

  return (
    <View>
      {/* Chart drawing area */}
      <View
        style={{ height: CHART_HEIGHT, position: 'relative' }}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        {containerWidth > 0 && (
          <>
            {/* Line segments between adjacent data points */}
            {values.map((_, i) => {
              if (i === n - 1) return null;
              const p1 = getPoint(i);
              const p2 = getPoint(i + 1);
              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;
              return (
                <View
                  key={`seg-${i}`}
                  style={{
                    position: 'absolute',
                    left: midX - length / 2,
                    top: midY - 1.5,
                    width: length,
                    height: 3,
                    backgroundColor: GREEN,
                    borderRadius: 2,
                    transform: [{ rotate: `${angleDeg}deg` }],
                  }}
                />
              );
            })}

            {/* Dots at each data point */}
            {values.map((_, i) => {
              const { x, y } = getPoint(i);
              return (
                <View
                  key={`dot-${i}`}
                  style={{
                    position: 'absolute',
                    left: x - 4,
                    top: y - 4,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: GREEN,
                  }}
                />
              );
            })}
          </>
        )}
      </View>

      {/* Day labels below the chart */}
      <View style={styles.chartLabels}>
        {labels.map((day) => (
          <Text key={day} style={styles.chartDay}>{day}</Text>
        ))}
      </View>
    </View>
  );
}

// ─── ProfileScreen ────────────────────────────────────────────────────────────
export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('username, track, xp_total, streak_count, longest_streak')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      setProfile(data);

      const { count, error: progressError } = await supabase
        .from('user_progress')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', true);
      if (progressError) throw progressError;
      setCompletedLessons(count ?? 0);
    } catch (err) {
      console.error('ProfileScreen fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(fetchProfile);

  const xpTotal = profile?.xp_total ?? 0;
  const level = Math.max(1, Math.floor(xpTotal / 500) + 1);
  const xpToNextLevel = Math.max(0, level * 500 - xpTotal);
  const username = profile?.username ?? 'Your Name';
  const track = profile?.track ?? 'Your Track';
  const stats = [
    { icon: 'fire', value: String(profile?.streak_count ?? 0), label: 'Streak', iconColor: '#FF7043' },
    { icon: 'book-open-variant', value: String(completedLessons), label: 'Lessons', iconColor: GREEN },
    { icon: 'bullseye', value: String(profile?.longest_streak ?? 0), label: 'Longest', iconColor: GREEN },
  ];

  const handleTabPress = (label) => {
    if (label === 'Home')    navigation.navigate('Home');
    if (label === 'Learn')   navigation.navigate('Lesson');
    if (label === 'Profile') navigation.navigate('Profile');
    // Quiz and Journal are not yet registered as main tabs — no-op for now
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    } catch (err) {
      console.error('ProfileScreen sign out error:', err.message);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading && !profile ? (
            <View style={styles.loadingCenter}>
              <ActivityIndicator size="large" color={GREEN} />
            </View>
          ) : (
            <>
              {/* ══════════════════════════════════════════════
              SECTION 1 — Profile header
              Avatar, title, quote, and three stats cards
          ══════════════════════════════════════════════ */}
          <View style={styles.header}>

            {/* Avatar circle on the left, title text on the right */}
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarLetter}>{username.charAt(0).toUpperCase()}</Text>
              </View>
              <View>
                <Text style={styles.yourTitle}>{track}</Text>
                <Text style={styles.titleName}>{username}</Text>
              </View>
            </View>

            {/* Quote shown in an inset card */}
            <View style={styles.quoteCard}>
              <Text style={styles.quoteText}>
                "Calculated, patient, and rarely wrong."
              </Text>
            </View>

            {/* Three stat cards in a horizontal row */}
            <View style={styles.statsRow}>
              {stats.map((s) => (
                <View key={s.label} style={styles.statCard}>
                  <MaterialCommunityIcons name={s.icon} size={18} color={s.iconColor} />
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

          </View>

          {/* ══════════════════════════════════════════════
              SECTION 2 — Content cards
              All cards share the same CARD_BG / BORDER style
          ══════════════════════════════════════════════ */}

          {/* ── XP progress card ── */}
          <View style={styles.card}>
            <View style={styles.xpRow}>
              <View style={styles.xpLeft}>
                <View style={styles.xpIconBox}>
                  <MaterialCommunityIcons name="lightning-bolt" size={18} color={GREEN} />
                </View>
                <View>
                  <Text style={styles.xpLabel}>Total XP</Text>
                  <Text style={styles.xpAmount}>{xpTotal} XP</Text>
                </View>
              </View>
              <View style={styles.xpRight}>
                <Text style={styles.levelLabel}>Level</Text>
                <Text style={styles.levelNumber}>{level}</Text>
              </View>
            </View>

            {/* Green progress bar — 85 % filled to show 340 / 400 XP */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '85%', backgroundColor: GREEN }]} />
            </View>
            <Text style={styles.xpNextLabel}>{profile ? `${xpToNextLevel} XP to Level ${level + 1}` : 'Loading...'}</Text>
          </View>

          {/* ── This Week activity chart card ── */}
          <View style={styles.card}>
            <Text style={styles.cardHeading}>THIS WEEK</Text>
            <SparkLine values={WEEK_DATA.values} labels={WEEK_DATA.labels} />
          </View>

          {/* ── Accuracy by Topic card ── */}
          <View style={styles.card}>
            <Text style={styles.cardHeading}>ACCURACY BY TOPIC</Text>
            {TOPICS.map((t) => (
              <View key={t.name} style={styles.topicBlock}>
                <View style={styles.topicHeaderRow}>
                  <Text style={styles.topicName}>{t.name}</Text>
                  <Text style={[styles.topicPct, { color: t.color }]}>{t.pct}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${t.pct}%`, backgroundColor: t.color },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* ── Badges card ── */}
          <View style={styles.card}>
            <View style={styles.badgesHeader}>
              <Text style={styles.badgesTitle}>BADGES — 3/8</Text>
              <TouchableOpacity style={styles.allBtn} activeOpacity={0.7}>
                <Text style={styles.allBtnText}>All</Text>
                <MaterialCommunityIcons name="chevron-down" size={16} color={GREY} />
              </TouchableOpacity>
            </View>

            {/* Eight badge slots: first 3 earned (green star), rest locked */}
            <View style={styles.badgeGrid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <View
                  key={i}
                  style={[styles.badgeSlot, i >= 3 && styles.badgeSlotLocked]}
                >
                  <MaterialCommunityIcons
                    name={i < 3 ? 'star' : 'lock-outline'}
                    size={22}
                    color={i < 3 ? GREEN : GREY}
                  />
                </View>
              ))}
            </View>
          </View>
          </>) }

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.8}>
            <Text style={styles.signOutText}>Log Out</Text>
          </TouchableOpacity>

        </ScrollView>

        {/* ══════════════════════════════════════════════
            BOTTOM TAB BAR — always visible at the foot
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

  screen:        { flex: 1, backgroundColor: BG },
  safeArea:      { flex: 1 },
  scroll:        { flex: 1 },
  scrollContent: { paddingBottom: 16 },

  // ── Profile header ──
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: BG,
    fontSize: 22,
    fontWeight: '800',
  },
  yourTitle: {
    color: LIGHT_GREY,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  titleName: {
    color: WHITE,
    fontSize: 22,
    fontWeight: '800',
  },
  quoteCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  quoteText: {
    color: LIGHT_GREY,
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: WHITE,
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    color: GREY,
    fontSize: 11,
  },

  // ── Content cards (shared style matching OnboardingScreen cards) ──
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 24,
    marginBottom: 14,
  },

  // ── XP card ──
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  xpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  xpIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: GREEN_TINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpLabel: {
    color: GREY,
    fontSize: 12,
    marginBottom: 2,
  },
  xpAmount: {
    color: WHITE,
    fontSize: 18,
    fontWeight: '700',
  },
  xpRight: { alignItems: 'flex-end' },
  levelLabel: {
    color: GREY,
    fontSize: 12,
  },
  levelNumber: {
    color: WHITE,
    fontSize: 24,
    fontWeight: '800',
  },
  progressTrack: {
    height: 8,
    backgroundColor: BORDER,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  xpNextLabel: {
    color: GREY,
    fontSize: 12,
  },

  signOutButton: {
    marginTop: 12,
    marginHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  signOutText: {
    color: '#FF6B6B',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Shared card heading (e.g. "THIS WEEK") ──
  cardHeading: {
    color: GREEN,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 14,
  },

  // ── Chart labels ──
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  chartDay: {
    color: GREY,
    fontSize: 12,
    textAlign: 'center',
  },

  // ── Accuracy topic rows ──
  topicBlock: { marginBottom: 14 },
  topicHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  topicName: {
    color: WHITE,
    fontWeight: '600',
    fontSize: 14,
  },
  topicPct: {
    fontWeight: '700',
    fontSize: 14,
  },

  loadingCenter: {
    minHeight: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Badges card ──
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  badgesTitle: {
    color: WHITE,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  allBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  allBtnText: {
    color: GREY,
    fontSize: 13,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeSlot: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: GREEN_TINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSlotLocked: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
  },

  // ── Bottom tab bar ──
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    height: 64,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  tabItem: {
    alignItems: 'center',
    gap: 3,
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
