# The Markdown File That Teaches AI How to Handle Dates in Your Project

*Stop getting inconsistent date formatting from Claude, Copilot, and ChatGPT*

---

Every time you ask an AI assistant to write code that displays a date, you're playing format roulette:

```typescript
// What you get from AI attempt #1:
const date = new Date(timestamp).toLocaleDateString()

// Attempt #2:
const date = format(timestamp, 'yyyy-MM-dd')

// Attempt #3:
const date = moment(timestamp).format('MMM D, YYYY')

// Attempt #4:
const date = dayjs(timestamp).format('MMMM D, YYYY')
```

The AI is guessing. It doesn't know your project conventions, your preferred library, or how you want dates displayed in different contexts.

**There's a simple fix: tell it.**

## The Whenny-Dates-Agents.md File

When you initialize Whenny in your project, it can generate a markdown file specifically designed for AI consumption:

```bash
npx create-whenny
# Generates lib/whenny/ AND Whenny-Dates-Agents.md
```

This file lives in your project root and contains everything an AI needs to know about handling dates in YOUR codebase.

## What Goes in the File

Here's an example `Whenny-Dates-Agents.md`:

```markdown
# Date Handling Guide for AI Agents

This project uses **Whenny** for all date formatting and manipulation.
Import from `@/lib/whenny` (NOT moment, dayjs, or date-fns).

## Quick Reference

| Use Case | Code | Output |
|----------|------|--------|
| Card/list dates | `whenny(date).sm` | "Feb 6" |
| Full dates | `whenny(date).lg` | "February 6th, 2024" |
| Timestamps | `whenny(date).clock` | "3:45 PM" |
| Relative time | `whenny(date).relative()` | "5m ago" |
| Smart (auto) | `whenny(date).smart()` | Context-aware |

## Import Statement

Always use:
```typescript
import { whenny, relative, smart, duration } from '@/lib/whenny'
```

## Formatting Rules

1. **User-facing dates**: Use `.sm` or `.md` sizes
2. **Timestamps on comments/posts**: Use `.relative()` or `.smart()`
3. **Headers/titles**: Use `.lg` or `.xl` sizes
4. **API responses**: Use `.sortable` (ISO format)
5. **Logs**: Use `.log` format

## DO NOT

- Import from `moment`, `dayjs`, or `date-fns`
- Use `new Date().toLocaleDateString()`
- Write custom format strings (use size properties instead)
- Forget timezone handling (see Transfer Protocol section)

## Timezone Handling

This project stores dates in UTC. When displaying:

```typescript
// From API (UTC) -> Display (local)
whenny(apiDate).smart()  // Automatically converts

// When SENDING to API from user input:
import { createTransfer } from '@/lib/whenny'
const payload = createTransfer(userSelectedDate, {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
})
```

## React Components

Use the hooks for auto-updating displays:

```typescript
import { useRelativeTime, useCountdown } from '@/lib/whenny/react'

// Auto-updates every minute
const timeAgo = useRelativeTime(comment.createdAt)

// Countdown timer
const { days, hours, minutes, seconds } = useCountdown(deadline)
```

## Installed Modules

- [x] core - Base formatting
- [x] relative - "5 minutes ago"
- [x] smart - Context-aware formatting
- [x] duration - "1h 30m"
- [x] calendar - Business days, date math
- [x] timezone - Timezone utilities
- [x] transfer - Server/client sync
- [x] react - Hooks
```

## Why This Works

AI assistants like Claude, GPT, and Copilot read your project files for context. When they encounter a task involving dates, they'll:

1. **Find the markdown file** - It's in the project root, easy to discover
2. **Read your conventions** - Import paths, formatting rules, DO NOTs
3. **Generate matching code** - Consistent with your existing codebase

### Before (Without the Guide)

```
You: "Add a created date to the BlogPost component"

AI: *generates*
import { format } from 'date-fns'
<span>{format(post.createdAt, 'MMMM d, yyyy')}</span>
```

### After (With the Guide)

```
You: "Add a created date to the BlogPost component"

AI: *reads Whenny-Dates-Agents.md*
AI: *generates*
import { whenny } from '@/lib/whenny'
<span>{whenny(post.createdAt).md}</span>
```

## Auto-Generation

The guide updates automatically when you add modules:

```bash
npx create-whenny add duration calendar
# Whenny-Dates-Agents.md is regenerated with new modules documented
```

## Customizing the Guide

The file is yours to edit. Add project-specific rules:

```markdown
## Project-Specific Rules

### Event Dates
Events always show day of week:
```typescript
whenny(event.startTime).xl  // "Thursday, February 6th, 2024"
```

### Invoice Due Dates
Use formal format for financial documents:
```typescript
whenny(invoice.dueDate).format('MMMM Do, YYYY')
```

### User Birthdays
Never show year for privacy:
```typescript
whenny(user.birthday).format('MMMM Do')  // "February 6th"
```
```

## MCP Server Integration

If you're using Claude with MCP (Model Context Protocol), Whenny includes a built-in server:

```json
{
  "mcpServers": {
    "whenny": {
      "command": "npx",
      "args": ["create-whenny", "mcp"]
    }
  }
}
```

This exposes all Whenny functions directly to Claude, so it can:
- Format dates in real-time while helping you
- Understand your configuration
- Suggest the right function for each use case

## The Full Template

Here's a complete `Whenny-Dates-Agents.md` you can customize:

```markdown
# Date Handling - AI Agent Guide

## Overview
This project uses Whenny for date handling. All date code should use
imports from `@/lib/whenny`.

## Installed Modules
<!-- Auto-updated when you run `npx create-whenny add` -->
- core, relative, smart, duration, calendar, react

## Quick Reference

### Formatting Sizes
| Size | Example | Use For |
|------|---------|---------|
| `.xs` | "2/6" | Compact spaces |
| `.sm` | "Feb 6" | Cards, lists |
| `.md` | "Feb 6, 2024" | Default display |
| `.lg` | "February 6th, 2024" | Headers |
| `.xl` | "Thursday, February 6th, 2024" | Full context |

### Special Formats
| Property | Example | Use For |
|----------|---------|---------|
| `.clock` | "3:45 PM" | Time only |
| `.sortable` | "2024-02-06" | APIs, sorting |
| `.log` | "2024-02-06 15:45:00" | Logging |

### Methods
| Method | Example | Use For |
|--------|---------|---------|
| `.relative()` | "5m ago" | Timestamps |
| `.smart()` | varies | Auto-pick best |
| `.format('...')` | custom | Specific needs |

## Rules

1. ALWAYS import from `@/lib/whenny`
2. PREFER size properties over format strings
3. USE `.smart()` when unsure
4. USE hooks in React components for auto-updating

## Don't Do This

```typescript
// BAD
import moment from 'moment'
import { format } from 'date-fns'
new Date().toLocaleDateString()
```

## Do This Instead

```typescript
// GOOD
import { whenny } from '@/lib/whenny'
whenny(date).md
```
```

## Get Started

```bash
npx create-whenny
```

The AI-friendly guide is generated automatically. Edit it to match your project's specific needs.

---

**Next up:** The timestamp trap - why your calendar component shows the wrong date and how Whenny's Transfer Protocol fixes it.

---

**Tags:** #ai #typescript #javascript #webdev
