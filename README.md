# Whenny

A modern date library for the AI era.

**Own your code. Configure your voice. Never think about timezones again.**

## Why Whenny?

Whenny is different from other date libraries in three key ways:

1. **Own Your Code** — Like [shadcn/ui](https://ui.shadcn.com), Whenny can copy code directly into your project. Your AI assistant can read and modify it. No dependency lock-in.

2. **Configure Your Voice** — One config file controls every string Whenny outputs. Want formal language? Casual? Emoji-heavy? Change it once, update everywhere.

3. **Timezone Solved** — The Transfer Protocol carries timezone context across the wire. Server and browser always show the right time. Automatically.

## Installation

### NPM Package (Traditional)

```bash
npm install whenny @whenny/react
```

### shadcn Style (Recommended)

```bash
npx whenny init
npx whenny add relative smart calendar
```

This copies the code directly into your project at `src/lib/whenny/`.

## Quick Start

```typescript
import { whenny, duration, calendar, compare } from 'whenny'

// Smart formatting - picks the best representation automatically
whenny(date).smart()
// → "just now"
// → "5 minutes ago"
// → "Yesterday at 3:45 PM"
// → "Monday at 9:00 AM"
// → "Jan 15"

// Relative time
whenny(date).relative()           // "5 minutes ago"

// Format presets
whenny(date).short()              // "Jan 15"
whenny(date).long()               // "January 15, 2024"
whenny(date).time()               // "3:45 PM"
whenny(date).datetime()           // "Jan 15, 3:45 PM"
whenny(date).iso()                // "2024-01-15T15:45:00Z"

// Custom templates
whenny(date).format('{weekday}, {monthFull} {dayOrdinal}')
// → "Monday, January 15th"

// Duration formatting
duration(3661).long()             // "1 hour, 1 minute, 1 second"
duration(3661).compact()          // "1h 1m 1s"
duration(3661).clock()            // "1:01:01"
duration(7200).human()            // "2 hours"

// Calendar helpers
calendar.isToday(date)            // true
calendar.isWeekend(date)          // false
calendar.isBusinessDay(date)      // true
calendar.daysUntil(futureDate)    // 7

// Date comparison
compare(dateA, dateB).smart()     // "2 days before"
compare(dateA, dateB).days()      // 2
```

## React Hooks

```tsx
import { useRelativeTime, useCountdown } from '@whenny/react'

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

  formats: {
    presets: {
      short: '{day}/{month}/{year}',
      long: '{monthFull} {day}, {year}',
    },
    hour12: true,
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
import { transfer } from 'whenny'

const response = {
  event: {
    name: 'Meeting',
    date: transfer.toJSON(event.date, 'America/New_York')
  }
}

// Client: deserialize and format
const { date, originZone } = transfer.fromJSON(response.event.date)
whenny(date).format('{time} {timezone}')
// → "3:00 PM EST" (original timezone preserved!)
```

## Natural Language Parsing

```typescript
import { natural } from 'whenny'

natural.parse('tomorrow at 3pm')        // Date object
natural.parse('next friday')            // Date object
natural.parse('in 2 hours')             // Date object
natural.parse('december 25th')          // Date object
```

## Format Tokens

Available tokens for custom formats:

| Token | Output | Example |
|-------|--------|---------|
| `{year}` | 4-digit year | 2024 |
| `{month}` | 2-digit month | 01 |
| `{day}` | 2-digit day | 15 |
| `{hour}` | 12-hour | 3 |
| `{hour24}` | 24-hour | 15 |
| `{minute}` | Minutes | 45 |
| `{second}` | Seconds | 30 |
| `{AMPM}` | Uppercase | PM |
| `{ampm}` | Lowercase | pm |
| `{weekday}` | Full weekday | Monday |
| `{weekdayShort}` | Short weekday | Mon |
| `{monthFull}` | Full month | January |
| `{monthShort}` | Short month | Jan |
| `{dayOrdinal}` | Ordinal day | 15th |

## CLI Commands

```bash
# Initialize whenny in your project
npx whenny init

# Add specific modules
npx whenny add relative smart calendar duration

# List available modules
npx whenny list

# Show changes between your code and latest version
npx whenny diff
```

## Packages

| Package | Description |
|---------|-------------|
| `whenny` | Core date library |
| `@whenny/react` | React hooks and components |
| `create-whenny` | CLI for shadcn-style installation |

## License

MIT

---

Built with care. Own your code. Configure your voice.
