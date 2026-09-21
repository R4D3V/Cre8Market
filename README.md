# CRE8MARKET

A full clone of [cre8market.com](https://cre8market.com) — a buy-and-sell
marketplace for Entebbe, Uganda. Listings, a wanted board, hot deals, an admin
dashboard, AI-assisted listing creation, push notifications and phone-based
accounts.

## Tech Stack

| Layer      | Technology |
|------------|-----------|
| Framework  | **Next.js 16** (App Router, React Server Components, Server Actions) |
| UI         | **React 19**, **Tailwind CSS 4** (CSS-first config), `next/font` (Inter, Sora), `lucide-react` |
| Language   | **TypeScript 5** (strict) |
| Database   | **PostgreSQL** on **Neon** via `pg` pool (with cold-start retry wrapper) |
| ORM / SQL  | Raw parameterized SQL through a shared `pool` (see `lib/db/queries.ts`) |
| Auth       | **better-auth** (email + password, phone-based legacy accounts, bcrypt) |
| AI         | **OpenAI** `gpt-4o-mini` — auto-fills listing details on `/sell` |
| Push       | **web-push** (VAPID) — browser notifications |
| PWA        | `public/manifest.json` + install prompt |
| Scripts    | `scripts/seed-deals.mjs` (seeds the `/deals` page) |

## Getting Started

```bash
cp .env.example .env.local   # then fill in your values
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

You need a Postgres database (a free **Neon** project works — the pool appends
`sslmode=verify-full` automatically). Schema is in `lib/db/schema.sql`; apply it
with your DB tool, then run `pnpm seed:deals` to populate the deals page.

## Environment Variables

See `.env.example` for the full annotated list. The essentials:

- `DATABASE_URL` — Postgres connection string (required)
- `AUTH_SECRET` — session signing secret (required in production)
- `OPENAI_API_KEY` — for the AI listing auto-fill
- `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `NEXT_PUBLIC_VAPID_PUBLIC_KEY` — web push
- `ADMIN_RESET_PIN` — backup PIN for admin password resets
- `NEXT_PUBLIC_APP_URL` — the app's public base URL (falls back to `http://localhost:3000`)

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | ESLint via Next.js |
| `pnpm test` | Run Vitest unit tests |
| `pnpm seed:deals` | Seed the `/deals` products (idempotent) |

## Routes

| Route | Description |
|---|---|
| `/` | Homepage — hero, featured/latest listings, hot deals |
| `/products` | All listings with sidebar filters (category, seller, price, search) |
| `/products/[slug]` | Product detail — contact seller, make offer, related items |
| `/deals` | Hot deals page |
| `/sellers` | Public seller directory with per-seller listings |
| `/sell` | Post a listing with AI auto-fill |
| `/selltous` | Sell your item to CRE8MARKET ENTEBBE for cash |
| `/login`, `/register`, `/reset-password` | Account management |
| `/dashboard` | Logged-in users — profile, listings |
| `/admin` | Admin dashboard — products, users, categories, admins |
| `/contact`, `/about`, `/privacy`, `/terms`, `/install` | Static/info pages |

## API Routes

- `POST /api/ai-product-fill` — AI-generated listing details (OpenAI)
- `/api/auth/*` — better-auth handler + `/api/auth/legacy-sync`
- `/api/push/subscribe`, `/api/push/notify` — web push management/sending

## Folder Structure

```
app/                  Routes (pages + API handlers)
components/           UI components (Navbar, ProductCard, admin/dashboard UIs)
lib/
  actions/            Server Actions (admin, auth, categories, products, push, users)
  auth.ts             better-auth server config + legacy user sync
  auth-client.ts      better-auth browser client helpers
  db/pool.ts          pg pool with Neon cold-start retry
  db/queries.ts       All SQL — products, users, categories, push, admins
  db/schema.sql       Postgres schema (safe to re-run)
  env.ts              Central app-URL / env resolution
  imageCompress.ts    Client-side canvas image compression
  push.ts             web-push sender
  types.ts            Domain types
  data.ts             Price formatting helpers + fallback product data
scripts/seed-deals.mjs  Seeds the deals page (idempotent)
```

## Notes

- **Query style**: everything goes through the parameterized `pool` from
  `lib/db/pool.ts` (which retries transient Neon cold-start failures) — no ORM
  query builder.
- **Auth**: legacy phone-based accounts (phone + password + 4-digit reset PIN)
  are synced into better-auth's schema under `<digits>@cre8market.local` emails.
- **Images**: uploads are compressed client-side to JPEG data URLs before being
  sent through a Server Action (10 MB body limit in `next.config.ts`).