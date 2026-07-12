import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

/** Null when env vars are absent (e.g. a fork without Supabase set up). */
export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

/**
 * Best-effort save counter. Never throws and never blocks the save/
 * celebration flow — offline (the PWA case) or misconfigured environments
 * just skip tracking.
 */
export async function incrementStudioSaves(studioId: string): Promise<void> {
  try {
    if (!supabase) return;
    await supabase.rpc("increment_studio_saves", { sid: studioId });
  } catch {
    // Tracking is optional; the creation itself already saved locally.
  }
}
