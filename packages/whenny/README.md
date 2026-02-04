# whenny

The core Whenny date library. A modern, configurable date formatting library for the AI era.

## Installation

```bash
npm install whenny
```

Or use the shadcn-style CLI:

```bash
npx create-whenny init
npx create-whenny add relative smart calendar
```

## Usage

```typescript
import { whenny, duration, calendar, compare, relative, smart } from 'whenny'

// Main Whenny class - chainable API
const w = whenny(new Date())

w.smart()                    // Context-aware formatting
w.relative()                 // "5 minutes ago"
w.short()                    // "Jan 15"
w.long()                     // "January 15, 2024"
w.time()                     // "3:45 PM"
w.datetime()                 // "Jan 15, 3:45 PM"
w.iso()                      // ISO 8601 string
w.format('{monthFull} {day}, {year}')  // Custom format

// Standalone functions
relative(date)               // "5 minutes ago"
smart(date)                  // Context-aware
duration(seconds)            // Duration formatting
compare(dateA, dateB)        // Date comparison
```

## Configuration

```typescript
import { defineConfig, configure } from 'whenny/config'

const config = defineConfig({
  locale: 'en-US',
  relative: {
    justNow: 'just now',
    minutesAgo: (n) => `${n} minute${n === 1 ? '' : 's'} ago`,
  },
  formats: {
    presets: {
      short: '{monthShort} {day}',
    },
    hour12: true,
  },
})

configure(config)
```

## Themes

```typescript
import { themes } from 'whenny/themes'
import { configure } from 'whenny'

// casual, formal, slack, twitter, discord, github, minimal, technical
configure(themes.slack)
```

## Modules

The library is organized into modules that can be imported individually:

- **core** - Parsing, arithmetic, comparisons, formatting
- **relative** - Relative time formatting ("5 minutes ago")
- **smart** - Context-aware smart formatting
- **compare** - Date comparison utilities
- **duration** - Duration formatting
- **calendar** - Calendar helpers (isWeekend, isBusinessDay, etc.)
- **transfer** - Server/browser timezone transfer protocol
- **natural** - Natural language parsing

## API Reference

### whenny(date)

Creates a new Whenny instance.

```typescript
const w = whenny(new Date())
const w = whenny('2024-01-15')
const w = whenny(1705334400000)
```

### relative(date)

Format a date relative to now.

```typescript
relative(new Date(Date.now() - 5 * 60 * 1000))  // "5 minutes ago"
relative(new Date(Date.now() + 60 * 60 * 1000)) // "in 1 hour"
```

### smart(date)

Format with context-aware buckets.

```typescript
smart(date)  // "just now" | "5 minutes ago" | "Yesterday at 3:45 PM" | "Monday at 9:00 AM" | "Jan 15"
```

### duration(seconds)

Format a duration in seconds.

```typescript
duration(3661).long()     // "1 hour, 1 minute, 1 second"
duration(3661).compact()  // "1h 1m 1s"
duration(3661).clock()    // "1:01:01"
duration(3661).human()    // "about 1 hour"
```

### compare(dateA, dateB)

Compare two dates.

```typescript
compare(earlier, later).smart()   // "2 days before"
compare(earlier, later).days()    // 2
compare(earlier, later).hours()   // 48
compare(earlier, later).seconds() // 172800
```

### calendar

Calendar utility functions.

```typescript
calendar.isToday(date)
calendar.isYesterday(date)
calendar.isTomorrow(date)
calendar.isWeekend(date)
calendar.isWeekday(date)
calendar.isBusinessDay(date)
calendar.isPast(date)
calendar.isFuture(date)
calendar.daysUntil(date)
calendar.daysSince(date)
calendar.startOf(date, 'month')
calendar.endOf(date, 'month')
calendar.add(date, 5, 'days')
calendar.subtract(date, 1, 'week')
```

### transfer

Transfer protocol for server/browser date serialization.

```typescript
// Server
const json = transfer.toJSON(date, 'America/New_York')

// Client
const { date, originZone, originOffset } = transfer.fromJSON(json)
```

### natural

Natural language date parsing.

```typescript
natural.parse('tomorrow')
natural.parse('next friday')
natural.parse('in 2 hours')
natural.parse('december 25th')
```

## License

MIT
