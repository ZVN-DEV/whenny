---
title: I Built a Date Library That Lives in Your Codebase, Not node_modules
published: true
description: What if your date library worked like shadcn/ui — copy the code, own it, customize it? Meet Whenny.
tags: typescript, javascript, react, webdev
cover_image:
canonical_url:
---

Every project has that one file. Maybe it's `utils/formatDate.ts`. Maybe it's `helpers/time.ts`. You know the one -- a handful of functions copy-pasted from Stack Overflow, wrapped around `date-fns`, or slowly accreting over years of "just add another format."

It works. Until someone needs Slack-style timestamps in the activity feed and formal dates on invoices. Then you're maintaining two formatting systems, neither of which is configurable, and both of which import a library you'll never fully use.

I wanted something different. So I built [Whenny](https://github.com/ZVN-DEV/whenny).

## The idea: what if dates worked like shadcn/ui?

shadcn/ui changed how I think about component libraries. Instead of installing a package and hoping the API covers your use case, you copy the source code into your project. You own it. You modify it. No dependency drama.

Whenny does the same thing for date formatting:

```bash
npx create-whenny add smart relative
```

That copies the actual TypeScript source for the `smart` and `relative` modules into your project -- by default at `src/lib/whenny/`. No runtime dependency. The code is yours.

Want all of it?

```bash
npx create-whenny init --full
```

Want just the core and timezone utilities?

```bash
npx create-whenny add core timezone
```

Ten modules available: `core`, `relative`, `smart`, `compare`, `duration`, `timezone`, `calendar`, `transfer`, `natural`, and `react`. Each declares its own dependencies, so adding `smart` automatically pulls in `core` and `relative`.

## Size-based formatting

This is the part I keep reaching for. Instead of remembering format strings, you pick a size:

```typescript
import { whenny } from './lib/whenny'

const date = whenny('2026-02-03T15:30:00Z')

date.xs  // "2/3"
date.sm  // "Feb 3"
date.md  // "Feb 3, 2026"
date.lg  // "February 3rd, 2026"
date.xl  // "Tuesday, February 3rd, 2026"
```

Think of it like Tailwind breakpoints, but for date detail. Tight sidebar? Use `.xs`. Full-width header? Use `.xl`. The naming is intuitive enough that you stop thinking about format strings entirely.

There's also `.clock` for time, `.sortable` for machine-sortable output, and `.log` for log lines:

```typescript
date.clock     // "3:30 PM"
date.sortable  // "2026-02-03"
date.log       // "2026-02-03 15:30:45"
```

## One config file controls all output

Every string Whenny produces -- relative times, smart formatting, size labels -- comes from a single config object. You define it once in `whenny.config.ts`:

```typescript
import { defineConfig } from './lib/whenny/config'

export default defineConfig({
  relative: {
    justNow: 'moments ago',
    minutesAgo: (n) => `${n}m ago`,
    hoursAgo: (n) => `${n}h ago`,
    yesterday: 'yesterday',
  },
  styles: {
    xs: 'D/M',
    sm: 'Do MMM',
    md: 'Do MMM, YYYY',
    lg: 'Do MMMM, YYYY',
    xl: 'dddd, Do MMMM, YYYY',
  },
})
```

Change `justNow` from `"just now"` to `"moments ago"` and every call to `relative()` across your entire app updates. No find-and-replace. No props drilling.

## Themes: match the platform you're building for

Whenny ships with pre-built themes for common platforms. The same timestamp, different voices:

```typescript
import { slack, github, discord } from './lib/whenny/themes'
import { configure } from './lib/whenny/config'

// Slack style
configure(slack)
whenny(fiveMinAgo).relative()  // "5 min"
whenny(yesterday).smart()      // "Yesterday at 3:45 PM"

// GitHub style
configure(github)
whenny(fiveMinAgo).relative()  // "5 minutes ago"
whenny(lastMonth).smart()      // "on Jan 15, 2026"

// Discord style
configure(discord)
whenny(fiveMinAgo).relative()  // "5 minutes ago"
whenny(today).smart()          // "Today at 3:45 PM"
```

There's also `twitter` (ultra-compact: `"5m"`, `"3h"`, `"2d"`), `minimal`, `formal`, and `technical` (ISO 8601 everywhere). Or spread a theme and override the parts you want:

```typescript
import { slack } from './lib/whenny/themes'

export default defineConfig({
  ...slack,
  relative: {
    ...slack.relative,
    justNow: 'right now',
  },
})
```

## Smart formatting does what you actually want

The `smart()` function picks the right format based on how far away the date is. No configuration needed, but fully overridable if you want it:

```typescript
smart(now)              // "just now"
smart(fiveMinutesAgo)   // "5 minutes ago"
smart(todayAt3pm)       // "3:00 PM"
smart(yesterday)        // "Yesterday at 3:45 PM"
smart(lastTuesday)      // "Tuesday at 3:45 PM"
smart(lastMonth)        // "Jan 15"
smart(lastYear)         // "Jan 15, 2025"
```

It also handles future dates -- `"tomorrow at 3:45 PM"`, `"in 5 minutes"` -- with a separate configurable bucket list.

## React hooks, SSR-safe

The `react` module gives you hooks that handle the annoying parts -- auto-updating, hydration mismatches, cleanup:

```tsx
import { useRelativeTime } from './lib/whenny/react'

function Comment({ createdAt }) {
  const timeAgo = useRelativeTime(createdAt)
  return <span className="text-gray-500">{timeAgo}</span>
}

// With options
const timeAgo = useRelativeTime(date, {
  updateInterval: 30000,  // refresh every 30s
  smart: true,            // use smart formatting
})
```

Also ships `useCountdown`, `useDateFormatter`, and `useShadcnCalendar` for calendar integration.

## The details

- **Zero dependencies.** The core library has no runtime dependencies. No lodash, no date-fns, no moment.
- **374+ tests.** Relative time, smart formatting, edge cases, calendar operations, timezone handling, all covered.
- **TypeScript strict mode.** Full type safety, exported types, no `any`.
- **Server-aware.** Smart formatting warns you when you forget timezone context on the server side, with configurable fallback behavior.

## Why not just use date-fns?

date-fns is great. I've used it for years. But it gives you functions, not opinions. You still have to build the "5 minutes ago" logic, the "show time if today, show date if older" logic, the "make it look like Slack" logic.

Whenny is opinionated where you want opinions (smart formatting, themes, voice) and flexible where you want flexibility (own the source, modify anything, configure everything).

## Try it

```bash
npx create-whenny init
```

- [GitHub](https://github.com/ZVN-DEV/whenny)
- [Docs](https://whenny.dev)
- [npm](https://www.npmjs.com/package/whenny)

If you're starting a new project and you know you'll need date formatting -- which is basically every project -- check it out. Copy the code, make it yours, and stop maintaining that `formatDate.ts` file.
