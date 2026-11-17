<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Cre8Market

Next.js 16 App Router + React 19 + TypeScript (strict), Tailwind CSS 4 (CSS-first config in `app/globals.css` — there is no `tailwind.config.*`). Marketplace for Entebbe, Uganda. See `README.md` for routes and env vars.

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

- CI (`pnpm typecheck` → `pnpm lint` → `pnpm test` → `pnpm build`) is the verification order. Node 22, pnpm 9.
- Biome is the only lint/format tool (no ESLint/Prettier). Double quotes, 100-char lines, organize-imports on.
- `pnpm typecheck` compiles two projects: the main `tsconfig.json` (excludes `scripts/` and `app/sw.ts`) plus `tsconfig.sw.json` (webworker lib, `app/sw.ts` only). Changing the service worker requires both to pass.
- `migrate`/`seed:deals`/`seed:plans` run with `node --env-file=.env.local` — they fail without a populated `.env.local` (copy from `.env.example`). A new migration is just a new numbered `.sql` file in `migrations/`; each runs in a transaction and is tracked in `schema_migrations`.

## Architecture notes

- **No ORM.** All SQL is raw parameterized strings in `lib/db/queries.ts`, run through the shared `pool` from `lib/db/pool.ts`. That pool wraps `query()` with retries for Neon free-tier cold starts and force-appends `sslmode=verify-full` for `*.neon.tech` URLs — don't bypass it or create ad-hoc `pg` clients. (`kysely` appears only inside better-auth's adapter.)
- **`proxy.ts` at the repo root is Next 16's middleware** (renamed convention — don't "fix" it back to `middleware.ts`). It guards `/admin` and `/dashboard` by cookie presence, and deliberately matches `__Secure-`-prefixed and chunked (`better-auth.session_token.0`) cookie names; simplifying that breaks prod logins.
- **Service worker**: `app/sw.ts` is not a normal Next bundle — `app/serwist/[path]/route.ts` compiles it (esbuild) and serves it at `/serwist/sw.js` with scope `/`. It must keep private paths (`/admin`, `/dashboard`, auth pages, `/api/push/*`) on `NetworkOnly` — caching them leaks sessions on shared devices.
- **Auth**: better-auth handles `/api/auth/*`; legacy phone-based accounts are synced into it as `<digits>@cre8market.local` emails (see `lib/auth.ts`).
- **Images**: compressed client-side to JPEG data URLs (`lib/imageCompress.ts`), sent through a Server Action — the 10 MB `serverActions.bodySizeLimit` in `next.config.ts` exists for this. Uploads land on Cloudinary.
- Server Actions live in `lib/actions/`; path alias `@/*` maps to the repo root (mirrored in `vitest.config.mts`).
- E2E tests hit a real dev server + database (auth fixture in `e2e/fixtures/auth.ts` registers/logs in a real user); unit tests (`lib/**/*.test.ts`, `tests/**/*.test.ts`) need nothing.
