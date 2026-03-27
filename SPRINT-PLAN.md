# Sprint Plan — Whenny
Generated: 2026-03-27
Based on: Product Review (conversation) — 8/10 prototype, 4.5/10 product

## Sprint Goal
Take Whenny from 4.5/10 product score to 7.5+ by hardening the docs site, fixing security gaps, improving the core library, strengthening CI, and creating a real adoption strategy.

## Success Criteria
- [ ] All P0 security issues resolved (rehype-sanitize, path traversal, CSP headers)
- [ ] All P1 UX issues resolved (error boundaries, loading states, accessibility)
- [ ] CI pipeline includes lint + coverage reporting
- [ ] Core library performance improved (Intl.DateTimeFormat caching)
- [ ] Competitive gap narrowed (more locales)
- [ ] Adoption strategy created and partially implemented (SEO, Dev.to, social)
- [ ] Both review agents return PASS or YES WITH CAVEATS

## Agent Roster

| Agent | Role | Scope |
|-------|------|-------|
| PM (orchestrator) | Sprint coordination, quality gates | All |
| CEO Agent | Adoption strategy, SEO, marketing plan | Strategy docs + SEO code |
| Dev Agent 1 | Docs site UX, blog, accessibility | apps/example/app/**/*.tsx |
| Dev Agent 2 | Security & CLI hardening | next.config.js, mcp/, create-whenny/ |
| Dev Agent 3 | Core library polish | packages/whenny/src/, package.json files |
| Dev Agent 4 | CI/Build pipeline + SEO implementation | .github/, root configs, robots/sitemap |
| Review Agent 1 | Security + Code Quality | Full codebase |
| Review Agent 2 | UX + Product Polish | Full codebase |

## Dev Tracks

### Track 1: Docs Site UX & Accessibility — Dev Agent 1
**Files owned:** ALL files under `apps/example/app/` (*.tsx only)
**Tasks:**
- [ ] TASK-01 (P1): Create `error.tsx` at app root with styled error boundary
- [ ] TASK-02 (P1): Create `loading.tsx` at app root with skeleton/spinner
- [ ] TASK-03 (P1): Create `error.tsx` for blog, demo, docs, server routes
- [ ] TASK-04 (P0): Add `rehype-sanitize` to blog markdown rendering (`blog/[slug]/page.tsx`)
- [ ] TASK-05 (P1): Add skip-to-main-content link in `layout.tsx`
- [ ] TASK-06 (P2): Add `aria-hidden="true"` or `aria-label` to all inline SVG icons
- [ ] TASK-07 (P2): Add blog post navigation (next/prev links in `blog/[slug]/page.tsx`)
- [ ] TASK-08 (P2): Add `aria-current="page"` to active nav items in docs

### Track 2: Security & CLI Hardening — Dev Agent 2
**Files owned:** `apps/example/next.config.js`, `packages/whenny/src/mcp/`, `packages/create-whenny/src/commands/`
**Tasks:**
- [ ] TASK-09 (P0): Add CSP and HTTP security headers to `next.config.js`
- [ ] TASK-10 (P0): Fix path traversal in CLI `init.ts` and `add.ts` (validate resolved path is within cwd)
- [ ] TASK-11 (P1): Fix `execSync` in `test-install.ts` to use safer patterns
- [ ] TASK-12 (P1): Add explicit type validation to MCP tool executor (`mcp/index.ts`)
- [ ] TASK-13 (P2): Remove `dangerouslySetInnerHTML` for JSON-LD — wait, this is in layout.tsx which is Track 1. Reassign to Track 1.

### Track 3: Core Library Polish — Dev Agent 3
**Files owned:** `packages/whenny/src/core/`, `packages/whenny/src/i18n/`, all `package.json` files in packages/
**Tasks:**
- [ ] TASK-14 (P1): Cache `Intl.DateTimeFormat` instances by timezone in `formatter.ts`
- [ ] TASK-15 (P2): Add `engines` field to all package.json files (`node: ">=18"`)
- [ ] TASK-16 (P2): Add 4+ new locales (Portuguese, Italian, Korean, Arabic)
- [ ] TASK-17 (P2): Add Temporal input support (accept Temporal.Instant, Temporal.ZonedDateTime)

### Track 4: CI/Build Pipeline — Dev Agent 4
**Files owned:** `.github/workflows/`, root config files (eslint, root package.json scripts)
**Tasks:**
- [ ] TASK-18 (P1): Add `npm run lint` step to CI workflow
- [ ] TASK-19 (P1): Create ESLint config (eslint.config.js) at root
- [ ] TASK-20 (P2): Add coverage threshold enforcement in vitest config
- [ ] TASK-21 (P2): Optimize `apps/example/app/robots.ts` and `sitemap.ts` for SEO

### CEO Track: Adoption Strategy
**Output:** `ADOPTION-PLAN.md`
**Tasks:**
- [ ] TASK-22: SEO audit of whenny.dev and optimization recommendations
- [ ] TASK-23: Dev.to / Medium article strategy (titles, angles, timing)
- [ ] TASK-24: Twitter/X launch strategy
- [ ] TASK-25: Reddit strategy (r/javascript, r/typescript, r/webdev)
- [ ] TASK-26: AI search optimization (getting into Claude/ChatGPT training data)
- [ ] TASK-27: npm README optimization for discoverability
- [ ] TASK-28: GitHub repo optimization (topics, description, badges)
- [ ] TASK-29: shadcn registry listing strategy
- [ ] TASK-30: Comparison/migration guide strategy (from date-fns, Day.js)

## File Ownership Matrix (No Conflicts)

| File/Directory | Owner |
|----------------|-------|
| apps/example/app/**/*.tsx | Dev 1 |
| apps/example/next.config.js | Dev 2 |
| packages/whenny/src/mcp/ | Dev 2 |
| packages/create-whenny/src/commands/ | Dev 2 |
| packages/whenny/src/core/ | Dev 3 |
| packages/whenny/src/i18n/ | Dev 3 |
| packages/*/package.json | Dev 3 |
| .github/workflows/ | Dev 4 |
| Root eslint config | Dev 4 |
| apps/example/app/robots.ts | Dev 4 |
| apps/example/app/sitemap.ts | Dev 4 |

## Priority Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | 3 | rehype-sanitize, CSP headers, path traversal |
| P1 | 8 | Error boundaries, loading states, a11y, CLI safety, MCP validation, Intl cache, CI lint |
| P2 | 8 | Locales, engines field, coverage, blog nav, Temporal, SEO |
| Strategy | 9 | Adoption plan tasks |
