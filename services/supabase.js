// ─── Supabase client ──────────────────────────────────────────────────────────
// This file creates and exports a single shared Supabase client.
// Import it in any screen or service file that needs to read/write the database:
//   import { supabase } from '../services/supabase';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Credentials (loaded from .env, never hardcoded) ─────────────────────────
// Values live in the .env file in your project root.
// Expo automatically exposes any variable prefixed with EXPO_PUBLIC_ to your
// app via process.env — no extra config or build step required.
// .env is listed in .gitignore so these values are never committed to Git.
const SUPABASE_URL      = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// ─── Client ───────────────────────────────────────────────────────────────────
// createClient returns a configured client instance.
// We export it as a named export so every file uses the same connection.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Store the session in AsyncStorage so the user stays logged in
    // between app restarts without needing to sign in again.
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // must be false in React Native (no browser URLs)
  },
});
