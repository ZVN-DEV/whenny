# Whenny

### A Modern Date Library for the AI Era

---

## The Problem

Date and time handling in JavaScript is stuck in the past. We have:

- **moment.js** — Powerful but massive (300KB+), mutable, and deprecated
- **date-fns** — Tree-shakeable but verbose, no configuration
- **dayjs** — Small but limited, moment's patterns without moment's power
- **luxon** — Good but complex, overkill for most use cases

None of them solve the real problems developers face:

1. **Server/browser timezone confusion** — Dates cross the wire without context
2. **"Smart" formatting everywhere** — Every app rebuilds "5 minutes ago" → "Yesterday" → "Jan 15" logic
3. **Hardcoded strings** — "just now" is buried in code, not configurable
4. **AI can't help** — Dependencies are black boxes that assistants can't modify

---

## The Vision

**Whenny** is a date library designed for how we build software today:

```
Own your code. Configure your voice. Never think about timezones again.
```

### Core Principles

| Principle | What It Means |
|-----------|---------------|
| **Own Your Code** | Like shadcn/ui — add what you need, modify freely, no dependency lock-in |
| **Configure, Don't Code** | Text, thresholds, formats — all in one config file, like Tailwind |
| **Context Is Explicit** | Every date knows where it came from and who it's for |
| **AI-Native** | Code is readable, self-documenting, and lives in your project |
| **Progressive** | Start simple, add complexity only when needed |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR PROJECT                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   whenny.config.ts          ← Your voice, your rules            │
│                                                                 │
│   src/lib/whenny/                                               │
│   ├── core.ts               ← Primitives (always included)      │
│   ├── relative.ts           ← Relative time ("5 min ago")       │
│   ├── smart.ts              ← Smart formatting (buckets)        │
│   ├── compare.ts            ← Date comparison                   │
│   ├── timezone.ts           ← Timezone utilities                │
│   ├── duration.ts           ← Duration formatting               │
│   ├── calendar.ts           ← Calendar helpers                  │
│   ├── natural.ts            ← Natural language parsing          │
│   ├── transfer.ts           ← Server/browser protocol           │
│   └── index.ts              ← Exports                           │
│                                                                 │
│   src/lib/whenny/react/     ← Optional React bindings           │
│   ├── useRelativeTime.ts                                        │
│   ├── useCountdown.ts                                           │
│   └── index.ts                                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Each module is:
- **Standalone** — Works independently
- **Readable** — Simple, well-commented TypeScript
- **Configurable** — Reads from your config file
- **Deletable** — Remove what you don't need

---

## Installation

### Quick Start (Full Library)

```bash
npm install whenny
```

```typescript
import { whenny } from 'whenny'

whenny(date).smart()           // "5 minutes ago"
whenny(date).format('{month} {day}')  // "Jan 15"
```

### The Whenny Way (Own Your Code)

```bash
# Initialize in your project
npx whenny init

# Add only what you need
npx whenny add relative
npx whenny add smart
npx whenny add timezone

# Or add everything
npx whenny add all
```

This copies actual TypeScript files into your project. You own them. Modify freely.

```
✓ Created whenny.config.ts
✓ Added src/lib/whenny/core.ts
✓ Added src/lib/whenny/relative.ts
✓ Added src/lib/whenny/smart.ts
✓ Added src/lib/whenny/timezone.ts
✓ Added src/lib/whenny/index.ts
```

### Update When You Want

```bash
# See what's changed in a module
npx whenny diff relative

# Pull updates (prompts for conflicts)
npx whenny update relative
```

---

## Configuration

The heart of Whenny. One file controls everything.

