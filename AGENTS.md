<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Cre8Market

Next.js 16 App Router + React 19 + TypeScript (strict), Tailwind CSS 4 (CSS-first config in `app/globals.css` — there is no `tailwind.config.*`). Postgres/Neon via raw SQL. Marketplace for Entebbe, Entebbe. See `README.md` for routes and env vars.

## Commands

```bash
pnpm dev              # dev server on :3000 (Turbopack default)
pnpm lint             # biome check — formats AND lints in one pass
pnpm lint:fix         # biome check --write (safe autofixes)
pnpm typecheck        # runs tsc TWICE: main project + tsconfig.sw.json (service worker)
pnpm test             # vitest run (unit tests)
pnpm test lib/plans.test.ts            # single unit test file
pnpm test:e2e         # playwright; auto-starts/reuses dev server on :3000
pnpm test:e2e e2e/auth.spec.ts         # single e2e spec
pnpm migrate          # apply numbered SQL migrations (idempotent)
```

- CI order (`.github/workflows/ci.yml`): `pnpm typecheck` → `pnpm lint` → `pnpm test` → `pnpm build`. Node 22, pnpm 9. Playwright is NOT run in CI.
- Biome is the only lint/format tool (no ESLint/Prettier). Double quotes, 100-char lines, organize-imports on.
- `pnpm typecheck` compiles two projects: the main `tsconfig.json` (excludes `scripts/` and `app/sw.ts`) plus `tsconfig.sw.json` (webworker lib, `app/sw.ts` only). Changing the service worker requires both to pass.
- `migrate`/`seed:deals`/`seed:plans` run with `node --env-file=.env.local` — they fail without a populated `.env.local` (copy from `.env.example`). A new migration is just a new numbered `.sql` file in `migrations/`; each runs in a transaction and is tracked in `schema_migrations`.
- `pnpm build` prerenders `/`, `/deals` and `/sellers` (ISR `revalidate = 60`), so it queries the DB. Those pages catch DB failures and fall back to `lib/data.ts` or empty lists, so a build can "succeed" with a dead DB and render placeholder listings.

## Architecture notes

- **No ORM.** Raw parameterized SQL mostly in `lib/db/queries.ts`, always through the shared `pool` from `lib/db/pool.ts` (Neon free-tier cold-start retries; force-appends `sslmode=verify-full` for `*.neon.tech` URLs). Don't create ad-hoc `pg` clients in app code — only `scripts/` does. A few auth queries are inline in `lib/auth.ts` and `lib/actions/auth.ts`. (`kysely` appears only inside better-auth's adapter.)
- **Authorization is two-layer.** `proxy.ts` at the repo root is Next 16's middleware (renamed convention — don't "fix" it back to `middleware.ts`). It only checks that a better-auth session cookie exists before redirecting, and deliberately matches `__Secure-`-prefixed and chunked (`better-auth.session_token.0`) names — simplifying that breaks prod logins. Every Server Action must re-check the role itself: most `lib/actions/*.ts` files define a local `requireAdmin`/`requireUser` (duplicated per file, not shared; `chats.ts` uses `currentViewer()` instead, and `auth.ts` actions are public PIN-verified flows). New action files need their own guard; the proxy is not authorization.
- **Admins are a separate table.** Admin accounts live in `admin_users`, not `users`; `auth()` returns `role: "admin"` by looking up the session email there. `getAdminUsers()` is ordered by `created_at`, so the first row is the "main admin" — the only account allowed to manage other admins. `/admin/login` and `/admin/reset-password` are public.
- **Login must go through `signIn()` in `lib/auth-client.ts`.** It POSTs `/api/auth/legacy-sync` first (mirrors phone users and `admin_users` rows into better-auth) and only then calls `signIn.email`. Calling `authClient.signIn.email` directly skips the sync and breaks phone/legacy accounts. The handler folder is still `app/api/auth/[...nextauth]/route.ts` even though better-auth provides the handler.
- **Password resets:** users self-reset with a 4-digit `pin_hash`; legacy accounts without a PIN need an admin reset. Admin resets require `ADMIN_RESET_PIN` and are disabled when it is unset (there is intentionally no default).
- **Plan limits:** `PLAN_LIMITS` in `lib/plans.ts` is the single source shared by the listing forms and Server Actions. Effective plan comes from `users.is_verified` (Standard) / `is_vip` (Premium); admin listings get `ADMIN_IMAGE_LIMIT`.
- **Schema changes:** add a numbered `migrations/NNNN_*.sql` and mirror it in `lib/db/schema.sql`, the idempotent reference schema (it has drifted before — `0006` backfilled tables that existed only there). The handle slug rules in `lib/seller-handle.ts` are duplicated in `migrations/0005_seller_handles.sql`; keep the two in sync.
- **Service worker**: `app/sw.ts` is not a normal Next bundle — `app/serwist/[path]/route.ts` compiles it (esbuild) and serves it at `/serwist/sw.js` with scope `/`. It must keep private paths (`/admin`, `/dashboard`, auth pages, `/api/push/*`) on `NetworkOnly` — caching them leaks sessions on shared devices.
- **Images**: compressed client-side to JPEG data URLs (`lib/imageCompress.ts`), then `lib/uploadImage.ts` POSTs the data URL to `/api/upload-image` (session required; forwards to Cloudinary). If Cloudinary is not configured the helper silently keeps the data URL. This is an API route, not a Server Action; the 10 MB `serverActions.bodySizeLimit` covers listing actions that embed those images.
- Server Actions live in `lib/actions/`; path alias `@/*` maps to the repo root (mirrored in `vitest.config.mts`).
- **Tests**: unit tests (`lib/**/*.test.ts`) are pure and need nothing. E2E hits a real dev server + database; `products.spec.ts` fails without seeded listings (`pnpm seed:deals`).
