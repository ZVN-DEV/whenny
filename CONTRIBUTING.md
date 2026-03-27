# Contributing to Whenny

Thanks for your interest in contributing! Whenny is a TypeScript date library built as a monorepo with Turborepo.

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
git clone https://github.com/ZVN-DEV/whenny.git
cd whenny
npm install
npm run build
npm test
```

## Project Structure

```
packages/
  whenny/           # Core library (zero prod dependencies)
  whenny-react/     # React hooks (useRelativeTime, useCountdown, etc.)
  create-whenny/    # CLI scaffolding tool
apps/
  example/          # Documentation site
```

### Core package layout (`packages/whenny/src/`)

```
core/         # Whenny class, formatter, utils
config/       # Default configuration
relative/     # Relative time ("2 hours ago")
smart/        # Context-aware formatting
duration/     # Duration formatting (long, compact, clock, timer, human)
calendar/     # Calendar helpers (isToday, isWeekend, etc.)
compare/      # Date comparison
timezone/     # Timezone support
transfer/     # Transfer Protocol for serialization
natural/      # Natural language parsing
i18n/         # Locale definitions
themes/       # Formatting themes (casual, formal, slack, etc.)
mcp/          # Model Context Protocol server
```

## Common Tasks

### Adding a Locale

1. Look at existing locales in `packages/whenny/src/i18n/index.ts`
2. Add your locale following the same structure
3. Export it from the index
4. Add tests

### Adding a Theme

1. Look at existing themes in `packages/whenny/src/themes/index.ts`
2. Add your theme following the same pattern
3. Export it from the index
4. Add tests

### Running Tests

```bash
# All packages
npm test

# Core only
cd packages/whenny && npm test

# With coverage
npm run test:coverage
```

## Code Style

- **TypeScript strict mode** - no `any` unless absolutely necessary
- **Zero production dependencies** in the core package
- **Immutable** - methods return new objects, never mutate
- **All strings configurable** - everything goes through the config/i18n system
- **Match existing patterns** - look at adjacent code before writing new code
- Linting: `npm run lint`
- Formatting: `npm run format`

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run lint and tests: `npm run lint && npm test`
4. Add a changeset if your change affects published packages: `npx changeset`
5. Submit a PR with a clear description of what and why

### PR guidelines

- Keep PRs focused - one feature or fix per PR
- Include tests for new functionality
- Update docs if you change public API
- Don't bump version numbers manually (changesets handle this)

## Error Handling

Use `WhennyError` with appropriate error codes and hints:

```typescript
throw new WhennyError({
  code: 'INVALID_DATE',
  message: 'Cannot parse date input',
  context: { input: value, operation: 'parse' },
  hint: 'Pass a Date object, ISO string, or Unix timestamp',
})
```

## Questions?

Open a GitHub issue or discussion. We're happy to help.