```typescript
// whenny.config.ts

import { defineConfig } from 'whenny'

export default defineConfig({
  // ─────────────────────────────────────────────────────────
  // LOCALE & DEFAULTS
  // ─────────────────────────────────────────────────────────

  locale: 'en-US',

  // Default timezone for server-side operations
  // Browser always uses local timezone unless specified
  defaultTimezone: 'UTC',

  // ─────────────────────────────────────────────────────────
  // RELATIVE TIME
  // "5 minutes ago", "yesterday", "in 3 days"
  // ─────────────────────────────────────────────────────────

  relative: {
    // Past
    justNow: 'just now',
    secondsAgo: (n) => `${n} seconds ago`,
    minutesAgo: (n) => `${n} minutes ago`,
    hoursAgo: (n) => `${n} hours ago`,
    yesterday: 'yesterday',
    daysAgo: (n) => `${n} days ago`,
    weeksAgo: (n) => `${n} weeks ago`,
    monthsAgo: (n) => `${n} months ago`,
    yearsAgo: (n) => `${n} years ago`,

    // Future
    inSeconds: (n) => `in ${n} seconds`,
    inMinutes: (n) => `in ${n} minutes`,
    inHours: (n) => `in ${n} hours`,
    tomorrow: 'tomorrow',
    inDays: (n) => `in ${n} days`,
    inWeeks: (n) => `in ${n} weeks`,
    inMonths: (n) => `in ${n} months`,
    inYears: (n) => `in ${n} years`,

    // Thresholds (in seconds) — when to switch units
    thresholds: {
      justNow: 30,           // < 30s = "just now"
      seconds: 60,           // < 60s = "X seconds ago"
      minutes: 3600,         // < 1hr = "X minutes ago"
      hours: 86400,          // < 24hr = "X hours ago"
      days: 604800,          // < 7 days = "X days ago"
      weeks: 2592000,        // < 30 days = "X weeks ago"
      months: 31536000,      // < 365 days = "X months ago"
    },
  },

  // ─────────────────────────────────────────────────────────
  // SMART FORMATTING
  // Context-aware: "3pm" vs "Yesterday" vs "Jan 15"
  // ─────────────────────────────────────────────────────────

  smart: {
    // Buckets are evaluated in order
    // First matching bucket wins
    buckets: [
      {
        within: 'minute',
        show: 'just now'
      },
      {
        within: 'hour',
        show: 'relative'  // Uses relative time: "5 minutes ago"
      },
      {
        within: 'today',
        show: '{time}'    // "3:45 PM"
      },
      {
        within: 'yesterday',
        show: 'Yesterday at {time}'
      },
      {
        within: 'week',
        show: '{weekday} at {time}'  // "Tuesday at 3:45 PM"
      },
      {
        within: 'year',
        show: '{monthShort} {day}'   // "Jan 15"
      },
      {
        older: true,
        show: '{monthShort} {day}, {year}'  // "Jan 15, 2023"
      },
    ],

    // Future dates (optional, falls back to buckets logic)
    futureBuckets: [
      { within: 'hour', show: 'relative' },       // "in 30 minutes"
      { within: 'today', show: 'today at {time}' },
      { within: 'tomorrow', show: 'tomorrow at {time}' },
      { within: 'week', show: '{weekday} at {time}' },
      { older: true, show: '{monthShort} {day}' },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // COMPARISON
  // "3 days before", "2 hours after"
  // ─────────────────────────────────────────────────────────

  compare: {
    before: '{time} before',
    after: '{time} after',
    apart: '{time} apart',
    simultaneous: 'at the same time',

    // Alternative voices:
    // before: '{time} earlier'
    // after: '{time} later'
  },

  // ─────────────────────────────────────────────────────────
  // DURATION
  // "2 hours 30 minutes", "2h 30m", "2:30:00"
  // ─────────────────────────────────────────────────────────

  duration: {
    // Long form
    long: {
      hours: (n) => n === 1 ? '1 hour' : `${n} hours`,
      minutes: (n) => n === 1 ? '1 minute' : `${n} minutes`,
      seconds: (n) => n === 1 ? '1 second' : `${n} seconds`,
      separator: ' ',
    },

    // Compact form
    compact: {
      hours: (n) => `${n}h`,
      minutes: (n) => `${n}m`,
      seconds: (n) => `${n}s`,
      separator: ' ',
    },

    // Default style
    defaultStyle: 'long',
  },

  // ─────────────────────────────────────────────────────────
  // FORMAT TOKENS
  // For custom format strings
  // ─────────────────────────────────────────────────────────

  formats: {
    // Named formats
    presets: {
      short: '{monthShort} {day}',
      long: '{monthFull} {day}, {year}',
      iso: '{year}-{month}-{day}',
      time: '{hour}:{minute} {ampm}',
      datetime: '{monthShort} {day}, {hour}:{minute} {ampm}',
    },

    // Time preferences
    hour12: true,  // 3:00 PM vs 15:00
  },

  // ─────────────────────────────────────────────────────────
  // CALENDAR
  // Week starts, business days, etc.
  // ─────────────────────────────────────────────────────────

  calendar: {
    weekStartsOn: 'monday',  // 'sunday' | 'monday'
    businessDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],

    // Named days (for personality mode)
    dayNames: {
      friday: 'Friday',
      monday: 'Monday',
    },
  },

  // ─────────────────────────────────────────────────────────
  // SERVER BEHAVIOR
  // What happens when timezone context is missing
  // ─────────────────────────────────────────────────────────

  server: {
    // Require explicit timezone for smart formatting
    requireTimezone: true,

    // Fallback format if no timezone (when requireTimezone is false)
    fallbackFormat: 'iso',  // 'iso' | 'utc' | 'long'

    // Warn in console when timezone is missing
    warnOnMissingTimezone: true,
  },

  // ─────────────────────────────────────────────────────────
  // PERSONALITY (Optional)
  // Add some fun to your dates
  // ─────────────────────────────────────────────────────────

  personality: {
    enabled: false,

    // Special messages for specific contexts
    messages: {
      fridayAfternoon: "It's Friday! 🎉",
      mondayMorning: 'Monday morning...',
      newYear: "Happy New Year! 🎊",
      birthday: "It's your birthday! 🎂",  // requires user birthday config
    },
  },
})
```

