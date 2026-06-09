/**
 * create-admin.ts
 * -----------------------------------------------------------------------------
 * Creates (or promotes) an admin user for the Løkka Pet Care dashboard.
 *
 * Usage:
 *   1. Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and
 *      SUPABASE_SERVICE_ROLE_KEY set.
 *   2. Run:
 *        npm run create-admin -- admin@example.com "a-strong-password"
 *
 * What it does:
 *   - Creates a confirmed auth user with that email + password (or reuses the
 *     existing one), then sets their profile role to 'admin'.
 * -----------------------------------------------------------------------------
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

// Load env from .env.local (preferred) then .env.
config({ path: ".env.local" });
config();

async function main() {
  const [email, password] = process.argv.slice(2);

  if (!email || !password) {
    console.error(
      'Usage: npm run create-admin -- <email> "<password>"\n' +
        'Example: npm run create-admin -- admin@example.com "supersecret123"',
    );
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    // Node < 22 has no global WebSocket; provide one for supabase-js's Realtime.
    // @ts-expect-error - `ws` ctor is compatible at runtime; supabase's
    // WebSocketLikeConstructor type is stricter than the real `ws` signature.
    realtime: { transport: WebSocket },
  });

  // 1. Create the auth user (email pre-confirmed). If it already exists, find it.
  let userId: string | undefined;
  const { data: created, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (createError) {
    if (/already|exists|registered/i.test(createError.message)) {
      console.log("User already exists — locating and promoting…");
      // Page through users to find the matching email.
      const { data: list } = await supabase.auth.admin.listUsers();
      userId = list.users.find((u) => u.email === email)?.id;
    } else {
      console.error("Failed to create user:", createError.message);
      process.exit(1);
    }
  } else {
    userId = created.user?.id;
  }

  if (!userId) {
    console.error("Could not determine the user's id.");
    process.exit(1);
  }

  // 2. Upsert the profile with role = 'admin'.
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      email,
      role: "admin",
    },
    { onConflict: "id" },
  );

  if (profileError) {
    console.error("Failed to set admin role:", profileError.message);
    process.exit(1);
  }

  console.log(`✅ Admin ready: ${email}`);
  console.log("   Sign in at /login");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
