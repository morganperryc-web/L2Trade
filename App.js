// ─── Imports ────────────────────────────────────────────────────────────────
// React is the engine that makes our UI components work
import React from 'react';
// These are the basic React Native building blocks we need:
//   StyleSheet – lets us write CSS-like styles
//   Text        – displays text on screen
//   View        – a box/container (like a <div>)
//   TouchableOpacity – a button that fades when pressed
//   SafeAreaView     – keeps content away from the phone's notch and home bar
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

// LinearGradient lets us paint a smooth colour transition across the background
import { LinearGradient } from 'expo-linear-gradient';

// Ionicons gives us the lightning bolt, chart arrow, and trophy icons
import { Ionicons } from '@expo/vector-icons';

// StatusBar controls the small clock/battery bar at the top of the phone
import { StatusBar } from 'expo-status-bar';

// ─── Feature card data ──────────────────────────────────────────────────────
// Keeping the card content in one array makes it easy to add or change cards
// without touching the layout code below
const FEATURES = [
  {
    icon: 'flash',           // Ionicons name for the lightning bolt
    title: 'Daily Lessons',
    subtitle: '5-min lessons on trading strategies',
  },
  {
    icon: 'trending-up',     // Ionicons name for the upward arrow chart
    title: 'Paper Trading',
    subtitle: 'Practice with virtual money',
  },
  {
    icon: 'trophy',          // Ionicons name for the trophy cup
    title: 'Compete & Win',
    subtitle: 'Climb the leaderboard weekly',
  },
];

// ─── Main screen component ──────────────────────────────────────────────────
import ProfileScreen from './screens/ProfileScreen';

export default function App() {
  // Temporary: render ProfileScreen for preview.
  return <ProfileScreen />;
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // The gradient view stretches to fill the whole device screen
  gradient: {
    flex: 1,
  },

  // SafeAreaView fills the gradient and spaces its two children (top / bottom)
  // to opposite ends of the screen using 'space-between'
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // The top block stacks its children vertically and centres them horizontally
  topContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  // Dark rounded square that frames the app icon
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },

  // Large bold white headline
  headline: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 16,
  },

  // Smaller muted-green subtitle
  subtitle: {
    fontSize: 16,
    color: '#8FBC8F',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 36,
    paddingHorizontal: 10,
  },

  // Wrapper that stacks the three cards with a gap between each one
  cardsContainer: {
    width: '100%',
    gap: 12,
  },

  // Individual feature card: semi-transparent lighter-green rectangle
  card: {
    flexDirection: 'row',   // icon on left, text on right
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
  },

  // Small rounded square on the left side of each card that holds the icon
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  // Lets the text column grow to fill remaining card width
  cardText: {
    flex: 1,
  },

  // Bold white card title
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 3,
  },

  // Muted-green card subtitle
  cardSubtitle: {
    fontSize: 13,
    color: '#8FBC8F',
  },

  // Wrapper for the button, adds breathing room at the very bottom
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 16,
  },

  // Pill-shaped bright green button
  button: {
    backgroundColor: '#00E676',
    borderRadius: 28,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bold black label inside the button
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 0.3,
  },

});
