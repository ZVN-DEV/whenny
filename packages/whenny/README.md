# whenny

Modern TypeScript date formatting library. Zero dependencies. Own your code.

**[Full Documentation](https://whenny.dev)** | **[GitHub](https://github.com/ZVN-DEV/whenny)** | **[Demo](https://whenny.dev/demo)**

## What Makes Whenny Different

- **shadcn-style install** — `npx create-whenny add smart relative` copies code into your project. You own it.
- **Size-based formatting** — `whenny(date).lg` instead of `format(date, "MMMM Do, YYYY")`
- **8 pre-built themes** — Slack, GitHub, Discord, Twitter, and more. One line to match your product.
- **Configurable voice** — One `whenny.config.ts` controls every output string in your app.
- **React hooks** — `useRelativeTime` and `useCountdown` with auto-updating, SSR-safe.
- **MCP server** — AI assistants (Claude, ChatGPT) can use date functions directly.
- **Transfer Protocol** — Solves server/client timezone sync in SSR apps.
- **Zero dependencies** — Pure TypeScript, tree-shakeable, 374 tests.

## Quick Start

```typescript
import { whenny, compare, duration, calendar } from 'whenny'

// Size-based formatting (like Tailwind for dates)
whenny(date).xs        // "2/3"
whenny(date).sm        // "Feb 3"
whenny(date).md        // "Feb 3, 2026"
whenny(date).lg        // "February 3rd, 2026"
whenny(date).xl        // "Tuesday, February 3rd, 2026"

// Smart formatting — auto-picks the best representation
whenny(date).smart()   // "just now" / "5 min ago" / "Yesterday" / "Jan 15"

// Relative time
whenny(date).relative() // "5 minutes ago"

// Duration
duration(3661).compact() // "1h 1m 1s"

// Calendar
calendar.isBusinessDay(date)     // true
calendar.addBusinessDays(date, 5) // skips weekends

// Comparison
compare(dateA, dateB).smart()    // "2 days before"
```

## Themes

```typescript
import { themes } from 'whenny/themes'
import { configure } from 'whenny'

configure(themes.slack)   // "5m", "Yesterday 3:45 PM"
configure(themes.github)  // "5 minutes ago", "yesterday"
configure(themes.discord) // "Today at 3:45 PM"
```

## vs date-fns / Day.js / Luxon

| Feature | whenny | date-fns | Day.js | Luxon |
|---------|--------|----------|--------|-------|
| Own your code (shadcn-style) | Yes | No | No | No |
| Size-based formatting | Yes | No | No | No |
| Configurable voice | Yes | No | No | No |
| Pre-built themes | 8 | No | No | No |
| React hooks | Yes | No | No | No |
| MCP server (AI) | Yes | No | No | No |
| Smart formatting | Yes | No | No | No |
| Transfer Protocol | Yes | No | No | No |
| Zero deps | Yes | Yes | Yes | Yes |
| Locales | 10 | 60+ | 100+ | Intl |

Whenny is the **display layer** — how dates appear to users. Use it alongside date-fns for manipulation if you need both.

## Install

```bash
npm install whenny
```

Or shadcn-style:

```bash
npx create-whenny init
npx create-whenny add relative smart calendar
```

## Related Packages

- [`whenny-react`](https://www.npmjs.com/package/whenny-react) — React hooks (useRelativeTime, useCountdown)
- [`create-whenny`](https://www.npmjs.com/package/create-whenny) — CLI for shadcn-style installation + MCP server

## License

MIT — [GitHub](https://github.com/ZVN-DEV/whenny)
