// ─── Auth helpers ─────────────────────────────────────────────────────────────
// These functions wrap Supabase auth so screens don't need to import
// supabase directly and repeat the same try/catch logic everywhere.
import { supabase } from './supabase';

// ─── signUp ───────────────────────────────────────────────────────────────────
// Creates a Supabase Auth user AND inserts a matching row in our public.users
// table with the username and track chosen during onboarding.
// If the profile insert fails we sign the user back out so they aren't left
// in a half-created state and can try again.
export async function signUp({ email, password, username, track }) {
  // Step 1 — create the auth record (auth.users table, managed by Supabase)
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('Sign up failed — no user returned.');

  // Step 2 — insert their public profile into our own users table
  const { error: profileError } = await supabase.from('users').insert({
    id:       data.user.id, // must match the auth.users id
    email,
    username,
    track,
  });

  if (profileError) {
    // Roll back the auth creation so the user isn't stuck in a broken state
    await supabase.auth.signOut();
    throw profileError;
  }

  return data;
}

// ─── signIn ───────────────────────────────────────────────────────────────────
// Signs in with email + password. On success, Supabase saves the session via
// AsyncStorage (configured in supabase.js) so the user stays logged in.
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// ─── signOut ──────────────────────────────────────────────────────────────────
// Clears the session from AsyncStorage and signs the user out everywhere.
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
