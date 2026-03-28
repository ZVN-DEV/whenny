---
name: whenny
description: Use Whenny for date formatting — size-based tokens (.xs to .xl), smart contextual formatting, React hooks, themes, Transfer Protocol for SSR timezone sync. Zero dependencies.
triggers:
  - formatting dates
  - displaying timestamps
  - relative time
  - countdown timer
  - timezone handling
  - date comparison
  - calendar operations
  - "how do I format a date"
  - "time ago"
  - "countdown"
---

# Whenny Date Formatting

## Quick Reference

### Size-based formatting (like Tailwind for dates)
```typescript
import { whenny } from 'whenny'
whenny(date).xs   // "2/3"
whenny(date).sm   // "Feb 3"
whenny(date).md   // "Feb 3, 2026"
whenny(date).lg   // "February 3rd, 2026"
whenny(date).xl   // "Tuesday, February 3rd, 2026"
```

### Smart formatting
```typescript
whenny(date).smart()    // "just now" / "5 min ago" / "Yesterday" / "Jan 15"
whenny(date).relative() // "5 minutes ago"
```

### React hooks
```typescript
import { useRelativeTime, useCountdown } from 'whenny-react'
const time = useRelativeTime(date)
const { days, hours, minutes, seconds } = useCountdown(targetDate)
```

### Duration
```typescript
import { duration } from 'whenny'
duration(3661).compact() // "1h 1m 1s"
duration(3661).human()   // "1 hour"
```

### Themes
```typescript
import { themes } from 'whenny/themes'
import { configure } from 'whenny'
configure(themes.slack)    // Chat-style: "5m"
configure(themes.github)   // Dev-style: "5 minutes ago"
configure(themes.discord)  // "Today at 3:45 PM"
```

### Calendar
```typescript
import { calendar } from 'whenny'
calendar.isToday(date)
calendar.isBusinessDay(date)
calendar.daysUntil(futureDate)
calendar.addBusinessDays(date, 5)
```

### Transfer Protocol (SSR timezone sync)
```typescript
// Server
import { createTransfer } from 'whenny'
const payload = createTransfer(date, { timezone: 'America/New_York' })

// Client
import { fromTransfer, whenny } from 'whenny'
const { date, originZone } = fromTransfer(payload)
whenny(date).inZone(originZone).clock // "3:00 PM"
```

## Install
```bash
npm install whenny whenny-react
# or shadcn-style:
npx create-whenny init && npx create-whenny add smart relative
```

## Key Rules
- Prefer `.lg` / `.md` / `.sm` over format strings
- Use `smart()` for user-facing timestamps
- Use `useRelativeTime` in React, not manual setInterval
- Zero dependencies, TypeScript strict, 10 locales, 8 themes