---

## Core API

### The `whenny` Function

Everything starts here.

```typescript
import { whenny } from 'whenny'

// From any input
whenny(new Date())
whenny('2024-01-15T10:30:00Z')
whenny(1705312200000)  // Unix timestamp

// Current time
whenny.now()

// With explicit timezone
whenny.inZone('America/New_York', '2024-01-15 10:30')
```

### Formatting

```typescript
const date = whenny('2024-01-15T15:30:00Z')

// ─────────────────────────────────────────────────────────
// PRESETS
// ─────────────────────────────────────────────────────────

date.short()         // "Jan 15"
date.long()          // "January 15, 2024"
date.iso()           // "2024-01-15T15:30:00Z"
date.time()          // "3:30 PM"
date.datetime()      // "Jan 15, 3:30 PM"

// ─────────────────────────────────────────────────────────
// CUSTOM FORMATS
// ─────────────────────────────────────────────────────────

date.format('{monthFull} {day}, {year}')       // "January 15, 2024"
date.format('{weekday}, {monthShort} {day}')   // "Monday, Jan 15"
date.format('{year}-{month}-{day}')            // "2024-01-15"
date.format('{hour}:{minute}:{second}')        // "15:30:00"

// ─────────────────────────────────────────────────────────
// AVAILABLE TOKENS
// ─────────────────────────────────────────────────────────

// Year
{year}        // "2024"
{yearShort}   // "24"

// Month
{month}       // "01"
{monthShort}  // "Jan"
{monthFull}   // "January"

// Day
{day}         // "15"
{dayOrdinal}  // "15th"
{weekday}     // "Monday"
{weekdayShort}// "Mon"

// Time
{hour}        // "15" (24h) or "3" (12h based on config)
{hour24}      // "15"
{hour12}      // "3"
{minute}      // "30"
{second}      // "00"
{ampm}        // "PM"
{AMPM}        // "PM"

// Timezone
{timezone}    // "EST"
{offset}      // "-05:00"
```

### Relative Time

```typescript
const date = whenny('2024-01-15T15:30:00Z')

// ─────────────────────────────────────────────────────────
// RELATIVE TO NOW
// ─────────────────────────────────────────────────────────

date.relative()      // "5 minutes ago"
date.fromNow()       // "5 minutes ago" (alias)

// Future dates
whenny(futureDate).relative()  // "in 3 days"

// ─────────────────────────────────────────────────────────
// RELATIVE TO ANOTHER DATE
// ─────────────────────────────────────────────────────────

date.from(otherDate)    // "3 days ago" (relative to otherDate)
date.since(otherDate)   // alias
```

### Smart Formatting

The killer feature. Context-aware formatting that does what you actually want.

```typescript
const date = whenny('2024-01-15T15:30:00Z')

// ─────────────────────────────────────────────────────────
// BASIC USAGE
// ─────────────────────────────────────────────────────────

date.smart()
// Within last minute   → "just now"
// Within last hour     → "5 minutes ago"
// Today                → "3:30 PM"
// Yesterday            → "Yesterday at 3:30 PM"
// Within last week     → "Tuesday at 3:30 PM"
// Within this year     → "Jan 15"
// Older                → "Jan 15, 2023"

// ─────────────────────────────────────────────────────────
// WITH TIMEZONE CONTEXT (Required on server)
// ─────────────────────────────────────────────────────────

date.smart({ for: 'America/New_York' })
date.smart({ for: user.timezone })

// ─────────────────────────────────────────────────────────
// RELATIVE TO A SPECIFIC TIME (Not now)
// ─────────────────────────────────────────────────────────

date.smart({ from: referenceDate })
// Useful for: "show dates relative to when the page loaded"
```

