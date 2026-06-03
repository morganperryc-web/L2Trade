// ─── Imports ─────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// ─── Static data ──────────────────────────────────────────────────────────────
// Weekly activity values on a 0–100 scale, matching the chart in the screenshot
const WEEK_DATA = {
  values: [35, 52, 78, 62, 38, 65],
  labels: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

// Accuracy topics — each has a name, percentage, and bar colour
const TOPICS = [
  { name: 'Options Basics',    pct: 80, color: '#00C853' },
  { name: 'Pricing & Premium', pct: 60, color: '#FFC107' },
];

// Stats shown beneath the quote card
const STATS = [
  { icon: 'fire',              value: '7', label: 'Streak',  iconColor: '#FF7043' },
  { icon: 'book-open-variant', value: '5', label: 'Lessons', iconColor: '#00E676' },
  { icon: 'bullseye',          value: '2', label: 'Quizzes', iconColor: '#00E676' },
];

// Bottom tab bar items — Profile is the active one on this screen
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
  const VERTICAL_PADDING = 10; // keeps dots away from the very top and bottom edges
  const n = values.length;

  const dataMax = Math.max(...values);
  const dataMin = Math.min(...values);
  const dataRange = dataMax - dataMin || 1;

  // Convert a data index to a pixel (x, y) coordinate inside the container
  const getPoint = (i) => ({
    x: n === 1 ? containerWidth / 2 : (i / (n - 1)) * containerWidth,
    y:
      CHART_HEIGHT -
      VERTICAL_PADDING -
      ((values[i] - dataMin) / dataRange) * (CHART_HEIGHT - VERTICAL_PADDING * 2),
  });

  return (
    <View>
      {/* Chart drawing area — onLayout tells us the real pixel width at runtime */}
      <View
        style={{ height: CHART_HEIGHT, position: 'relative' }}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        {containerWidth > 0 && (
          <>
            {/* Line segments between adjacent data points */}
            {values.map((_, i) => {
              if (i === n - 1) return null; // no segment after the last point
              const p1 = getPoint(i);
              const p2 = getPoint(i + 1);
              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
              // Centre the View at the midpoint so rotation lands on p1→p2
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;
              return (
                <View
                  key={`seg-${i}`}
                  style={{
                    position: 'absolute',
                    left: midX - length / 2,
                    top: midY - 1.5,  // 1.5 = half of height (3px)
                    width: length,
                    height: 3,
                    backgroundColor: '#00C853',
                    borderRadius: 2,
                    transform: [{ rotate: `${angleDeg}deg` }],
                  }}
                />
              );
            })}

            {/* Dots at each data point, rendered on top of the lines */}
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
                    backgroundColor: '#00C853',
                  }}
                />
              );
            })}
          </>
        )}
      </View>

      {/* Day labels below the chart, evenly spaced to match the dots */}
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
  // Maps a custom tab bar label to the correct React Navigation tab name
  const handleTabPress = (label) => {
    if (label === 'Home')    navigation.navigate('Home');
    if (label === 'Learn')   navigation.navigate('Lesson');
    if (label === 'Profile') navigation.navigate('Profile');
    // Quiz and Journal are not yet registered as main tabs — no-op for now
  };

  return (
    // Full-screen dark-green gradient — same colours as the onboarding screen
    <LinearGradient colors={['#0A2E1A', '#0D3B22']} style={styles.gradient}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* ══════════════════════════════════════════════
              SECTION 1 — Dark-green header
              Avatar, title, quote, and three stats cards
          ══════════════════════════════════════════════ */}
          <View style={styles.header}>

            {/* Avatar circle on the left, title text on the right */}
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarLetter}>C</Text>
              </View>
              <View>
                <Text style={styles.yourTitle}>YOUR TITLE</Text>
                <Text style={styles.titleName}>The Strategist</Text>
              </View>
            </View>

            {/* Quote shown in a slightly darker inset card */}
            <View style={styles.quoteCard}>
              <Text style={styles.quoteText}>
                "Calculated, patient, and rarely wrong."
              </Text>
            </View>

            {/* Three stat cards in a horizontal row */}
            <View style={styles.statsRow}>
              {STATS.map((s) => (
                <View key={s.label} style={styles.statCard}>
                  <MaterialCommunityIcons name={s.icon} size={18} color={s.iconColor} />
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

          </View>

          {/* ══════════════════════════════════════════════
              SECTION 2 — Light sheet
              White/light-grey panel that slides up over the header.
              Each card inside sits on the sheet background.
          ══════════════════════════════════════════════ */}
          <View style={styles.sheet}>

            {/* ── XP progress card ── */}
            <View style={styles.card}>
              {/* Top row: icon + XP total (left) and level number (right) */}
              <View style={styles.xpRow}>
                <View style={styles.xpLeft}>
                  <View style={styles.xpIconBox}>
                    <MaterialCommunityIcons name="lightning-bolt" size={18} color="#1B5E20" />
                  </View>
                  <View>
                    <Text style={styles.xpLabel}>Total XP</Text>
                    <Text style={styles.xpAmount}>340 XP</Text>
                  </View>
                </View>
                <View style={styles.xpRight}>
                  <Text style={styles.levelLabel}>Level</Text>
                  <Text style={styles.levelNumber}>4</Text>
                </View>
              </View>

              {/* Green progress bar — 85 % filled to show 340 / 400 XP */}
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: '85%', backgroundColor: '#00C853' }]} />
              </View>
              <Text style={styles.xpNextLabel}>60 XP to Level 5</Text>
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
                  <MaterialCommunityIcons name="chevron-down" size={16} color="#555" />
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
                      color={i < 3 ? '#00C853' : '#BDBDBD'}
                    />
                  </View>
                ))}
              </View>
            </View>

          </View>
        </ScrollView>

        {/* ══════════════════════════════════════════════
            BOTTOM TAB BAR — always visible at the foot
            Profile tab is highlighted in teal
        ══════════════════════════════════════════════ */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity key={tab.label} style={styles.tabItem} activeOpacity={0.7} onPress={() => handleTabPress(tab.label)}>
              <MaterialCommunityIcons
                name={tab.icon}
                size={22}
                color={tab.active ? '#00897B' : '#9E9E9E'}
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

  // Full-screen gradient container
  gradient:  { flex: 1 },
  safeArea:  { flex: 1 },
  scroll:    { flex: 1 },
  scrollContent: { paddingBottom: 16 },

  // ── Header (dark green) ──
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
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
    backgroundColor: '#00897B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  yourTitle: {
    color: '#8FBC8F',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  titleName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  quoteCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.20)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  quoteText: {
    color: '#D4EDDA',
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
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#8FBC8F',
    fontSize: 11,
  },

  // ── Light sheet ──
  sheet: {
    backgroundColor: '#F2F5F2',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 14,
  },

  // White card on the light sheet
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
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
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpLabel: {
    color: '#9E9E9E',
    fontSize: 12,
    marginBottom: 2,
  },
  xpAmount: {
    color: '#1A2E1A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  xpRight: {
    alignItems: 'flex-end',
  },
  levelLabel: {
    color: '#9E9E9E',
    fontSize: 12,
  },
  levelNumber: {
    color: '#1A2E1A',
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  xpNextLabel: {
    color: '#9E9E9E',
    fontSize: 12,
  },

  // ── Shared card heading (e.g. "THIS WEEK", "ACCURACY BY TOPIC") ──
  cardHeading: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 14,
  },

  // ── Chart labels ──
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  chartDay: {
    color: '#9E9E9E',
    fontSize: 12,
    textAlign: 'center',
  },

  // ── Accuracy topic rows ──
  topicBlock: {
    marginBottom: 14,
  },
  topicHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  topicName: {
    color: '#1A2E1A',
    fontWeight: '600',
    fontSize: 14,
  },
  topicPct: {
    fontWeight: '700',
    fontSize: 14,
  },

  // ── Badges card ──
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  badgesTitle: {
    color: '#1A2E1A',
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
    color: '#555',
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
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSlotLocked: {
    backgroundColor: '#F5F5F5',
  },

  // ── Bottom tab bar ──
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 64,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tabItem: {
    alignItems: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    color: '#9E9E9E',
  },
  tabLabelActive: {
    color: '#00897B',
    fontWeight: '600',
  },
});
