import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ─── Design tokens — matches OnboardingScreen ─────────────────────────────────
const GREEN      = '#00C853';
const GREEN_TINT = 'rgba(0, 200, 83, 0.15)';
const BG         = '#0A0E1A';
const CARD_BG    = '#131929';
const BORDER     = '#1E2A3D';
const WHITE      = '#FFFFFF';
const GREY       = '#6B7A8D';
const LIGHT_GREY = '#8A96A8';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={BG} />

        {/* Header: app label on the left, small badges on the right */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>OPTIQ</Text>
          <View style={styles.headerRight}>
            <View style={styles.badge}>
              <MaterialCommunityIcons name="fire" size={14} color="#FFD166" />
              <Text style={styles.badgeText}>7</Text>
            </View>
            <View style={styles.xpBadge}>
              <MaterialCommunityIcons name="bolt" size={14} color={GREEN} />
              <Text style={styles.xpText}>340 XP</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Daily goal card with progress bar */}
          <View style={styles.dailyGoalCard}>
            <View style={styles.dailyGoalHeader}>
              <Text style={styles.dailyGoalTitle}>DAILY GOAL</Text>
              <Text style={styles.dailyGoalCount}>1/3 lessons</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: '33%' }]} />
            </View>
            <Text style={styles.dailyGoalSub}>2 more lessons to reach your daily goal</Text>
          </View>

          {/* Big action tiles: Daily Lesson + Skill Quiz */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.largeTile} activeOpacity={0.85} onPress={() => navigation.navigate('Lesson')}>
              <View style={styles.tileIconWrap}>
                <MaterialCommunityIcons name="book-open-page-variant" size={22} color={BG} />
              </View>
              <View>
                <Text style={styles.tileTitle}>Daily Lesson</Text>
                <Text style={styles.tileSubtitle}>~5 min</Text>
              </View>
            </TouchableOpacity>

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

          {/* Section title */}
          <Text style={styles.sectionTitle}>Your Path</Text>

          {/* Path cards with progress bars */}
          <View style={styles.pathList}>
            {[
              { title: 'Options Basics', subtitle: 'Calls, puts, and how contracts work', progress: '62%', count: '5/8' },
              { title: 'Strike Price & Expiration', subtitle: 'In-the-money, at-the-money, out-of-the-money', progress: '33%', count: '2/6' },
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

        {/* Bottom tab bar */}
        <View style={styles.tabBar}>
          {/* Home — already on this screen, no navigation needed */}
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
            <MaterialCommunityIcons name="home" size={22} color={GREEN} />
            <Text style={styles.tabLabelActive}>Home</Text>
          </TouchableOpacity>

          {/* Learn — switches to the Lesson tab */}
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.7} onPress={() => navigation.navigate('Lesson')}>
            <MaterialCommunityIcons name="book-open-variant" size={22} color={GREY} />
            <Text style={styles.tabLabel}>Learn</Text>
          </TouchableOpacity>

          {/* Profile — switches to the Profile tab */}
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
  screen:  { flex: 1, backgroundColor: BG },
  safeArea: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  appTitle: {
    color: WHITE,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
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

  // Scrollable content area
  content: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 10 },

  // Daily goal card
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
  progressBarTrack: {
    height: 8,
    backgroundColor: BORDER,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: GREEN,
    borderRadius: 4,
  },
  dailyGoalSub: { color: GREY, marginTop: 8, fontSize: 12 },

  // Large action tiles
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
  },
  tileIconWrapAlt: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: GREEN_TINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTitle: { color: WHITE, fontSize: 15, fontWeight: '700' },
  tileTitleAlt: { color: WHITE },
  tileSubtitle: { color: LIGHT_GREY, fontSize: 12, marginTop: 2 },

  // Section title
  sectionTitle: { color: LIGHT_GREY, fontWeight: '700', fontSize: 13, letterSpacing: 0.8, marginBottom: 12 },

  // Path list and cards
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

  // Bottom tab bar
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