### Comparing Two Dates

```typescript
const eventA = whenny('2024-01-15T10:00:00Z')
const eventB = whenny('2024-01-18T14:00:00Z')

// ─────────────────────────────────────────────────────────
// DIRECTIONAL COMPARISON
// ─────────────────────────────────────────────────────────

eventA.to(eventB).smart()    // "3 days before"
eventB.to(eventA).smart()    // "3 days after"

// ─────────────────────────────────────────────────────────
// DISTANCE (No direction)
// ─────────────────────────────────────────────────────────

eventA.distance(eventB)           // "3 days"
eventA.distance(eventB).exact()   // "3 days, 4 hours"

// ─────────────────────────────────────────────────────────
// RAW VALUES
// ─────────────────────────────────────────────────────────

eventA.to(eventB).days()       // 3
eventA.to(eventB).hours()      // 76
eventA.to(eventB).minutes()    // 4560
```

### Duration Formatting

For time spans, video lengths, countdowns.

```typescript
import { duration } from 'whenny'

// ─────────────────────────────────────────────────────────
// FROM SECONDS
// ─────────────────────────────────────────────────────────

duration(3661)              // 1 hour, 1 minute, 1 second

duration(3661).long()       // "1 hour, 1 minute, 1 second"
duration(3661).compact()    // "1h 1m 1s"
duration(3661).clock()      // "1:01:01"
duration(3661).human()      // "about 1 hour"

// ─────────────────────────────────────────────────────────
// FROM MILLISECONDS
// ─────────────────────────────────────────────────────────

duration.ms(3661000).compact()  // "1h 1m 1s"

// ─────────────────────────────────────────────────────────
// BETWEEN TWO DATES
// ─────────────────────────────────────────────────────────

duration.between(startDate, endDate).compact()  // "2h 30m"

// ─────────────────────────────────────────────────────────
// PARTS
// ─────────────────────────────────────────────────────────

const d = duration(3661)
d.hours       // 1
d.minutes     // 1
d.seconds     // 1
d.totalSeconds // 3661
```

---

## Timezone System

### The Transfer Protocol

The solution to server/browser confusion.

```typescript
import { whenny } from 'whenny'

// ═══════════════════════════════════════════════════════════
// BROWSER SIDE
// ═══════════════════════════════════════════════════════════

// Create a date in the user's local timezone
const userDate = whenny.local()
const selectedDate = whenny.local('2024-01-15 10:30')

// When sending to server, include full context
const payload = userDate.transfer()
// → {
//     iso: "2024-01-15T15:30:00.000Z",
//     originZone: "America/New_York",
//     originOffset: -300
//   }

// Send in your API call
fetch('/api/events', {
  method: 'POST',
  body: JSON.stringify({ scheduledAt: payload })
})


// ═══════════════════════════════════════════════════════════
// SERVER SIDE
// ═══════════════════════════════════════════════════════════

// Receive with full context preserved
const received = whenny.fromTransfer(body.scheduledAt)

received.originZone         // "America/New_York"
received.utc()              // UTC Date for storage
received.inOrigin()         // Date in original timezone

// The magic: timezone-aware day boundaries
received.startOfDayInOrigin()   // Midnight in NEW YORK, as UTC
received.endOfDayInOrigin()     // 11:59:59 PM in NEW YORK, as UTC

// For database queries:
const { start, end } = received.dayBoundsInOrigin()
db.query(`
  SELECT * FROM events
  WHERE created_at BETWEEN $1 AND $2
`, [start, end])


// ═══════════════════════════════════════════════════════════
// BACK TO BROWSER
// ═══════════════════════════════════════════════════════════

// Server sends UTC timestamp
const response = await fetch('/api/events')
const event = await response.json()

// Display in user's local timezone
whenny.utc(event.createdAt).local().smart()   // "Today at 10:30 AM"
```

### Timezone Utilities

