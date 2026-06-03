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
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// HomeScreen replicates the dashboard screenshot. Comments explain each
// major section so it's easy to customise later.
export default function HomeScreen({ navigation }) {
  return (
    // Gradient background that matches the app's existing dark-green look
    <LinearGradient colors={["#0A2E1A", "#0D3B22"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0A2E1A" />

        {/* Header: app label on the left, small badges on the right */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>OPTIQ</Text>
          <View style={styles.headerRight}>
            <View style={styles.badge}>
              <MaterialCommunityIcons name="fire" size={14} color="#FFD166" />
              <Text style={styles.badgeText}>7</Text>
            </View>
            <View style={styles.xpBadge}>
              <MaterialCommunityIcons name="bolt" size={14} color="#00E676" />
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
                <MaterialCommunityIcons name="book-open-page-variant" size={22} color="#092" />
              </View>
              <View>
                <Text style={styles.tileTitle}>Daily Lesson</Text>
                <Text style={styles.tileSubtitle}>~5 min</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.largeTile, styles.darkTile]} activeOpacity={0.85}>
              <View style={styles.tileIconWrapAlt}>
                <MaterialCommunityIcons name="bullseye" size={22} color="#8EE99C" />
              </View>
              <View>
                <Text style={[styles.tileTitle, styles.tileTitleAlt]}>Skill Quiz</Text>
                <Text style={styles.tileSubtitle}>Test your knowledge</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Section title */}
          <Text style={styles.sectionTitle}>Your Path</Text>

          {/* Path cards with progress bars (list approximating screenshot) */}
          <View style={styles.pathList}>
            {[
              { title: 'Options Basics', subtitle: 'Calls, puts, and how contracts work', progress: '62%' , count:'5/8'},
              { title: 'Strike Price & Expiration', subtitle: 'In-the-money, at-the-money, out-of-the-money', progress: '33%', count:'2/6'},
              { title: 'Option Premium & Greeks', subtitle: 'Delta, theta, vega, and what they mean', progress: '0%', count:''},
              { title: 'Strategies: Covered Calls', subtitle: 'Generate income from stocks you own', progress: '0%', count:''},
            ].map((m, i) => (
              <View key={i} style={styles.pathCard}>
                <View style={styles.pathLeft}>
                  <View style={styles.pathIcon}>
                    <MaterialCommunityIcons name={i===0? 'book-open-outline' : i===1? 'target' : 'chart-box-outline'} size={18} color="#00E676" />
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
            <MaterialCommunityIcons name="home" size={22} color="#00E676" />
            <Text style={styles.tabLabelActive}>Home</Text>
          </TouchableOpacity>

          {/* Learn — switches to the Lesson tab */}
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.7} onPress={() => navigation.navigate('Lesson')}>
            <MaterialCommunityIcons name="book-open-variant" size={22} color="#97E6A1" />
            <Text style={styles.tabLabel}>Learn</Text>
          </TouchableOpacity>

          {/* Profile — switches to the Profile tab */}
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.7} onPress={() => navigation.navigate('Profile')}>
            <MaterialCommunityIcons name="account" size={22} color="#97E6A1" />
            <Text style={styles.tabLabel}>Profile</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Styles
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  appTitle: {
    color: '#AEECEF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeText: { color: '#FFD166', marginLeft: 6, fontWeight: '700' },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  xpText: { color: '#C7F9D7', marginLeft: 6, fontWeight: '700' },

  // Scrollable content area
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 10 },

  // Daily goal card
  dailyGoalCard: {
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  dailyGoalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dailyGoalTitle: { color: '#B6EFC7', fontWeight: '700' },
  dailyGoalCount: { color: '#8EE99C', fontWeight: '700' },
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#00E676',
  },
  dailyGoalSub: { color: 'rgba(255,255,255,0.6)', marginTop: 8, fontSize: 12 },

  // Large action tiles
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  largeTile: {
    flex: 1,
    backgroundColor: '#00B361',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  darkTile: { backgroundColor: 'rgba(0,0,0,0.12)' },
  tileIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#00E676',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  tileIconWrapAlt: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0,230,118,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  tileTitle: { color: '#071A10', fontSize: 16, fontWeight: '800' },
  tileTitleAlt: { color: '#D6F7E0' },
  tileSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },

  // Section title
  sectionTitle: { color: '#D6F7E0', fontWeight: '800', marginBottom: 10 },

  // Path list and cards
  pathList: { gap: 12, marginBottom: 24 },
  pathCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
  },
  pathLeft: { paddingRight: 12 },
  pathIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(0,230,118,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathRight: { flex: 1 },
  pathTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pathTitle: { color: '#DFF7E8', fontWeight: '700' },
  pathCount: { color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  pathSubtitle: { color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 4, marginBottom: 8 },
  pathProgressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 6, overflow: 'hidden' },
  pathProgressFill: { height: 6, backgroundColor: '#00E676' },

  // Bottom tab bar
  tabBar: {
    height: 72,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.03)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  tabItem: { alignItems: 'center', gap: 4 },
  tabLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  tabLabelActive: { color: '#00E676', fontSize: 12, fontWeight: '700' },
});
