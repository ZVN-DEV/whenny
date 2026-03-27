---
title: "Tailwind for Dates: What If Date Formatting Used Size Tokens?"
published: true
description: "Instead of format('MMMM Do, YYYY'), what if you just wrote .lg? A Tailwind-inspired approach to date formatting."
tags: typescript, javascript, react, webdev
cover_image:
canonical_url:
---

Every date library ships the same API: a format function and a string of tokens.

```typescript
// date-fns
format(date, 'MMMM do, yyyy')

// Day.js
dayjs(date).format('MMMM Do, YYYY')

// Moment
moment(date).format('MMMM Do, YYYY')
```

Three libraries. Three slightly different token sets. All doing the same thing: turning a Date into "February 3rd, 2026". And every time you reach for one, you end up checking the docs because you can never remember if it's `YYYY` or `yyyy`, `Do` or `do`, `MMM` or `LLL`.

Format strings are the strftime of JavaScript. They work. They're also write-only code that nobody reads confidently on the first pass.

## What if dates worked like Tailwind?

Tailwind killed the "name every class" problem by giving you a scale. You don't write `.card-title-font-size`. You write `.text-xl`. The scale is small, predictable, and the whole team uses the same tokens.

Whenny applies the same idea to dates. Instead of format strings, you pick a size:

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

That's the entire API for static formatting. Seven tokens. No docs to check.

## Side-by-side with format strings

Here's what each size replaces:

| Size | Whenny | date-fns | Day.js |
|------|--------|----------|--------|
| `.xs` | `whenny(date).xs` | `format(date, 'M/d')` | `dayjs(date).format('M/D')` |
| `.sm` | `whenny(date).sm` | `format(date, 'MMM d')` | `dayjs(date).format('MMM D')` |
| `.md` | `whenny(date).md` | `format(date, 'MMM d, yyyy')` | `dayjs(date).format('MMM D, YYYY')` |
| `.lg` | `whenny(date).lg` | `format(date, 'MMMM do, yyyy')` | `dayjs(date).format('MMMM Do, YYYY')` |
| `.xl` | `whenny(date).xl` | `format(date, 'EEEE, MMMM do, yyyy')` | `dayjs(date).format('dddd, MMMM Do, YYYY')` |
| `.clock` | `whenny(date).clock` | `format(date, 'h:mm a')` | `dayjs(date).format('h:mm A')` |
| `.sortable` | `whenny(date).sortable` | `format(date, 'yyyy-MM-dd')` | `dayjs(date).format('YYYY-MM-DD')` |

The format strings aren't hard individually. The problem is that you have dozens of them scattered across a codebase, each written by whoever happened to touch that component. Size tokens give you a shared vocabulary.

## The config file

The sizes are not hardcoded. You define what each one means:

```typescript
// whenny.config.ts
import { defineConfig } from 'whenny/config'

export default defineConfig({
  styles: {
    xs: 'D/M',                    // "3/2" (day-first for UK)
    sm: 'D MMM',                  // "3 Feb"
    md: 'D MMM YYYY',             // "3 Feb 2026"
    lg: 'D MMMM YYYY',            // "3 February 2026"
    xl: 'dddd, D MMMM YYYY',      // "Tuesday, 3 February 2026"
  },
  calendar: {
    weekStartsOn: 'monday',
  },
})
```

One file. Every `whenny(date).md` call across your entire app now outputs day-first formatting. No find-and-replace across format strings.

This is the same pattern as `tailwind.config.js`. The tokens stay the same. The values behind them change per project.

## Themes for relative time

Static formatting is half the story. The other half is relative time -- "5 minutes ago", "yesterday", "just now". Every product styles these differently.

Whenny ships themes that match real products:

```typescript
import { themes } from 'whenny/themes'
import { configure } from 'whenny'

configure(themes.slack)
```

Here's how the same timestamp renders under different themes:

```typescript
// 5 minutes ago:
// slack theme  -> "5m"
// github theme -> "5 minutes ago"
// twitter theme -> "5m"
// discord theme -> "Today at 3:45 PM"
// formal theme -> "5 minutes ago"
```

You can also write your own:

```typescript
configure({
  relative: {
    justNow: 'just now',
    minutesAgo: (n) => `${n}m ago`,
    hoursAgo: (n) => `${n}h ago`,
    daysAgo: (n) => `${n}d ago`,
  }
})
```

The config controls every string Whenny outputs. Same API surface, different voice.

## React: auto-updating relative time

Relative timestamps go stale. "Just now" should become "1 minute ago" without a page refresh. Whenny's React package handles this:

```tsx
import { useRelativeTime } from 'whenny-react'

function Comment({ createdAt }) {
  const time = useRelativeTime(createdAt)
  // Auto-updates: "just now" -> "1m ago" -> "2m ago"
  return <time>{time}</time>
}
```

No intervals to manage. No cleanup to forget. The hook handles the tick lifecycle and respects your theme config.

## SSR: the Transfer Protocol

Server-rendered dates have a timezone problem. The server is in UTC. The user is in `America/Chicago`. If you format on the server, you show the wrong time. If you format on the client, you get a hydration mismatch.

Whenny's Transfer Protocol carries timezone context across the wire:

```typescript
// Server
import { createTransfer } from 'whenny'

const payload = {
  createdAt: createTransfer(post.createdAt, {
    timezone: 'America/New_York'
  })
}

// Client
import { fromTransfer, whenny } from 'whenny'

const { date, originZone } = fromTransfer(payload.createdAt)
whenny(date).inZone(originZone).clock  // "3:00 PM" -- correct timezone
```

The date arrives with its timezone metadata intact. No guessing on the client.

## The pitch

Whenny is not trying to replace date-fns for date math. If you need `addDays` or `differenceInCalendarWeeks`, use date-fns.

Whenny replaces the formatting layer -- the part where you turn a Date into a string for display. It does this with:

- **Size tokens** instead of format strings
- **A config file** instead of scattered conventions
- **Themes** instead of one-off relative time formatting
- **A transfer protocol** instead of timezone hacks

The whole thing is TypeScript, tree-shakeable, and installs shadcn-style into your codebase if you want to own the code.

```bash
npx create-whenny init
npx create-whenny add relative smart calendar
```

GitHub: [github.com/ZVN-DEV/whenny](https://github.com/ZVN-DEV/whenny)
Docs: [whenny.dev](https://whenny.dev)

If you've ever spent ten minutes debugging a format string, give the size tokens a try.