```typescript
import { whenny, tz } from 'whenny'

// ─────────────────────────────────────────────────────────
// CREATING DATES IN SPECIFIC TIMEZONES
// ─────────────────────────────────────────────────────────

whenny.local()                              // Current local time
whenny.utc()                                // Current UTC time
whenny.inZone('America/New_York')           // Current time in NYC
whenny.inZone('Asia/Tokyo', '2024-01-15')   // Specific date in Tokyo

// ─────────────────────────────────────────────────────────
// CONVERTING BETWEEN TIMEZONES
// ─────────────────────────────────────────────────────────

const date = whenny('2024-01-15T15:30:00Z')

date.inZone('America/New_York')   // Convert to NYC time
date.inZone('Asia/Tokyo')         // Convert to Tokyo time
date.local()                      // Convert to local time
date.utc()                        // Convert to UTC

// ─────────────────────────────────────────────────────────
// TIMEZONE INFO
// ─────────────────────────────────────────────────────────

date.zone           // "America/New_York"
date.offset         // -300 (minutes from UTC)
date.offsetString   // "-05:00"
date.isDST          // true/false

// ─────────────────────────────────────────────────────────
// DAY BOUNDARIES (Crucial for filtering)
// ─────────────────────────────────────────────────────────

// "Give me today's boundaries in this timezone"
const bounds = whenny.dayBounds({ for: 'America/New_York' })
// → { start: Date, end: Date } in UTC

// "Give me this date's day boundaries in this timezone"
whenny(date).startOfDay({ in: 'America/New_York' })
whenny(date).endOfDay({ in: 'America/New_York' })

// ─────────────────────────────────────────────────────────
// TIMEZONE HELPERS
// ─────────────────────────────────────────────────────────

tz.list()                    // All IANA timezone names
tz.offset('America/New_York') // Current offset
tz.abbreviation('America/New_York')  // "EST" or "EDT"
```

### Server-Side Patterns

```typescript
// ═══════════════════════════════════════════════════════════
// PATTERN 1: API Endpoint
// ═══════════════════════════════════════════════════════════

app.post('/api/events', (req, res) => {
  // Date came from browser with context
  const scheduled = whenny.fromTransfer(req.body.scheduledAt)

  // Store in UTC
  await db.insert({
    scheduled_at: scheduled.utc().toISO()
  })

  // Return UTC (client will format)
  res.json({ scheduledAt: scheduled.utc().toISO() })
})


// ═══════════════════════════════════════════════════════════
// PATTERN 2: Server-Side Rendering (SSR)
// ═══════════════════════════════════════════════════════════

export async function loader({ request }) {
  // Get timezone from cookie (set on first visit)
  const tz = getTimezoneFromCookie(request) ?? 'UTC'

  const events = await db.getEvents()

  return {
    events: events.map(e => ({
      ...e,
      // Pre-format for SSR
      displayTime: whenny(e.createdAt).smart({ for: tz })
    }))
  }
}


// ═══════════════════════════════════════════════════════════
// PATTERN 3: Email / Notifications
// ═══════════════════════════════════════════════════════════

async function sendReminder(user, event) {
  const formatted = whenny(event.startTime).smart({
    for: user.timezone,      // Stored preference
    locale: user.locale,
  })

  await email.send({
    to: user.email,
    subject: `Reminder: Event ${formatted}`,
    body: `Your event starts ${formatted}`
  })
}


// ═══════════════════════════════════════════════════════════
// PATTERN 4: Date Range Queries
// ═══════════════════════════════════════════════════════════

app.get('/api/events', (req, res) => {
  const userTz = req.query.timezone || 'UTC'

  // "Today" in the user's timezone
  const { start, end } = whenny.dayBounds({ for: userTz })

  const events = await db.query(`
    SELECT * FROM events
    WHERE start_time >= $1 AND start_time < $2
  `, [start.toISO(), end.toISO()])

  res.json(events)
})
```

---

## Calendar Helpers

Common operations that every app needs.

