// Blog posts with scheduled publish dates
// Posts will only show if publishDate <= current date

export interface BlogPost {
  slug: string
  title: string
  subtitle: string
  publishDate: string // ISO date string
  readTime: string
  tags: string[]
  content: string
}

export const posts: BlogPost[] = [
  {
    slug: 'introducing-whenny',
    title: 'Introducing Whenny',
    subtitle: 'The TypeScript Date Library That AI Actually Understands',
    publishDate: '2026-02-06', // Thursday
    readTime: '5 min read',
    tags: ['typescript', 'javascript', 'ai'],
    content: `If you've ever asked an AI assistant to help you with date formatting in JavaScript, you've probably received a mix of \`moment()\`, \`dayjs()\`, \`date-fns\`, and vanilla \`Intl.DateTimeFormat\` suggestions. The AI doesn't know which library you're using, what your project conventions are, or how you want dates displayed.

**Whenny changes that.**

## The Problem with Date Libraries Today

Every project I've worked on has the same pattern:

\`\`\`typescript
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
\`\`\`

Four different approaches. No consistency. And when you ask Claude or GPT to add a new date display somewhere? It guesses.

## Enter Whenny

Whenny is a TypeScript date library designed with three principles:

1. **AI-First API**: Clean, predictable functions that AI can reason about
2. **Own Your Code**: shadcn-style installation - code lives in YOUR repo
3. **Configure Once**: Tailwind-like sizing system for consistent output

### The Tailwind Approach to Dates

Instead of remembering format tokens, Whenny uses a size-based system:

\`\`\`typescript
import { whenny } from './lib/whenny'

// T-shirt sizes - configure once, use everywhere
whenny(date).xs      // "2/6"
whenny(date).sm      // "Feb 6"
whenny(date).md      // "Feb 6, 2024"
whenny(date).lg      // "February 6th, 2024"
whenny(date).xl      // "Thursday, February 6th, 2024"
\`\`\`

No more \`'YYYY-MM-DD'\` vs \`'yyyy-MM-dd'\` confusion.

## Quick Start

\`\`\`bash
npx create-whenny
npx create-whenny add all
\`\`\`

This creates a \`lib/whenny/\` folder in your project with the actual source code. You own it. You can modify it.

---

*This is the first post in a series about building date handling that works with AI. Next up: Why owning your code matters for AI collaboration.*`
  },
  {
    slug: 'shadcn-style-dates',
    title: 'Why Your Date Library Should Live in Your Codebase',
    subtitle: 'The shadcn approach to date formatting',
    publishDate: '2026-02-07', // Friday
    readTime: '6 min read',
    tags: ['typescript', 'shadcn', 'architecture'],
    content: `When Shadcn/ui came out, it challenged a fundamental assumption: **why do UI components need to be npm packages?**

The answer was: they don't. By copying components directly into your codebase, you get full customization without forking, no version lock-in, and code that AI assistants can read and understand.

**Whenny applies the same philosophy to date formatting.**

## The node_modules Problem

Here's what happens when you use a traditional date library:

\`\`\`typescript
import { format } from 'date-fns'
const display = format(date, 'yyyy-MM-dd')
\`\`\`

Looks simple. But:

1. **AI can't see the implementation** - When Claude helps you, it can't read inside node_modules
2. **Format strings are tribal knowledge** - Is it \`YYYY\` or \`yyyy\`? Depends on the library
3. **Customization requires workarounds** - Want to change "5 minutes ago" to "5m ago"? Good luck

## The shadcn Approach

Whenny installs code directly into your project:

\`\`\`bash
npx create-whenny
npx create-whenny add relative smart duration
\`\`\`

This creates:

\`\`\`
your-project/
├── lib/
│   └── whenny/
│       ├── core.ts          # Main whenny() function
│       ├── relative.ts      # "5 minutes ago"
│       ├── config.ts        # YOUR configuration
│       └── index.ts         # Exports
\`\`\`

**You own this code.** It's checked into your repo. AI can read it. You can modify it.

## Tailwind-Style Configuration

In your \`lib/whenny/config.ts\`:

\`\`\`typescript
configure({
  styles: {
    xs: 'M/D',
    sm: 'MMM D',
    md: 'MMM D, YYYY',
    lg: 'MMMM Do, YYYY',
  },
  relative: {
    justNow: 'just now',
    minutesAgo: (n) => \`\${n}m ago\`,
  }
})
\`\`\`

Now EVERYWHERE in your app, \`whenny(date).sm\` gives you consistent output.

---

*Next up: The markdown file that teaches AI your date conventions.*`
  },
  {
    slug: 'ai-agents-dates-guide',
    title: 'The Markdown File That Teaches AI How to Handle Dates',
    subtitle: 'Stop getting inconsistent date formatting from Claude and GPT',
    publishDate: '2026-02-10', // Monday
    readTime: '7 min read',
    tags: ['ai', 'typescript', 'developer-experience'],
    content: `Every time you ask an AI assistant to write code that displays a date, you're playing format roulette:

\`\`\`typescript
// Attempt #1
const date = new Date(timestamp).toLocaleDateString()

// Attempt #2
const date = format(timestamp, 'yyyy-MM-dd')

// Attempt #3
const date = moment(timestamp).format('MMM D, YYYY')
\`\`\`

The AI is guessing. It doesn't know your project conventions.

**There's a simple fix: tell it.**

## The Whenny-Dates-Agents.md File

When you initialize Whenny, it generates a markdown file specifically designed for AI consumption:

\`\`\`markdown
# Date Handling Guide for AI Agents

This project uses **Whenny** for all date formatting.
Import from \`@/lib/whenny\` (NOT moment, dayjs, or date-fns).

## Quick Reference

| Use Case | Code | Output |
|----------|------|--------|
| Card dates | \`whenny(date).sm\` | "Feb 6" |
| Full dates | \`whenny(date).lg\` | "February 6th, 2024" |
| Timestamps | \`whenny(date).relative()\` | "5m ago" |

## DO NOT
- Import from moment, dayjs, or date-fns
- Use new Date().toLocaleDateString()
- Write custom format strings
\`\`\`

## Why This Works

AI assistants read your project files for context. When they encounter a task involving dates, they'll find this file, read your conventions, and generate matching code.

### Before (Without the Guide)
Claude generates: \`format(post.createdAt, 'MMMM d, yyyy')\`

### After (With the Guide)
Claude generates: \`whenny(post.createdAt).md\`

Consistent with your existing codebase. Every time.

---

*Next up: The timestamp trap - why your calendar component shows the wrong date.*`
  },
  {
    slug: 'the-timestamp-trap',
    title: 'The Timestamp Trap: Why Your Calendar Shows the Wrong Date',
    subtitle: 'And why AI assistants keep generating code that makes it worse',
    publishDate: '2026-02-11', // Tuesday
    readTime: '8 min read',
    tags: ['typescript', 'timezone', 'bugs'],
    content: `You've seen this bug. Maybe you've shipped it.

A user in New York selects **December 5th** on a date picker. They submit the form. The confirmation page shows **December 4th**.

What happened?

## The Silent Timezone Disaster

User clicks December 5th. The calendar creates:

\`\`\`javascript
new Date('2024-12-05')
// JavaScript interprets as UTC midnight
\`\`\`

On the user's machine in New York:

\`\`\`javascript
new Date('2024-12-05').toLocaleDateString()
// "12/4/2024" - WRONG!
\`\`\`

**December 5th UTC midnight is December 4th at 7pm in New York.**

The frontend sends it to the server, the server stores it, and when it comes back... the user sees the wrong date.

## Why AI Makes It Worse

Ask Claude to help with a date picker form:

\`\`\`typescript
// AI generates this (broken)
const handleSubmit = async (selectedDate: Date) => {
  await fetch('/api/events', {
    body: JSON.stringify({
      date: selectedDate.toISOString()  // Bug waiting to happen
    })
  })
}
\`\`\`

The AI follows "best practices" (use ISO strings, store UTC) but produces wrong results.

## The Solution: Whenny's Transfer Protocol

Whenny preserves timezone context across the wire:

\`\`\`typescript
import { createTransfer, fromTransfer } from '@/lib/whenny'

// FRONTEND: User picks December 5th
const payload = createTransfer(selectedDate, {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
})
// { iso: "...", originZone: "America/New_York", originOffset: -300 }

// SERVER: Receive and store
const received = fromTransfer(body.date)
await db.events.create({
  datetime: received.date,
  timezone: received.originZone,
})

// FRONTEND: Display correctly
whenny(event.datetime).md  // "Dec 5, 2024" ✓
\`\`\`

Stop shipping the December 4th bug.

\`\`\`bash
npx create-whenny
npx create-whenny add transfer timezone
\`\`\``
  }
]

// Get only published posts (publishDate <= today)
export function getPublishedPosts(): BlogPost[] {
  const today = new Date().toISOString().split('T')[0]
  return posts.filter(post => post.publishDate <= today)
}

// Get a single post by slug (only if published)
export function getPostBySlug(slug: string): BlogPost | undefined {
  const published = getPublishedPosts()
  return published.find(post => post.slug === slug)
}

// Get all posts (for static generation)
export function getAllPosts(): BlogPost[] {
  return posts
}
