# Whenny

[![CI](https://github.com/ZVN-DEV/whenny/actions/workflows/ci.yml/badge.svg)](https://github.com/ZVN-DEV/whenny/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/whenny.svg)](https://www.npmjs.com/package/whenny)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A modern date library for the AI era.

**Own your code. Configure your voice. Never think about timezones again.**

## Why Whenny?

Whenny is different from other date libraries in three key ways:

1. **Own Your Code** — Like [shadcn/ui](https://ui.shadcn.com), Whenny can copy code directly into your project. Your AI assistant can read and modify it. No dependency lock-in.

2. **Configure Your Voice** — One config file controls every string Whenny outputs. Want formal language? Casual? Emoji-heavy? Change it once, update everywhere.

3. **Timezone Solved** — The Transfer Protocol carries timezone context across the wire. Server and browser always show the right time. Automatically.

4. **AI-Friendly** — Built with MCP server support so AI assistants can understand and use date functions directly.

## Installation

### NPM Package (Traditional)

```bash
npm install whenny whenny-react
```

### shadcn Style (Recommended)

```bash
npx whenny init
npx whenny add relative smart calendar
```

This copies the code directly into your project at `src/lib/whenny/`.

## Quick Start

### Datewind Styles (Recommended)

Like Tailwind for dates. Simple properties, consistent output:

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

### Smart & Relative Formatting

```typescript
// Smart formatting - picks the best representation automatically
whenny(date).smart()
// → "just now"
// → "5 minutes ago"
// → "Yesterday at 3:45 PM"
// → "Monday at 9:00 AM"
// → "Jan 15"

// Relative time
whenny(date).relative()           // "5 minutes ago"
```

### Duration Formatting

```typescript
import { duration } from 'whenny'

duration(3661).long()             // "1 hour, 1 minute, 1 second"
duration(3661).compact()          // "1h 1m 1s"
duration(3661).clock()            // "1:01:01"
duration(3661).timer()            // "01:01:01"
duration(7200).human()            // "2 hours"
```

### Calendar Helpers

```typescript
import { calendar } from 'whenny'

calendar.isToday(date)            // true
calendar.isWeekend(date)          // false
calendar.isBusinessDay(date)      // true
calendar.daysUntil(futureDate)    // 7
calendar.addBusinessDays(date, 5) // Date (skips weekends)
```

### Date Comparison

```typescript
import { compare } from 'whenny'

compare(dateA, dateB).smart()     // "2 days before"
compare(dateA, dateB).days()      // 2
compare(dateA, dateB).hours()     // 48
```

## React Hooks

```tsx
import { useRelativeTime, useCountdown } from 'whenny-react'

function Comment({ createdAt }) {
  // Auto-updates every minute
  const time = useRelativeTime(createdAt)
  return <span>{time}</span>
}

function Sale({ endsAt }) {
  // Live countdown
  const { days, hours, minutes, seconds } = useCountdown(endsAt)
  return <span>{days}d {hours}h {minutes}m {seconds}s</span>
}
```

## MCP Server (AI Integration)

Whenny includes an MCP (Model Context Protocol) server so AI assistants like Claude can use date functions directly:

```json
{
  "mcpServers": {
    "whenny": {
      "command": "npx",
      "args": ["whenny", "mcp"]
    }
  }
}
```

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `whenny` | Create a Whenny date instance |
| `format_datewind` | Format using Datewind styles (xs, sm, md, lg, xl) |
| `format_smart` | Smart context-aware formatting |
| `format_relative` | Relative time ("5 minutes ago") |
| `format_duration` | Duration formatting (long, compact, timer) |
| `compare_dates` | Compare two dates |
| `calendar_check` | Check calendar properties (isToday, isWeekend, etc.) |
| `add_business_days` | Add business days to a date |
| `parse_natural` | Parse natural language ("tomorrow at 3pm") |
| `create_transfer` | Create timezone-aware transfer payload |

```typescript
// Access MCP tools programmatically
import { mcpTools, executeMcpTool } from 'whenny'

const result = executeMcpTool('format_datewind', {
  date: '2024-01-15',
  style: 'lg'
})
// → "January 15th, 2024"
```

## Internationalization

Whenny supports multiple locales:

```typescript
import { getLocale, registerLocale, en, es, fr, de, ja, zh } from 'whenny'

// Get locale strings
const spanish = getLocale('es')

// Register custom locale
registerLocale('pt', {
  justNow: 'agora mesmo',
  minutesAgo: (n) => `${n} minutos atrás`,
  // ...
})
```

Built-in locales: `en`, `es`, `fr`, `de`, `ja`, `zh`

## Configuration

Create a `whenny.config.ts` in your project root:

```typescript
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

## Themes

Start with a pre-built theme that matches your product:

```typescript
import { themes } from 'whenny/themes'
import { configure } from 'whenny'

// Available themes: casual, formal, slack, twitter, discord, github, minimal, technical
configure(themes.slack)
```

| Theme | Example Output | Best For |
|-------|---------------|----------|
| `casual` | "5 minutes ago" | Consumer apps |
| `formal` | "5 minutes ago" | Business apps |
| `slack` | "5m" | Chat applications |
| `twitter` | "5m" | Social media |
| `discord` | "Today at 3:45 PM" | Gaming/community |
| `github` | "5 minutes ago" | Developer tools |
| `minimal` | "5 min" | Clean interfaces |
| `technical` | "300s" | Precise data |

## Transfer Protocol

The Transfer Protocol solves the server/browser timezone problem:

```typescript
// Server: serialize with timezone context
import { createTransfer } from 'whenny'

const response = {
  event: {
    name: 'Meeting',
    date: createTransfer(event.date, { timezone: 'America/New_York' })
  }
}

// Client: deserialize and format
import { fromTransfer, whenny } from 'whenny'

const { date, originZone } = fromTransfer(response.event.date)
whenny(date).inZone(originZone).clock
// → "3:00 PM" (original timezone preserved!)
```

## Natural Language Parsing

```typescript
import { parse } from 'whenny/natural'

parse('tomorrow at 3pm')        // Date object
parse('next friday')            // Date object
parse('in 2 hours')             // Date object
parse('december 25th')          // Date object
```

## CLI Commands

```bash
# Initialize whenny in your project
npx whenny init

# Add specific modules
npx whenny add relative smart calendar duration timezone

# List available modules
npx whenny list

# Show changes between your code and latest version
npx whenny diff
```

## Tests

All 374 tests passing. View tests:

- [Core tests](packages/whenny/test/)
- [React tests](packages/whenny-react/test/)

Run tests locally:

```bash
npm test
```

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| [`whenny`](packages/whenny/) | Core date library | [![npm](https://img.shields.io/npm/v/whenny.svg)](https://www.npmjs.com/package/whenny) |
| [`whenny-react`](packages/whenny-react/) | React hooks and components | [![npm](https://img.shields.io/npm/v/whenny-react.svg)](https://www.npmjs.com/package/whenny-react) |
| [`create-whenny`](packages/create-whenny/) | CLI for shadcn-style installation | [![npm](https://img.shields.io/npm/v/create-whenny.svg)](https://www.npmjs.com/package/create-whenny) |

## License

MIT

---

Built with care. Own your code. Configure your voice.