```typescript
import { whenny, calendar } from 'whenny'

const date = whenny('2024-01-15')

// ─────────────────────────────────────────────────────────
// DAY QUERIES
// ─────────────────────────────────────────────────────────

calendar.isToday(date)
calendar.isYesterday(date)
calendar.isTomorrow(date)
calendar.isThisWeek(date)
calendar.isThisMonth(date)
calendar.isThisYear(date)

calendar.isWeekend(date)
calendar.isWeekday(date)
calendar.isBusinessDay(date)

// With timezone context
calendar.isToday(date, { for: 'America/New_York' })

// ─────────────────────────────────────────────────────────
// COMPARISONS
// ─────────────────────────────────────────────────────────

calendar.isSameDay(dateA, dateB)
calendar.isSameWeek(dateA, dateB)
calendar.isSameMonth(dateA, dateB)
calendar.isSameYear(dateA, dateB)

calendar.isBefore(dateA, dateB)
calendar.isAfter(dateA, dateB)
calendar.isBetween(date, start, end)

// ─────────────────────────────────────────────────────────
// BOUNDARIES
// ─────────────────────────────────────────────────────────

calendar.startOf(date, 'day')
calendar.startOf(date, 'week')
calendar.startOf(date, 'month')
calendar.startOf(date, 'year')

calendar.endOf(date, 'day')
calendar.endOf(date, 'week')
calendar.endOf(date, 'month')
calendar.endOf(date, 'year')

// ─────────────────────────────────────────────────────────
// ARITHMETIC
// ─────────────────────────────────────────────────────────

calendar.add(date, 5, 'days')
calendar.add(date, 2, 'weeks')
calendar.add(date, 1, 'month')
calendar.subtract(date, 3, 'hours')

// ─────────────────────────────────────────────────────────
// DISTANCES
// ─────────────────────────────────────────────────────────

calendar.daysUntil(futureDate)      // 15
calendar.daysSince(pastDate)        // 7
calendar.businessDaysBetween(a, b)  // 10
```

---

## Natural Language Parsing

Parse human-friendly date expressions.

```typescript
import { parse } from 'whenny/natural'

// ─────────────────────────────────────────────────────────
// RELATIVE EXPRESSIONS
// ─────────────────────────────────────────────────────────

parse('now')                    // Current date/time
parse('today')                  // Today at midnight
parse('tomorrow')               // Tomorrow at midnight
parse('yesterday')              // Yesterday at midnight

parse('next week')              // Start of next week
parse('last month')             // Start of last month
parse('next tuesday')           // The coming Tuesday

// ─────────────────────────────────────────────────────────
// TIME EXPRESSIONS
// ─────────────────────────────────────────────────────────

parse('tomorrow at 3pm')
parse('next friday at 10:30')
parse('in 2 hours')
parse('in 30 minutes')
parse('in 3 days')

// ─────────────────────────────────────────────────────────
// SEMANTIC EXPRESSIONS
// ─────────────────────────────────────────────────────────

parse('end of month')
parse('end of year')
parse('start of week')
parse('beginning of next month')

parse('tomorrow morning')       // 9:00 AM (configurable)
parse('tomorrow afternoon')     // 2:00 PM (configurable)
parse('tomorrow evening')       // 6:00 PM (configurable)

// ─────────────────────────────────────────────────────────
// WITH TIMEZONE
// ─────────────────────────────────────────────────────────

parse('tomorrow at 3pm', { timezone: 'America/New_York' })
parse('next monday at 9am EST')

// ─────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────

// In whenny.config.ts
{
  natural: {
    morning: 9,     // Hour for "morning"
    afternoon: 14,  // Hour for "afternoon"
    evening: 18,    // Hour for "evening"
    night: 21,      // Hour for "night"
  }
}
```

---

## React Integration

Optional React bindings for common patterns.

```bash
npx whenny add react
```

### useRelativeTime

Auto-updating relative time display.

```tsx
import { useRelativeTime } from '@/lib/whenny/react'

function Comment({ createdAt }) {
  const timeAgo = useRelativeTime(createdAt)
  // Automatically updates: "just now" → "1 min ago" → "2 min ago"

  return (
    <span className="text-gray-500">{timeAgo}</span>
  )
}

// With options
const timeAgo = useRelativeTime(createdAt, {
  updateInterval: 30000,  // Update every 30s (default: 60s)
  smart: true,            // Use smart formatting
})
```

### useCountdown

Countdown timer with all the parts.

```tsx
import { useCountdown } from '@/lib/whenny/react'

function SaleTimer({ endsAt }) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(endsAt)

  if (isExpired) {
    return <span>Sale ended</span>
  }

  return (
    <div>
      <span>{days}d</span>
      <span>{hours}h</span>
      <span>{minutes}m</span>
      <span>{seconds}s</span>
    </div>
  )
}

// With formatting
const countdown = useCountdown(endsAt, {
  format: 'compact',  // Uses duration.compact()
})
countdown.formatted  // "2d 5h 30m 15s"
```

### useDateFormatter

Memoized formatting that responds to locale changes.

```tsx
import { useDateFormatter } from '@/lib/whenny/react'

function EventCard({ event }) {
  const format = useDateFormatter()

  return (
    <div>
      <h3>{event.title}</h3>
      <time>{format(event.startTime).smart()}</time>
    </div>
  )
}
```

