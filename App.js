// ─── App.js — Navigation root ─────────────────────────────────────────────────
// This file defines the navigation structure and owns the auth state.
// It does NOT draw any UI of its own — each screen handles that.
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Supabase client — used here only to listen for sign-in / sign-out events
import { supabase } from './services/supabase';

// ─── Screen imports ───────────────────────────────────────────────────────────
import OnboardingScreen from './screens/OnboardingScreen';
import QuizScreen       from './screens/QuizScreen';
import SignUpScreen     from './screens/SignUpScreen';
import LoginScreen      from './screens/LoginScreen';
import HomeScreen       from './screens/HomeScreen';
import LessonScreen     from './screens/LessonScreen';
import ProfileScreen    from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ─── Main tab navigator (shown once the user is signed in) ────────────────────
// The built-in tab bar is hidden because each screen draws its own custom
// dark-themed tab bar. Those custom tab buttons call navigation.navigate()
// to switch tabs, so routing still works normally.
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tab.Screen name="Home"    component={HomeScreen}    />
      <Tab.Screen name="Lesson"  component={LessonScreen}  />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────
export default function App() {
  // undefined = still checking  |  null = no session  |  object = signed in
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    // Check if a session already exists (e.g. user previously signed in and
    // the token was saved to AsyncStorage by the Supabase client).
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null);
    });

    // Subscribe to future sign-in / sign-out events.
    // When the user signs in from SignUpScreen or LoginScreen, this fires
    // automatically and App re-renders to show MainTabs — no explicit
    // navigation.navigate() call needed in those screens.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  // Still waiting for the AsyncStorage read — show a dark spinner so
  // the user never sees a flash of the wrong screen.
  if (session === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0E1A', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#00C853" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? (
        // ── Signed in — show the main app ──────────────────────────────────
        // React Navigation renders MainTabs whenever session is non-null.
        // Signing out (from ProfileScreen) sets session to null and this
        // block switches back to the auth flow automatically.
        <MainTabs />
      ) : (
        // ── Not signed in — show the auth / onboarding flow ────────────────
        // After a successful signUp or signIn, Supabase fires onAuthStateChange
        // which sets session above, and React Navigation automatically swaps
        // to the MainTabs block — no navigation.reset() needed.
        <Stack.Navigator
          screenOptions={{ headerShown: false, animation: 'fade' }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Quiz"       component={QuizScreen}       />
          <Stack.Screen name="SignUp"     component={SignUpScreen}     />
          <Stack.Screen name="Login"      component={LoginScreen}      />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
