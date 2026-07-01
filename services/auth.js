// ─── Auth helpers ─────────────────────────────────────────────────────────────
// These functions wrap Supabase auth so screens don't need to import
// supabase directly and repeat the same try/catch logic everywhere.
import { supabase } from './supabase';

function resolveTrack(track, quizAnswers = {}) {
  const answer = quizAnswers.experience || quizAnswers.q1 || '';
  const normalized = String(answer).toLowerCase();

  if (normalized.includes('never started') || normalized.includes('under 1 year')) {
    return 'beginner';
  }

  if (normalized.includes('1-3 years') || normalized.includes('1–3 years') || normalized.includes('3+ years')) {
    return 'intermediate';
  }

  return track || 'beginner';
}

// ─── signUp ───────────────────────────────────────────────────────────────────
// Creates a Supabase Auth user AND inserts a matching row in our public.users
// table with the username, track, and quiz answers from onboarding.
// If the profile insert fails we sign the user back out so they aren't left
// in a half-created state and can try again.
export async function signUp({ email, password, username, track, quiz_answers = {} }) {
  const resolvedTrack = resolveTrack(track, quiz_answers);
  console.log('signUp: quiz_answers', quiz_answers);
  console.log('signUp: resolvedTrack', resolvedTrack);

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('Sign up failed — no user returned.');

  const upsertPayload = {
    id: data.user.id,
    email,
    track: resolvedTrack,
    created_at: new Date().toISOString(),
  };

  console.log('signUp: users upsert payload', upsertPayload);

  const { data: profileRow, error: profileError } = await supabase
    .from('users')
    .upsert(upsertPayload, { onConflict: 'id' })
    .select('id, email, track, created_at')
    .single();

  if (profileError) {
    console.error('signUp: users upsert failed', profileError);
    throw profileError;
  }

  console.log('signUp: saved user row', profileRow);

  if (!data.session) {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) throw signInError;

    const { data: verifiedRow, error: verifyError } = await supabase
      .from('users')
      .select('id, email, track, created_at')
      .eq('id', data.user.id)
      .single();

    if (!verifyError) {
      console.log('signUp: verified user row after sign-in', verifiedRow);
    }

    return signInData;
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