### useTimezone

Access and react to timezone context.

```tsx
import { useTimezone, TimezoneProvider } from '@/lib/whenny/react'

// Wrap your app
function App() {
  return (
    <TimezoneProvider detect={true}>
      <MyApp />
    </TimezoneProvider>
  )
}

// Use anywhere
function TimeDisplay({ date }) {
  const { timezone, setTimezone } = useTimezone()

  return (
    <div>
      <span>{whenny(date).smart({ for: timezone })}</span>
      <select onChange={e => setTimezone(e.target.value)}>
        <option value="local">Local</option>
        <option value="UTC">UTC</option>
        {/* ... */}
      </select>
    </div>
  )
}
```

---

## Themes

Pre-built configuration themes for common use cases.

```typescript
// whenny.config.ts
import { casual, formal, slack, twitter, minimal } from 'whenny/themes'

// Use a theme directly
export default casual

// Or extend one
export default {
  ...casual,
  relative: {
    ...casual.relative,
    justNow: 'right now',  // Override specific values
  }
}
```

### Available Themes

**casual** (default)
```
"just now", "5 minutes ago", "yesterday", "Jan 15"
```

**formal**
```
"a moment ago", "5 minutes ago", "yesterday at 3:45 PM", "January 15, 2024"
```

**slack**
```
"just now", "5 min", "yesterday", "Jan 15th at 3:45 PM"
```

**twitter**
```
"now", "5m", "1h", "Jan 15"
```

**minimal**
```
"now", "5m ago", "1d ago", "Jan 15"
```

**technical**
```
"2024-01-15T15:45:00Z" (always ISO)
```

---

## CLI Reference

```bash
# ─────────────────────────────────────────────────────────
# INITIALIZATION
# ─────────────────────────────────────────────────────────

npx whenny init
# Creates whenny.config.ts and core files
# Interactive: choose what to add

npx whenny init --minimal
# Just config and core, nothing else

npx whenny init --full
# Everything included

# ─────────────────────────────────────────────────────────
# ADDING MODULES
# ─────────────────────────────────────────────────────────

npx whenny add <module>

# Available modules:
#   core      - Date primitives (always included)
#   relative  - Relative time formatting
#   smart     - Smart context-aware formatting
#   compare   - Date comparison utilities
#   timezone  - Timezone handling
#   duration  - Duration formatting
#   calendar  - Calendar helpers
#   natural   - Natural language parsing
#   transfer  - Server/browser transfer protocol
#   react     - React hooks and components

npx whenny add relative smart timezone
# Add multiple at once

npx whenny add all
# Add everything

# ─────────────────────────────────────────────────────────
# UPDATING
# ─────────────────────────────────────────────────────────

npx whenny update <module>
# Pull latest version of a module
# Prompts for conflict resolution

npx whenny update all
# Update everything

npx whenny diff <module>
# See what's changed since you added it

# ─────────────────────────────────────────────────────────
# UTILITIES
# ─────────────────────────────────────────────────────────

npx whenny list
# Show what's installed

npx whenny remove <module>
# Remove a module

npx whenny doctor
# Check for issues with your setup
```

---

## TypeScript

Whenny is built TypeScript-first. Full type inference everywhere.

```typescript
// Format tokens are typed
date.format('{month} {day}')  // ✓
date.format('{mnth} {day}')   // ✗ Type error: 'mnth' is not a valid token

// Bucket 'within' values are typed
{
  within: 'hour',    // ✓
  within: 'hours',   // ✗ Type error
}

// Timezone names are typed (when using strict mode)
whenny.inZone('America/New_York')  // ✓
whenny.inZone('America/NewYork')   // ✗ Type error

// Config is fully typed
import { defineConfig } from 'whenny'

export default defineConfig({
  relative: {
    justNow: 'now',
    // TypeScript knows all valid keys
  }
})
```

---

## Bundle Size

Whenny is designed to be tiny.

| What You Import | Size (minified + gzipped) |
|-----------------|---------------------------|
| Core only | ~1.5 KB |
| + relative | ~2.0 KB |
| + smart | ~2.5 KB |
| + timezone | ~3.5 KB |
| + everything | ~8 KB |

Compare to:
- moment.js: ~72 KB
- date-fns (full): ~30 KB
- dayjs: ~3 KB (but limited)
- luxon: ~20 KB

---

## AI Integration

Whenny is designed for the AI era.

