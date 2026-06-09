// Service-role Supabase client. BYPASSES Row Level Security.
//
// SECURITY: Only ever import this from server-only code (server actions,
// route handlers, scripts) that has ALREADY verified the caller is an admin.
// The service role key must never reach the browser — it is read from a
// non-public env var (no NEXT_PUBLIC_ prefix).
import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase admin env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    // Node < 22 has no global WebSocket; supabase-js constructs a Realtime
    // client eagerly. We don't use realtime, but must provide a transport so it
    // doesn't throw. (Browser client uses native WebSocket and needs none.)
    // @ts-expect-error - `ws` ctor is compatible at runtime; supabase's
    // WebSocketLikeConstructor type is stricter than the real `ws` signature.
    realtime: { transport: WebSocket },
  });
}
