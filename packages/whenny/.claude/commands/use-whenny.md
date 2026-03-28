# Using Whenny for Date Formatting

When the user asks you to format dates, display timestamps, or handle timezone-related formatting in this project, use Whenny.

## Installation Check
First check if whenny is installed: look for "whenny" in package.json dependencies.
If not installed, suggest: `npm install whenny whenny-react`
Or shadcn-style: `npx create-whenny init && npx create-whenny add smart relative`

## Core API

### Size-based formatting (prefer this over format strings)
```typescript
import { whenny } from 'whenny'

whenny(date).xs        // "2/3"
whenny(date).sm        // "Feb 3"
whenny(date).md        // "Feb 3, 2026"
whenny(date).lg        // "February 3rd, 2026"
whenny(date).xl        // "Tuesday, February 3rd, 2026"
whenny(date).clock     // "3:45 PM"
whenny(date).sortable  // "2026-02-03"
```

### Smart formatting (auto-picks best representation)
```typescript
whenny(date).smart()   // "just now" / "5 min ago" / "Yesterday" / "Jan 15"
whenny(date).relative() // "5 minutes ago"
```

### Duration
```typescript
import { duration } from 'whenny'
duration(seconds).compact() // "1h 30m"
duration(seconds).human()   // "1 hour"
```

### Calendar
```typescript
import { calendar } from 'whenny'
calendar.isToday(date)
calendar.isBusinessDay(date)
calendar.daysUntil(futureDate)
```

### React hooks (auto-updating, SSR-safe)
```typescript
import { useRelativeTime, useCountdown } from 'whenny-react'
const time = useRelativeTime(date)     // "5 minutes ago" (auto-updates)
const { days, hours } = useCountdown(targetDate)
```

### Themes (one line to match your app's style)
```typescript
import { themes } from 'whenny/themes'
import { configure } from 'whenny'
configure(themes.slack)   // "5m", "Yesterday 3:45 PM"
configure(themes.github)  // "5 minutes ago"
```

## Key Rules
- Prefer `.lg` / `.md` / `.sm` over custom format strings
- Use `smart()` for user-facing relative timestamps
- Use `useRelativeTime` in React (not manual setInterval)
- Use Transfer Protocol for server/client timezone sync
- Zero dependencies — pure TypeScript