### Why It Works With AI

1. **Code lives in your project** — AI can read and modify it
2. **Simple, readable functions** — No magic, easy to understand
3. **Config is declarative** — AI can update config without touching code
4. **Natural language parsing** — AI-generated date strings just work

### Example: AI Assistant Workflow

```
User: "Add a feature that shows how long ago comments were posted"

AI: Let me add the relative time module to your project.

> npx whenny add relative

Now I'll update your Comment component:

// components/Comment.tsx
import { whenny } from '@/lib/whenny'

export function Comment({ comment }) {
  return (
    <div>
      <p>{comment.body}</p>
      <span>{whenny(comment.createdAt).relative()}</span>
    </div>
  )
}

The default shows "5 minutes ago". If you want a different style,
I can update whenny.config.ts.
```

### AI-Friendly Patterns

```typescript
// The config is self-documenting
// AI can read it and understand how to modify

// whenny.config.ts
export default {
  relative: {
    justNow: 'just now',      // ← AI: "change this to 'moments ago'"
    minutesAgo: (n) => `${n} minutes ago`,
  }
}

// The code is simple enough for AI to modify
// src/lib/whenny/relative.ts
export function relative(date: Date): string {
  const seconds = differenceInSeconds(new Date(), date)

  if (seconds < config.thresholds.justNow) {
    return config.relative.justNow
  }
  // ...
}
```

---

## Migration from Other Libraries

### From moment.js

```typescript
// moment.js
moment(date).fromNow()
moment(date).format('MMMM Do, YYYY')
moment(date).add(5, 'days')

// whenny
whenny(date).relative()
whenny(date).format('{monthFull} {dayOrdinal}, {year}')
calendar.add(date, 5, 'days')
```

### From date-fns

```typescript
// date-fns
import { formatDistanceToNow, format, addDays } from 'date-fns'

formatDistanceToNow(date)
format(date, 'MMMM do, yyyy')
addDays(date, 5)

// whenny
whenny(date).relative()
whenny(date).format('{monthFull} {dayOrdinal}, {year}')
calendar.add(date, 5, 'days')
```

### From dayjs

```typescript
// dayjs
dayjs(date).fromNow()
dayjs(date).format('MMMM D, YYYY')
dayjs(date).add(5, 'day')

// whenny
whenny(date).relative()
whenny(date).format('{monthFull} {day}, {year}')
calendar.add(date, 5, 'days')
```

---

## Roadmap

### v1.0 (Initial Release)
- [x] Core date primitives
- [x] Relative time formatting
- [x] Smart formatting with buckets
- [x] Configuration system
- [x] Timezone utilities
- [x] Transfer protocol
- [x] Duration formatting
- [x] Calendar helpers
- [x] React hooks
- [x] CLI

### v1.1
- [ ] Natural language parsing
- [ ] More themes
- [ ] Vue integration
- [ ] Svelte integration

### v2.0
- [ ] Temporal API support (when widely available)
- [ ] Visual config editor
- [ ] Playground website

---

## Philosophy

### Why "Whenny"?

Because the question is always "when?"

When was this posted? When does this expire? When is the meeting?

Whenny answers that question in whatever voice your app needs.

### Design Decisions

**Why config file instead of runtime options?**

Because your app's voice should be consistent. You decide once how "5 minutes ago" should read, and it's the same everywhere. Runtime options are still available for edge cases.

**Why copy code into the project?**

Because dependencies are black boxes. When you need to change something, you can. When AI assists you, it can see and modify the code. When the library updates, you choose what to take.

**Why TypeScript-only?**

Because type safety matters for dates. Timezone bugs are subtle and expensive. TypeScript catches them at compile time.

---

## Contributing

Whenny is open source under the MIT license.

```bash
git clone https://github.com/your-org/whenny
cd whenny
npm install
npm run dev
```

### Project Structure

```
whenny/
├── packages/
│   ├── whenny/           # Main library (npm install whenny)
│   ├── create-whenny/    # CLI (npx whenny)
│   └── whenny-react/     # React bindings
├── templates/            # Files copied by CLI
│   ├── core.ts
│   ├── relative.ts
│   ├── smart.ts
│   └── ...
├── themes/               # Pre-built themes
└── docs/                 # Documentation site
```

---

## License

MIT License. See [LICENSE](./LICENSE).

---

<p align="center">
  <strong>Whenny</strong><br/>
  Own your code. Configure your voice. Never think about timezones again.
</p>
