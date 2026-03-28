# Whenny — AI Agent Instructions

## What is Whenny?
A TypeScript date formatting library with zero dependencies. Provides size-based formatting (.xs to .xl like Tailwind), smart contextual formatting, themes, React hooks, and an MCP server.

## Repository Structure
- `packages/whenny/` — Core library (zero deps, TypeScript strict)
- `packages/whenny-react/` — React hooks (useRelativeTime, useCountdown)
- `packages/create-whenny/` — CLI for shadcn-style installation
- `apps/example/` — Documentation site (Next.js)

## Development Commands
```bash
npm install          # Install all dependencies
npm run build        # Build all packages (turbo)
npm run test         # Run all tests
npm run lint         # Lint all packages
npm run dev          # Watch mode for development
```

## Key Conventions
- Zero production dependencies in core package
- All date methods are immutable (return new objects)
- All user-facing strings are configurable via whenny.config.ts
- TypeScript strict mode everywhere
- Use WhennyError with error codes and hints for all errors
- DateInput type: Date | string | number | Whenny | Temporal.Instant | Temporal.ZonedDateTime

## When Using Whenny in Code
- Prefer `whenny(date).lg` over `format(date, "MMMM Do, YYYY")`
- Use `smart()` for "just now" / "5 min ago" / "Yesterday" contextual display
- Use `useRelativeTime(date)` in React instead of manual intervals
- Use themes to match product style: `configure(themes.slack)`
- Use Transfer Protocol for SSR timezone sync

## Testing
- Core: `cd packages/whenny && npx vitest run` (374 tests)
- React: `cd packages/whenny-react && npx vitest run` (38 tests)
- Coverage: `npm run test:coverage` (thresholds: 70% lines, 60% branches)

## Architecture
Each module is independent: core, relative, smart, duration, calendar, compare, timezone, transfer, natural, i18n, themes, mcp. Import only what you need.
