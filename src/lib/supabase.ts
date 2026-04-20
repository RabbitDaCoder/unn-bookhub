import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Singleton to avoid "Multiple GoTrueClient instances" warning during HMR
const globalKey = "__supabase_client__" as const;
const g = globalThis as unknown as { [globalKey]: SupabaseClient };

export const supabase = g[globalKey] ?? createClient(supabaseUrl, supabaseKey);
g[globalKey] = supabase;
