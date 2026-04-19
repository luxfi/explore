# lux/explore — Vite 8 SPA migration (WIP scaffold)

**Status**: Scaffold only. The Next.js app under `../pages` is still the production build.

## Why a scaffold, not a rewrite

A full Next.js → Vite conversion of this codebase is a multi-week project, not
a one-shot:

| Coupling point | Count |
|---|---|
| Total `next/*` imports | 427 |
| Files using `next/router` | 177 |
| Files using `nextjs-routes` generated types | 154 |
| Pages with `getServerSideProps` | 105 |
| `pages/` file-system routes | 99 |
| `pages/api/` server routes | 9 |

Plus: the Next.js runtime container has a custom `entrypoint.sh` that generates
`/assets/envs.js`, `envs-validator`, `sitemap-generator`, `favicon-generator`,
and `og-image-generator` — all tied to `next start`. `ghcr.io/hanzoai/spa` is
pure static serving; none of those runtime helpers run inside it.

## What this scaffold provides

- `vite/package.json` — Vite 8 + React 19.2 + wouter, no Next deps
- `vite/vite.config.ts` — aliases point at the *existing* `../lib`, `../ui`,
  `../configs`, `../toolkit`, `../nextjs` trees so source can be migrated file
  by file instead of moved
- `vite/tsconfig.json` — mirrors the aliases for TypeScript
- `vite/index.html` — security headers as `<meta>` tags (was `nextjs/headers.js`)
- `vite/src/env.ts` — runtime env resolution, preserves the `window.__envs`
  contract from `/assets/envs.js` and adds `VITE_API_BASE_URL` fallback
- `vite/src/redirects.ts` — port of `nextjs/redirects.js` as a client-side
  match + substitute table (69 rules, 4 deprecated permanent)
- `vite/src/App.tsx` — wouter router with redirect resolver + landing page
- `vite/Dockerfile` — 2-stage build → `ghcr.io/hanzoai/spa`

## What's NOT migrated

These are the tasks the next engineer must complete **before** this replaces
the production Next.js app:

1. **99 pages.** Every file in `../pages/*.tsx` needs to become a wouter
   `<Route>` in `src/App.tsx`. The component bodies *usually* transfer as-is
   because Blockscout components are already client-heavy — the hard part is:
   - `next/router` (177 files) → `useLocation` + `useSearch` from wouter
   - `nextjs-routes` (154 files) → a hand-maintained `Route` type union
   - `getServerSideProps` (105 files) → React Query `useQuery` hooks against
     the public API. The existing `nextjs/getServerSideProps/main.ts` helpers
     mostly just pre-fetched data that's also available client-side.
   - `next/dynamic` (heavy use in `_app.tsx`) → `React.lazy` + `Suspense`

2. **9 API routes.** These run server-side in Next.js; none can run in a
   static SPA. Options per route:
   - `/api/config` — runtime env injection. Replace with the SPA's existing
     `/assets/envs.js` pattern (the `hanzoai/spa` image can template this at
     container boot).
   - `/api/pchain` — CORS-avoiding proxy for JSON-RPC. Either (a) enable CORS
     on the gateway for `/ext/bc/P/*`, or (b) deploy a separate tiny Go proxy
     alongside the SPA. Option (a) is cleaner.
   - `/api/csrf`, `/api/proxy` — Blockscout account API auth. Must move to the
     same pattern: gateway-side, or the account API itself exposes them.
   - `/api/metrics` — Prometheus. Drop for frontend, or scrape the pod directly.
   - `/api/log`, `/api/healthz`, `/api/monitoring/*`, `/api/tokens/*` — re-home
     case by case. Most can be deleted — they were convenience endpoints.

3. **Runtime container tooling.** The existing `deploy/scripts/entrypoint.sh`
   wires together envs-validator, sitemap-generator, favicon-generator. These
   need either:
   - Moved to **build-time** (preferred — bake favicons + sitemap into `dist/`
     during Vite build), or
   - Rewritten as init-containers in K8s that populate the shared static
     volume before `hanzoai/spa` reads it.

4. **`next/image` usage.** There are ~60 imports. Replace with `<img>` + Vite's
   static asset imports, or add `vite-imagetools` if per-size variants matter.

5. **`next-themes`.** Replace with `@hanzo/gui` theme provider used by cloud/web.

6. **Tailwind.** Already configured via `postcss.config.mjs` — should Just Work
   once `vite/src/styles.css` pulls in the same `@tailwind` directives.

## Estimated migration effort

- **% of UI preserved at full completion**: ~85%. Blockscout's components are
  framework-agnostic React; only route wiring changes. The remaining 15% is
  `_app.tsx` providers, `_document.tsx` (replaced by `index.html`), and pages
  that lean on `getServerSideProps` for SEO-critical data.
- **Time to ship**: ~2–4 weeks for one engineer. The bulk is mechanical
  transform of `router.push(url)` → `navigate(url)` and deleting
  `getServerSideProps` exports.
- **Bail-out threshold**: If upstream Blockscout merges come in, re-evaluate.
  A permanent fork from Blockscout means owning all feature work forever.

## Critical TODOs before going live

1. `vite build` must produce a working `dist/` (currently builds an empty
   landing page — not the explorer)
2. Smoke-test every route group: `/block/:h`, `/tx/:h`, `/address/:h`,
   `/token/:h`, `/stats`, `/chains`, `/bridge`, `/account/*`, `/api-docs`
3. Wire React Query + replace `getServerSideProps` with `useQuery`
4. Validate runtime env injection via `window.__envs` from SPA container
5. Configure CSP for the SPA — current Next.js CSP in `nextjs/csp/` must port
6. Replace `/api/pchain` — enable gateway CORS OR ship a sidecar proxy
7. Decide favicon/sitemap generation strategy (build-time vs init-container)
8. `universe/` K8s manifests must switch image from `@luxfi/explore` (Next)
   to `@luxfi/explore-vite` (SPA) once parity is reached
9. Preserve `NEXT_PUBLIC_*` env names for a release cycle to avoid breaking
   operator deployments — map them inside `vite/src/env.ts` (already done)

## Reference implementation

`~/work/lux/cloud/apps/web/` is the canonical Vite 8 + wouter + `hanzoai/spa`
pattern. That app is ~2k LOC; `explore` is ~176k. The patterns copy over,
the volume does not.
