# Deploying Løkka Pet Care to Vercel + løkkapetcare.no

This is the manual runbook for hosting the app on Vercel with the custom domain
`løkkapetcare.no`. The codebase is deploy-ready: `middleware.ts` is Edge-safe
(no `ws` import), the `ws` polyfill is only used by the Node-runtime Supabase
clients, and the Node version is pinned to `20.x` in `package.json` so Vercel
matches local development.

## Prerequisites

- The repo is on GitHub: `aznee3000/l-kkapetcare`.
- A Supabase project (the same one referenced in your local `.env.local`).
- Access to the DNS settings for `løkkapetcare.no` at your `.no` registrar.

## 1. Prepare Supabase (do this first)

In the Supabase dashboard for your project:

1. Open the SQL editor and confirm all migrations have been applied, in order:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_rls.sql`
   - `supabase/migrations/0003_storage.sql`
   - `supabase/migrations/0004_add_vacation_service.sql` (adds the
     `vacation_care` service). If this has not been run, run it now, or
     vacation-care bookings will be rejected by the database.
2. Confirm the `sitter-photos` storage bucket exists (created by `0003`).
3. Confirm an admin user exists (created earlier with `npm run create-admin`).
   Production uses the same Supabase project, so the existing admin login works.
4. From **Project Settings > API**, copy these three values for the next step:
   - Project URL
   - `anon` / public key
   - `service_role` key (secret)

## 2. Import the project into Vercel

1. Go to vercel.com > **Add New > Project**.
2. Import the GitHub repo `aznee3000/l-kkapetcare`.
3. The framework preset auto-detects **Next.js**. Leave the Build Command
   (`next build`), Output Directory, and Root Directory at their defaults.

## 3. Set environment variables

In **Vercel > Project > Settings > Environment Variables**, add the following
for both **Production** and **Preview**:

| Name | Value | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase Project URL | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your `anon` / public key | public |
| `SUPABASE_SERVICE_ROLE_KEY` | your `service_role` key | mark **Sensitive**; never prefix with `NEXT_PUBLIC` |
| `NEXT_PUBLIC_SITE_URL` | `https://løkkapetcare.no` | optional; not referenced in code today, but future-proof |

These are required because `.env.local` is gitignored and never deployed.

Trigger the first **Deploy**.

## 4. Connect the domain løkkapetcare.no

1. In **Vercel > Project > Settings > Domains**, add both:
   - `løkkapetcare.no`
   - `www.løkkapetcare.no`

   Set the apex (`løkkapetcare.no`) as the primary domain and configure
   `www` to redirect to it.

   Note: `.no` supports internationalized (Unicode) characters. Vercel and your
   registrar may display the punycode `xn--...` form of the name — this is the
   same domain. Enter the Unicode name `løkkapetcare.no`.

2. At your `.no` registrar's DNS, create the exact records Vercel shows. The
   standard Vercel values are:

   - Apex `løkkapetcare.no`: `A` record -> `76.76.21.21`
   - `www`: `CNAME` -> `cname.vercel-dns.com`

   Alternatively, if your registrar allows it, delegate the domain to Vercel's
   nameservers instead of setting individual records.

3. Wait for DNS to propagate. Vercel automatically issues the SSL certificate
   once the records resolve.

## 5. Optional: Supabase Auth URLs

Password-based admin login needs no redirect URL configuration. If you later
add magic links or OAuth, add `https://løkkapetcare.no` under
**Supabase > Authentication > URL Configuration**.

## 6. Post-deploy verification

On `https://løkkapetcare.no`, confirm:

- `/`, `/book`, `/become-sitter`, `/sitters`, `/login` all load (HTTP 200).
- Norwegian is the default language; the EN toggle persists across navigation.
- `/admin` redirects to `/login` when logged out; logging in as the admin
  reaches the dashboard.
- Submitting a test booking and a test sitter application creates rows in
  Supabase, and the vacation-care option is selectable.
- Sitter photos render (the Supabase `*.supabase.co` host is already allowlisted
  in `next.config.ts`).

## Notes

- Because pages read the locale cookie, all routes are server-rendered on demand
  (shown as "dynamic" in the build output). This is expected.
- Vercel's Hobby plan is sufficient for this MVP. The Node serverless runtime
  supports the `ws`-based Supabase clients.
- Future pushes to `main` trigger automatic redeploys once the project is
  connected.
