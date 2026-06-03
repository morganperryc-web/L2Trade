// ─── Supabase client ──────────────────────────────────────────────────────────
// This file creates and exports a single shared Supabase client.
// Import it in any screen or service file that needs to read/write the database:
//   import { supabase } from '../services/supabase';
import { createClient } from '@supabase/supabase-js';

// ─── Your credentials ─────────────────────────────────────────────────────────
// WHERE TO FIND THESE IN YOUR SUPABASE DASHBOARD:
//   1. Go to https://supabase.com and sign in
//   2. Click your project from the dashboard
//   3. In the left sidebar click "Project Settings" (the cog icon at the bottom)
//   4. Click "API" under the Configuration section
//   5. Copy "Project URL"  → paste it as SUPABASE_URL below
//   6. Copy "anon public" key under "Project API keys" → paste as SUPABASE_ANON_KEY
//
// IMPORTANT: The anon key is safe to ship in a mobile app — Supabase Row Level
// Security (RLS) policies control what each user can actually read or write.
const SUPABASE_URL  = 'liphzabscfvkpnefhvsp.supabase.co';   // e.g. https://xyzabc.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcGh6YWJzY2Z2a3BuZWZodnNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNTU2NDksImV4cCI6MjA5MzkzMTY0OX0.8bV4WxkVrrJAVNkkVC9weFtokLqZ__GJPYkgyDzFdwo';  // long string starting with "eyJ..."

// ─── Client ───────────────────────────────────────────────────────────────────
// createClient returns a configured client instance.
// We export it as a named export so every file uses the same connection.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
