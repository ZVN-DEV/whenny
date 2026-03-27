# Whenny - AI Development Guide

## Overview

Whenny is a TypeScript date formatting library ("date-fns for the AI era"). Monorepo with 3 published packages:

- **whenny** - Core library, zero production dependencies
- **whenny-react** - React hooks for date formatting
- **create-whenny** - CLI scaffolding tool

## Architecture

The core package (`packages/whenny/src/`) has independent feature modules:

| Module | Purpose |
|--------|---------|
| `core/` | `Whenny` class, `formatter.ts`, `utils.ts` |
| `config/` | Default configuration and config merging |
| `relative/` | Relative time formatting ("2 hours ago") |
| `smart/` | Context-aware formatting (picks format based on distance) |
| `duration/` | Duration display (long, compact, clock, timer, human) |
| `calendar/` | Date queries (isToday, isWeekend, isBusinessDay, etc.) |
| `compare/` | Date comparison operators |
| `timezone/` | Timezone conversion |
| `transfer/` | Transfer Protocol for serialization across boundaries |
| `natural/` | Natural language date parsing |
| `i18n/` | Locale definitions (10 locales) |
| `themes/` | Formatting presets (casual, formal, slack, twitter, discord, github, minimal, technical) |
| `mcp/` | Model Context Protocol server with tool parameter validation |

## Key Conventions

- **Zero production dependencies** in core. Everything is self-contained.
- **Immutable** - all methods return new `Whenny` instances, never mutate.
- **All strings configurable** via config/i18n. No hardcoded user-facing text.
- **TypeScript strict** - `strict: true`, avoid `any`.
- **`WhennyError`** with codes, context, and hints. Every error has a `code` (e.g., `INVALID_DATE`, `PARSE_FAILED`), context about what was attempted, and a human-readable `hint` for resolution.
- **Datewind size tokens** - formatting uses t-shirt sizes: `xs`, `sm`, `md`, `lg`, `xl`.
- **Temporal API support** - accepts `Temporal.Instant` and `Temporal.ZonedDateTime` via duck-typing.

## Build & Test

```bash
# Build all packages (uses Turborepo)
npm run build

# Test core package
cd packages/whenny && npm test

# Test all packages
npm test

# Lint
npm run lint

# Type check
npm run typecheck
```

## Important Patterns

### Error creation
```typescript
throw new WhennyError({
  code: 'INVALID_DATE',
  message: 'Cannot parse date input',
  context: { input: value, operation: 'parse' },
  hint: 'Pass a Date object, ISO string, or Unix timestamp',
})
```

### DateInput type
```typescript
type DateInput = Date | string | number | Whenny
// Also accepts Temporal.Instant and Temporal.ZonedDateTime at runtime
```

### Adding features
Each feature module follows the same pattern:
1. Create a directory under `src/`
2. Implement the feature with its own types
3. Export from `src/index.ts`
4. Add tests in the package test directory

## File Layout

```
packages/whenny/src/
  index.ts          # Public API exports
  types.ts          # Core type definitions (DateInput, TimeUnit, etc.)
  errors.ts         # WhennyError class and error codes
  core/
    whenny.ts       # Main Whenny class
    formatter.ts    # Format engine with datewind tokens
    utils.ts        # Internal date utilities
  config/
    defaults.ts     # Default configuration values
    index.ts        # Config merging and validation
  [feature]/
    index.ts        # Feature module entry point
```

## Versioning

Uses [changesets](https://github.com/changesets/changesets). All three packages are linked - a version bump in one triggers the others. Add a changeset with `npx changeset` before submitting PRs that change published packages.
