# Introducing Whenny: The TypeScript Date Library That AI Actually Understands

*A modern date library built for the AI era. Moment.js's fun cousin.*

---

If you've ever asked an AI assistant to help you with date formatting in JavaScript, you've probably received a mix of `moment()`, `dayjs()`, `date-fns`, and vanilla `Intl.DateTimeFormat` suggestions. The AI doesn't know which library you're using, what your project conventions are, or how you want dates displayed.

**Whenny changes that.**

## The Problem with Date Libraries in 2024

Every project I've worked on has the same pattern:

```typescript
// File 1: UserProfile.tsx
const joinDate = moment(user.createdAt).format('MMM D, YYYY')

// File 2: Comment.tsx
const timeAgo = formatDistanceToNow(comment.createdAt, { addSuffix: true })

// File 3: EventCard.tsx
const eventDate = dayjs(event.startTime).format('dddd, MMMM D')

// File 4: Invoice.tsx
const dueDate = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long'
}).format(invoice.dueAt)
```

Four different approaches. No consistency. And when you ask Claude or GPT to add a new date display somewhere? It guesses. Sometimes it picks moment. Sometimes date-fns. Sometimes it writes 15 lines of vanilla JS.

## Enter Whenny

Whenny is a TypeScript date library designed with three principles:

1. **AI-First API**: Clean, predictable functions that AI can reason about
2. **Own Your Code**: shadcn-style installation - code lives in YOUR repo
3. **Configure Once**: Tailwind-like sizing system for consistent output

### The Tailwind Approach to Dates

Instead of remembering format tokens, Whenny uses a size-based system:

```typescript
import { whenny } from './lib/whenny'

// T-shirt sizes - configure once, use everywhere
whenny(date).xs      // "2/6"
whenny(date).sm      // "Feb 6"
whenny(date).md      // "Feb 6, 2024"
whenny(date).lg      // "February 6th, 2024"
whenny(date).xl      // "Thursday, February 6th, 2024"

// Utility formats
whenny(date).clock   // "3:45 PM"
whenny(date).sortable // "2024-02-06"
```

No more `'YYYY-MM-DD'` vs `'yyyy-MM-dd'` confusion. No more checking docs for every format string.

### shadcn-Style Installation

Whenny doesn't live in `node_modules`. It lives in YOUR codebase:

```bash
npx create-whenny          # Initialize
npx create-whenny add all  # Add all modules
```

This creates a `lib/whenny/` folder in your project with the actual source code. You own it. You can modify it. When AI generates code using whenny, it can read your configuration and match your conventions.

### Why This Matters for AI

When you include a `Whenny-Dates-Agents.md` file in your project (auto-generated), AI assistants can:

1. **See your date conventions** - "This project uses `.md` for card displays and `.lg` for headers"
2. **Understand your timezone handling** - "Dates come from API in UTC, displayed in user's local time"
3. **Follow your patterns** - Consistent output across every file they touch

## Quick Start

```bash
# Install into your project
npx create-whenny

# Add the modules you need
npx create-whenny add relative smart calendar

# Or grab everything
npx create-whenny add all
```

Then use it:

```typescript
import { whenny, relative, smart, duration } from './lib/whenny'

// Smart formatting - picks the best representation automatically
whenny(comment.createdAt).smart()
// "just now" | "5 minutes ago" | "Yesterday at 3pm" | "Feb 6"

// Relative time
relative(notification.timestamp)  // "2 hours ago"

// Duration formatting
duration(videoLength).compact()   // "1h 23m"
duration(videoLength).timer()     // "01:23:45"

// React hooks that auto-update
import { useRelativeTime, useCountdown } from './lib/whenny/react'

function Comment({ createdAt }) {
  const timeAgo = useRelativeTime(createdAt)  // Auto-updates!
  return <span>{timeAgo}</span>
}
```

## What's Included

Whenny is modular. Pick what you need:

| Module | Description |
|--------|-------------|
| `core` | The `whenny()` function with size-based formatting |
| `relative` | "5 minutes ago", "in 3 days" |
| `smart` | Context-aware formatting that picks the best display |
| `duration` | Format time spans: "1h 30m", "01:30:00" |
| `calendar` | Business days, isToday, isWeekend, date math |
| `timezone` | Timezone conversions and utilities |
| `transfer` | Server/client sync protocol (more on this in a future post) |
| `natural` | Parse "next tuesday at 3pm" into Date objects |
| `react` | Hooks: useRelativeTime, useCountdown |
| `constants` | 400+ IANA timezones, format patterns |

## Coming Up

This is the first post in a series about building date handling that works with AI:

1. **This post** - Introduction to Whenny
2. **shadcn-style imports** - Why owning your code matters for AI collaboration
3. **AI Agents guide** - The markdown file that makes AI date-aware
4. **The timestamp trap** - Why your calendar component is showing the wrong date (and how to fix it)

## Try It

```bash
npx create-whenny
```

GitHub: [github.com/ZVN-DEV/whenny](https://github.com/ZVN-DEV/whenny)
Docs: [whenny.dev](https://whenny.dev)
npm: [npmjs.com/package/whenny](https://npmjs.com/package/whenny)

---

*Whenny is MIT licensed and open source. Star the repo if you find it useful!*

---

**Tags:** #typescript #javascript #webdev #ai
