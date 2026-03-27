# Whenny

[![CI](https://github.com/ZVN-DEV/whenny/actions/workflows/ci.yml/badge.svg)](https://github.com/ZVN-DEV/whenny/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/whenny.svg)](https://www.npmjs.com/package/whenny)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://www.npmjs.com/package/whenny)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)

**[Documentation](https://whenny.dev)** | **[Demo](https://whenny.dev/demo)** | **[npm](https://www.npmjs.com/package/whenny)**

A modern TypeScript date formatting library. Zero dependencies. Own your code.

## How Whenny Is Different

| Feature | Whenny | date-fns | Day.js | Luxon | Tempo |
|---------|--------|----------|--------|-------|-------|
| **Own your code** (shadcn-style install) | Yes | No | No | No | No |
| **Size-based formatting** (.xs .sm .md .lg .xl) | Yes | No | No | No | No |
| **Configurable voice** (one config for all strings) | Yes | No | No | No | No |
| **Pre-built themes** (slack, github, discord, etc.) | 8 themes | No | No | No | No |
| **React hooks** (useRelativeTime, useCountdown) | Yes | No | No | No | No |
| **MCP server** (AI assistant integration) | Yes | No | No | No | No |
| **Server/client timezone sync** (Transfer Protocol) | Yes | No | No | No | No |
| **Smart contextual formatting** (auto-picks best) | Yes | No | No | No | No |
| Zero production dependencies | Yes | Yes | Yes | Yes | Yes |
| TypeScript native | Yes | Yes | Yes | Yes | Yes |
| Locales | 10 | 60+ | 100+ | Intl | Intl |
| Temporal API support | Yes | No | No | No | No |

Whenny is not trying to replace date-fns or Day.js. It sits on top of the Date API and solves the **display layer** — how dates appear to users. The part every team builds custom.

## Installation

### shadcn Style (Copy Code Into Your Project)

```bash
npx create-whenny init
npx create-whenny add relative smart calendar
```

Code is copied to `src/lib/whenny/`. You own it. Your AI assistant can read and modify it.

### npm Package

```bash
npm install whenny whenny-react
```

## Size-Based Formatting (Datewind)

Like Tailwind for dates. Simple properties instead of cryptic format strings:

```typescript
import { whenny } from 'whenny'

whenny(date).xs        // "2/3"
whenny(date).sm        // "Feb 3"
whenny(date).md        // "Feb 3, 2026"
whenny(date).lg        // "February 3rd, 2026"
whenny(date).xl        // "Tuesday, February 3rd, 2026"

whenny(date).clock     // "3:45 PM"
whenny(date).sortable  // "2026-02-03"
whenny(date).log       // "2026-02-03 15:45:30"
```

Compare with date-fns: `format(date, "EEEE, MMMM do, yyyy")` vs `whenny(date).xl`

## Smart & Relative Formatting

```typescript
// Automatically picks the best representation based on distance from now
whenny(date).smart()
// → "just now"           (< 1 min)
// → "5 minutes ago"      (< 1 hour)
// → "Yesterday at 3:45 PM"
// → "Monday at 9:00 AM"  (this week)
// → "Jan 15"             (this year)
// → "Jan 15, 2024"       (older)

// Classic relative time
whenny(date).relative()  // "5 minutes ago"
```

## Themes

One line changes how every date in your app looks:

```typescript
import { themes } from 'whenny/themes'
import { configure } from 'whenny'

configure(themes.slack)
```

| Theme | "5 min ago" | "Yesterday" | Best For |
|-------|------------|-------------|----------|
| `casual` | "5 minutes ago" | "Yesterday at 3:45 PM" | Consumer apps |
| `formal` | "5 minutes ago" | "Yesterday at 15:45" | Business apps |
| `slack` | "5m" | "Yesterday 3:45 PM" | Chat/messaging |
| `twitter` | "5m" | "Yesterday" | Social feeds |
| `discord` | "Today at 3:45 PM" | "Yesterday at 3:45 PM" | Community |
| `github` | "5 minutes ago" | "yesterday" | Developer tools |
| `minimal` | "5 min" | "1d" | Dashboards |
| `technical` | "300s" | "86400s" | Monitoring |

## Duration Formatting

```typescript
import { duration } from 'whenny'

duration(3661).long()      // "1 hour, 1 minute, 1 second"
duration(3661).compact()   // "1h 1m 1s"
duration(3661).clock()     // "1:01:01"
duration(3661).timer()     // "01:01:01"
duration(7200).human()     // "2 hours"
```

## Calendar Helpers

```typescript
import { calendar } from 'whenny'

calendar.isToday(date)            // true
calendar.isWeekend(date)          // false
calendar.isBusinessDay(date)      // true
calendar.daysUntil(futureDate)    // 7
calendar.addBusinessDays(date, 5) // Date (skips weekends)
```

## Date Comparison

```typescript
import { compare } from 'whenny'

compare(dateA, dateB).smart()   // "2 days before"
compare(dateA, dateB).days()    // 2
compare(dateA, dateB).hours()   // 48
```

## React Hooks

Auto-updating, SSR-safe hooks for React:

```tsx
import { useRelativeTime, useCountdown } from 'whenny-react'

function Comment({ createdAt }) {
  const time = useRelativeTime(createdAt)  // auto-updates
  return <span>{time}</span>               // "5 minutes ago"
}

function Sale({ endsAt }) {
  const { days, hours, minutes, seconds } = useCountdown(endsAt)
  return <span>{days}d {hours}h {minutes}m {seconds}s</span>
}
```

## Transfer Protocol (Server/Client Timezone Sync)

Solves the #1 timezone bug in SSR apps — server renders UTC, browser shows local time, user sees garbage:

```typescript
// Server: serialize with timezone context
import { createTransfer } from 'whenny'

const payload = createTransfer(event.date, { timezone: 'America/New_York' })
// → { iso: "2026-03-15T15:00:00", originZone: "America/New_York", originOffset: -300 }

// Client: deserialize and format correctly
import { fromTransfer, whenny } from 'whenny'

const { date, originZone } = fromTransfer(payload)
whenny(date).inZone(originZone).clock  // "3:00 PM" ← always correct
```

## Configuration

One file controls every string in your app:

```typescript
// whenny.config.ts
import { defineConfig } from 'whenny/config'

export default defineConfig({
  locale: 'en-US',
  relative: {
    justNow: 'moments ago',
    minutesAgo: (n) => `${n}m ago`,
    hoursAgo: (n) => `${n}h ago`,
  },
  styles: {
    xs: 'D/M',
    sm: 'D MMM',
    md: 'D MMM YYYY',
    lg: 'D MMMM YYYY',
    xl: 'dddd, D MMMM YYYY',
  },
  calendar: {
    weekStartsOn: 'monday',
    businessDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  },
})
```

## MCP Server (AI Integration)

AI assistants like Claude can use Whenny's date functions directly via MCP:

```json
{
  "mcpServers": {
    "whenny": {
      "command": "npx",
      "args": ["create-whenny", "mcp"]
    }
  }
}
```

10 tools available: `whenny`, `format_datewind`, `format_smart`, `format_relative`, `format_duration`, `compare_dates`, `calendar_check`, `add_business_days`, `parse_natural`, `create_transfer`.

## Natural Language Parsing

```typescript
import { parse } from 'whenny/natural'

parse('tomorrow at 3pm')   // Date object
parse('next friday')       // Date object
parse('in 2 hours')        // Date object
parse('december 25th')     // Date object
```

## Internationalization

10 built-in locales: `en`, `es`, `fr`, `de`, `ja`, `zh`, `pt`, `it`, `ko`, `ar`

```typescript
import { getLocale, registerLocale } from 'whenny'

const spanish = getLocale('es')

// Or register your own
registerLocale('custom', {
  justNow: 'right now',
  minutesAgo: (n) => `${n} min ago`,
  // ...
})
```

## Temporal API Support

Whenny accepts `Temporal.Instant` and `Temporal.ZonedDateTime` as inputs, forward-compatible with the TC39 Temporal API (shipping in Chrome 144 and Firefox 139):

```typescript
const instant = Temporal.Now.instant()
whenny(instant).lg  // works seamlessly
```

## CLI Commands

```bash
npx create-whenny init          # Initialize in your project
npx create-whenny add smart     # Add specific modules
npx create-whenny list          # List available modules
npx create-whenny diff          # Show changes from latest version
npx create-whenny mcp           # Start the MCP server
npx create-whenny test-install  # Full integration test
```

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| [`whenny`](packages/whenny/) | Core date library (zero deps) | [![npm](https://img.shields.io/npm/v/whenny.svg)](https://www.npmjs.com/package/whenny) |
| [`whenny-react`](packages/whenny-react/) | React hooks (SSR-safe) | [![npm](https://img.shields.io/npm/v/whenny-react.svg)](https://www.npmjs.com/package/whenny-react) |
| [`create-whenny`](packages/create-whenny/) | CLI (shadcn-style install) | [![npm](https://img.shields.io/npm/v/create-whenny.svg)](https://www.npmjs.com/package/create-whenny) |

## Why Not Just Use date-fns or Day.js?

They're great libraries. Use them if you need 60+ locales or 200+ manipulation functions.

Use Whenny if you want:
- **Code you own** — shadcn-style, in your repo, readable by AI
- **Consistent date voice** — one config instead of scattered format strings
- **Smart formatting** — automatic "just now" / "yesterday" / "Jan 15" without building it yourself
- **React hooks** — `useRelativeTime` and `useCountdown` out of the box
- **Themes** — match Slack, GitHub, Discord style with one line
- **Timezone sync** — Transfer Protocol solves SSR timezone bugs

## Stats

- 374 tests, TypeScript strict mode, zero production dependencies
- 10 locales, 8 themes, 10 MCP tools
- Supports native `Date`, ISO strings, Unix timestamps, and `Temporal` objects

## License

MIT

---

Built by [ZVN DEV](https://github.com/ZVN-DEV). Own your code. Configure your voice.
