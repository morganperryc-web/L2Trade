// ─── App.js — Navigation root ─────────────────────────────────────────────────
// This file is the single entry point that React Native starts with.
// Its only job is to define the navigation structure of the app.
// It does NOT draw any UI itself — each screen file handles that.
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

// NavigationContainer: wraps the whole app and keeps track of navigation state
import { NavigationContainer } from '@react-navigation/native';

// createNativeStackNavigator: handles full-screen slide/fade transitions.
// Used here for the one-time onboarding flow (Onboarding → Quiz → Main).
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// createBottomTabNavigator: manages the three main tabs of the app once the
// user has finished onboarding (Home, Lesson, Profile).
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// AsyncStorage: a small on-device key-value store that survives app restarts.
// We write '@onboarding_complete' = 'true' after the quiz so every future
// launch opens directly on the Home screen instead of the welcome screen.
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Screen imports ───────────────────────────────────────────────────────────
import OnboardingScreen from './screens/OnboardingScreen';
import QuizScreen       from './screens/QuizScreen';
import HomeScreen       from './screens/HomeScreen';
import LessonScreen     from './screens/LessonScreen';
import ProfileScreen    from './screens/ProfileScreen';

// Instantiate the two navigators (just constructors at this point, not rendered)
const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ─── Main tab navigator ───────────────────────────────────────────────────────
// This is the "home" of the app — the three screens the user lives in.
//
// WHY is tabBarStyle set to display:none?
// Every screen already draws its own custom tab bar in JSX to match the app's
// dark-green design. If we left React Navigation's default tab bar visible,
// there would be two tab bars stacked on top of each other. Hiding the default
// one means our custom bars handle all the visual rendering, while React
// Navigation still handles all the actual navigation logic behind the scenes.
// The custom tab buttons call navigation.navigate('TabName') just like a real tab.
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // custom tab bars in each screen replace this
      }}
    >
      {/* The name prop here MUST match the string passed to navigation.navigate()
          in the screens. Changing a name here requires updating the screens too. */}
      <Tab.Screen name="Home"    component={HomeScreen}    />
      <Tab.Screen name="Lesson"  component={LessonScreen}  />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────
export default function App() {
  // We start with null and decide the initial screen after reading AsyncStorage.
  // Using null (not a default value) guarantees we never flash the wrong screen.
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    // On every app launch, check whether this device has already been through
    // onboarding. If yes, jump straight to Main; if no, start at Onboarding.
    async function determineStartScreen() {
      try {
        const done = await AsyncStorage.getItem('@onboarding_complete');
        setInitialRoute(done === 'true' ? 'Main' : 'Onboarding');
      } catch (_) {
        setInitialRoute('Onboarding'); // fall back to onboarding if read fails
      }
    }
    determineStartScreen();
  }, []);

  // Show a dark loading screen while AsyncStorage is being read.
  // This is usually less than 50 ms but prevents any visual flicker.
  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A2E1A', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#00E676" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false, // every screen provides its own top bar
          animation: 'fade',  // subtle cross-fade keeps the dark theme feeling smooth
        }}
      >
        {/* ── One-time onboarding flow ──
            These two screens are only reachable on a brand-new install.
            After the quiz, we call navigation.reset() which wipes the stack —
            so pressing the device back button can never return here. */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Quiz"       component={QuizScreen}       />

        {/* ── Main app ──
            MainTabs is the bottom-tab navigator defined above.
            On second+ launches, initialRouteName='Main' jumps here directly. */}
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
