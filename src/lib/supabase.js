import { createClient } from '@supabase/supabase-js';

// Safe environment variable reader across both Vite browser runtime and Node.js environments
const getEnvVar = (key) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch (e) {
    // import.meta.env not available in standard Node
  }

  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    // process.env not available
  }

  return undefined;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Check if credentials are valid and not just placeholder strings
const isPlaceholder = (val) => {
  if (!val) return true;
  const lower = val.toLowerCase().trim();
  return (
    lower.includes('your_supabase') ||
    lower.includes('your-project') ||
    lower.includes('placeholder') ||
    lower.length < 10
  );
};

export const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !isPlaceholder(supabaseUrl) &&
  !isPlaceholder(supabaseAnonKey)
);

let client = null;

if (isConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'collabmatrix_supabase_auth_token',
      },
    });
  } catch (err) {
    console.warn('[CollabMatrix] Supabase client initialization warning:', err.message);
    client = null;
  }
}

/**
 * Returns whether Supabase is configured with valid production/staging credentials
 * @returns {boolean}
 */
export function isSupabaseConfigured() {
  return isConfigured && client !== null;
}

/**
 * Returns configuration diagnostics for UI indicators and connection statuses
 * Note: Never exposes the anon key or sensitive secrets
 */
export function getSupabaseConfigStatus() {
  if (isSupabaseConfigured()) {
    return {
      configured: true,
      url: supabaseUrl,
      mode: 'CONNECTED // LIVE POSTGRESQL',
      message: 'Active Supabase instance configured with Row Level Security.',
    };
  }

  const hasUrl = Boolean(supabaseUrl && !isPlaceholder(supabaseUrl));
  return {
    configured: false,
    url: hasUrl ? supabaseUrl : null,
    mode: 'STANDBY // LOCAL BROWSER STATE',
    message: hasUrl
      ? `Project URL linked (${supabaseUrl}). Awaiting anon public key in .env.local to activate live PostgreSQL connection.`
      : 'Supabase credentials not detected in .env.local. Operating in zero-assumption local state mode.',
  };
}

/**
 * Actively tests connectivity to Supabase PostgreSQL database
 * Safe to call at runtime; handles errors gracefully without throwing
 * @returns {Promise<Object>}
 */
export async function testSupabaseConnection() {
  if (!isSupabaseConfigured()) {
    const hasUrl = Boolean(supabaseUrl && !isPlaceholder(supabaseUrl));
    return {
      connected: false,
      reason: 'UNCONFIGURED',
      message: hasUrl
        ? `Project URL (${supabaseUrl}) is set. Awaiting anon public key in .env.local to test connection.`
        : 'Supabase credentials not configured in .env.local. Database is in local standby mode.',
      latencyMs: null,
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const start = Date.now();
    const { error } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    const latencyMs = Date.now() - start;

    if (error) {
      return {
        connected: false,
        reason: 'DATABASE_ERROR',
        message: error.message || 'Database returned an error.',
        details: error.details || error.hint || null,
        code: error.code || null,
        latencyMs,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      connected: true,
      reason: 'OK',
      message: `Active PostgreSQL connection confirmed (${latencyMs}ms).`,
      latencyMs,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return {
      connected: false,
      reason: 'NETWORK_ERROR',
      message: err.message || 'Network request failed.',
      latencyMs: null,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Exported Supabase client singleton
 * When unconfigured, safely returns client or null without throwing uncaught runtime exceptions
 */
export const supabase = client;

export default supabase;

