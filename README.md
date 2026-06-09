# 🐾 Løkka Pet Care

A lean, **admin-managed** hyperlocal pet-care marketplace MVP for **Grünerløkka, Oslo**.

Busy pet owners request **dog walks** or **cat check-ins**. Local neighbors apply to become **sitters**. You (the **admin**) manually approve sitters, match buyers to sitters, manage bookings, and record payments — keeping trust high while the marketplace is small.

> This is an MVP, not a Rover clone. There is **no instant booking** and **no automated matching** — every request is reviewed by you.

---

## Tech stack

- **Next.js (App Router)** + **TypeScript**
- **Tailwind CSS** (warm, local, trustworthy theme)
- **Supabase** — Postgres, Auth, Storage, Row Level Security
- **Zod** for validation
- **Server Actions** for all mutations
- Payments are **manual** for now, with a clear seam for **Stripe / Vipps** later (`src/lib/payments.ts`)

---

## Roles

| Role  | Can do                                                                |
| ----- | --------------------------------------------------------------------- |
| Buyer | Submit a booking request (no login needed)                            |
| Sitter| Submit an application (no login needed)                               |
| Admin | Log in, approve sitters, match & manage bookings, payments, reviews   |

---

## Pages

**Public**
- `/` — landing page
- `/book` — buyer request form (accepts `?sitter_id=` to pre-request a sitter)
- `/become-sitter` — sitter application form (with photo upload)
- `/sitters` — directory of **approved** sitters only

**Admin** (protected — admin login required)
- `/login` — admin sign in
- `/admin` — overview & queue
- `/admin/bookings` — list + filters → `/admin/bookings/[id]` detail (assign sitter, change status, notes, mark paid, mark completed)
- `/admin/sitters` — list + filters → `/admin/sitters/[id]` detail (approve/reject/unpublish, verify badges, edit profile)
- `/admin/reviews` — add reviews manually, publish/hide

---

## Getting started

### 1. Prerequisites
- Node.js 18.18+ (or 20+)
- A free [Supabase](https://supabase.com) project

### 2. Install
```bash
npm install
```

### 3. Configure environment variables
Copy the example file and fill in your keys (from **Supabase dashboard → Project Settings → API**):
```bash
cp .env.example .env.local
```
Then edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...        # <-- INSERT your project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # <-- INSERT your anon / publishable key
SUPABASE_SERVICE_ROLE_KEY=...       # <-- INSERT your service role key (SECRET)
```
> ⚠️ The service role key bypasses RLS. Keep it server-side only — it is never prefixed with `NEXT_PUBLIC_`.

### 4. Set up the database
Run the SQL files **in order** in the Supabase dashboard → **SQL Editor** (or with the Supabase CLI):
1. `supabase/migrations/0001_init.sql` — tables, enums, triggers
2. `supabase/migrations/0002_rls.sql` — row level security policies
3. `supabase/migrations/0003_storage.sql` — `sitter-photos` storage bucket
4. *(optional)* `supabase/seed.sql` — demo sitters, bookings & reviews

If you use the Supabase CLI:
```bash
supabase db push          # applies migrations
# then paste seed.sql in the SQL editor, or:
psql "$DATABASE_URL" -f supabase/seed.sql
```

### 5. Create your admin user
```bash
npm run create-admin -- admin@example.com "a-strong-password"
```
This creates a confirmed auth user and sets their `profiles.role = 'admin'`.

> Prefer SQL? Sign up a user via Supabase Auth, then run:
> ```sql
> update profiles set role = 'admin' where email = 'admin@example.com';
> ```

### 6. Run the app
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000). Admin sign-in is at `/login`.

---

## Trust model & security

- **Public writes**: anyone can submit a booking request, a pet, or a sitter application. RLS policies allow only these inserts; sitter applications are forced to `pending_review`.
- **Public reads**: the anon key can only read **approved** sitters and **published** reviews.
- **Admin**: server actions verify `profiles.role = 'admin'` (`requireAdmin()` in `src/lib/auth.ts`) and then use the **service-role client** (`src/lib/supabase/admin.ts`) which bypasses RLS. The service role key never reaches the browser.

---

## Project structure

```
src/
  app/
    page.tsx                 landing
    book/                    buyer request (page + actions)
    become-sitter/           sitter application (page + actions)
    sitters/                 public directory
    login/                   admin auth
    admin/                   protected dashboard (layout guard)
      bookings/ sitters/ reviews/
  components/
    ui/                      Button, Input, Field, Checkbox, Card, Badge
    forms/                   BookingForm, SitterForm
    admin/                   nav, stat cards, tables, status badges
    SitterCard, Navbar, Footer, FAQ
  lib/
    supabase/                client.ts, server.ts, admin.ts
    auth.ts                  requireAdmin / getCurrentProfile
    validation.ts            Zod schemas
    constants.ts, types.ts   shared options + types
    payments.ts              STUB (Stripe / Vipps seam)
    future-features.ts       documented stubs for later features
supabase/
  migrations/                0001_init, 0002_rls, 0003_storage
  seed.sql
scripts/
  create-admin.ts
```

---

## Roadmap (architected, not yet built)

These have clear seams in the code (`src/lib/future-features.ts`, `src/lib/payments.ts`, the `booking_updates` table, the `sitter-photos` bucket):

- Online payments (Stripe / Vipps)
- Live GPS walk tracking
- Photo updates from sitters
- In-app messaging
- Sitter availability calendar
- Buyer accounts & sitter dashboard

---

## Founder to-do (outside the code)

- Register the Supabase project and add env vars
- Create the admin user (above)
- Interview & ID-verify sitter applicants; approve/reject manually
- Collect references manually and toggle the verification badges
- Match buyers to sitters and manage bookings in `/admin`
- Handle payments and disputes manually for the MVP
- Decide final pricing
- Write proper Terms & Privacy with legal help
- Recruit your first ~20 sitters and ~20 buyers in Grünerløkka

---

## Localisation

UI text is in English for now but isolated for easy translation: labels live in `src/lib/constants.ts` and component copy is plain text. A future i18n layer only needs to wrap these.
