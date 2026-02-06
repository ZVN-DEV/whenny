# Whenny

[![CI](https://github.com/ZVN-DEV/whenny/actions/workflows/ci.yml/badge.svg)](https://github.com/ZVN-DEV/whenny/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/whenny.svg)](https://www.npmjs.com/package/whenny)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**[Documentation](https://whenny.dev)** | **[Demo](https://whenny.dev/demo)** | **[Blog](https://whenny.dev/blog)**

## Dates that just work.

**Built for AI. Built for humans. Own your code.**

A date library for the AI era.

## Why Whenny?

1. **AI-First Design** — Clean, predictable API optimized for AI code generation. Every function does one thing well. AI assistants write better code with Whenny.

2. **Own Your Code** — shadcn-style install. Pull functions directly into your codebase. Customize everything. No dependency lock-in. It's your code now.

3. **Server/Client Sync** — The Transfer Protocol carries timezone context across the wire. Store UTC, display local. Server and client finally agree on what time it is.

4. **MCP Server** — Expose all functions to AI assistants through the Model Context Protocol. Let Claude pick the right date utilities for your task.

## Installation

### shadcn-style (Recommended)

```bash
npx create-whenny
npx create-whenny add relative smart calendar
```

This copies the code directly into your project at `src/lib/whenny/`.

### NPM Package

```bash
npm install whenny whenny-react
```

## Quick Start

### Size-Based Formatting

Like Tailwind for dates — simple properties, consistent output:

```typescript
import { whenny } from 'whenny'

whenny(date).xs        // "2/6"
whenny(date).sm        // "Feb 6"
whenny(date).md        // "Feb 6, 2026"
whenny(date).lg        // "February 6th, 2026"
whenny(date).xl        // "Thursday, February 6th, 2026"

whenny(date).clock     // "3:45 PM"
whenny(date).sortable  // "2026-02-06"
```

### Smart Formatting

```typescript
whenny(date).smart()
// → "just now"
// → "5 minutes ago"
// → "Yesterday at 3:45 PM"
// → "Monday at 9:00 AM"
```

### Duration

```typescript
import { duration } from 'whenny'

duration(3661).long()      // "1 hour, 1 minute, 1 second"
duration(3661).compact()   // "1h 1m 1s"
duration(3661).timer()     // "01:01:01"
```

### Calendar

```typescript
import { calendar } from 'whenny'

calendar.isToday(date)            // true
calendar.isBusinessDay(date)      // true
calendar.addBusinessDays(date, 5) // Date (skips weekends)
```

## React Hooks

```tsx
import { useRelativeTime, useCountdown } from 'whenny-react'

function Comment({ createdAt }) {
  const time = useRelativeTime(createdAt)  // Auto-updates
  return <span>{time}</span>
}

function Sale({ endsAt }) {
  const { days, hours, minutes, seconds } = useCountdown(endsAt)
  return <span>{days}d {hours}h {minutes}m {seconds}s</span>
}
```

## Transfer Protocol

Server and client, finally in sync:

```typescript
// Server: serialize with timezone context
import { createTransfer } from 'whenny'

const payload = createTransfer(date, {
  timezone: 'America/New_York'
})

// Client: deserialize and format
import { fromTransfer, whenny } from 'whenny'

const { date, originZone } = fromTransfer(payload)
whenny(date).inZone(originZone).clock
// → "3:00 PM" (original timezone preserved!)
```

## MCP Server (AI Integration)

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

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `whenny` | Create a Whenny date instance |
| `format_datewind` | Format using size-based styles (xs, sm, md, lg, xl) |
| `format_smart` | Smart context-aware formatting |
| `format_relative` | Relative time ("5 minutes ago") |
| `format_duration` | Duration formatting (long, compact, timer) |
| `compare_dates` | Compare two dates |
| `calendar_check` | Check calendar properties (isToday, isWeekend, etc.) |
| `add_business_days` | Add business days to a date |
| `parse_natural` | Parse natural language ("tomorrow at 3pm") |
| `create_transfer` | Create timezone-aware transfer payload |

## CLI Commands

```bash
# Initialize whenny in your project
npx create-whenny

# Add specific modules
npx create-whenny add relative smart calendar duration timezone

# List available modules
npx create-whenny list

# Show changes between your code and latest version
npx create-whenny diff
```

## Available Modules

| Module | Description |
|--------|-------------|
| `core` | Base whenny function with size-based formatting |
| `relative` | Relative time formatting |
| `smart` | Context-aware smart formatting |
| `duration` | Duration formatting |
| `calendar` | Calendar helpers and business day calculations |
| `timezone` | Timezone conversion utilities |
| `transfer` | Transfer Protocol for server/client sync |
| `react` | React hooks (useRelativeTime, useCountdown) |

## Tests

All 380 tests passing.

```bash
npm test
```

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| [`whenny`](packages/whenny/) | Core date library | [![npm](https://img.shields.io/npm/v/whenny.svg)](https://www.npmjs.com/package/whenny) |
| [`whenny-react`](packages/whenny-react/) | React hooks and components | [![npm](https://img.shields.io/npm/v/whenny-react.svg)](https://www.npmjs.com/package/whenny-react) |
| [`create-whenny`](packages/create-whenny/) | CLI for shadcn-style installation | [![npm](https://img.shields.io/npm/v/create-whenny.svg)](https://www.npmjs.com/package/create-whenny) |

## License

MIT

---

Built for the AI era. Own your code.
