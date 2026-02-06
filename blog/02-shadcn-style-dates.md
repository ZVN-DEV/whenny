# Why Your Date Library Should Live in Your Codebase, Not node_modules

*The shadcn approach to date formatting - own your code, configure like Tailwind*

---

When Shadcn/ui came out, it challenged a fundamental assumption: **why do UI components need to be npm packages?**

The answer was: they don't. By copying components directly into your codebase, you get:
- Full customization without forking
- No version lock-in
- Code that AI assistants can read and understand
- Consistency that matches YOUR project, not some library author's opinion

**Whenny applies the same philosophy to date formatting.**

## The node_modules Problem

Here's what happens when you use a traditional date library:

```typescript
// Your code
import { format } from 'date-fns'
const display = format(date, 'MMM d, yyyy')
```

Looks simple. But:

1. **AI can't see the implementation** - When Claude helps you, it can't read inside `node_modules`
2. **Format strings are tribal knowledge** - Is it `YYYY` or `yyyy`? Depends on the library
3. **Customization requires workarounds** - Want to change "5 minutes ago" to "5m ago"? Good luck
4. **No project-wide conventions** - Every developer picks their own format strings

## The shadcn Approach

Whenny installs code directly into your project:

```bash
npx create-whenny
npx create-whenny add relative smart duration
```

This creates:

```
your-project/
├── lib/
│   └── whenny/
│       ├── core.ts          # Main whenny() function
│       ├── relative.ts      # "5 minutes ago"
│       ├── smart.ts         # Context-aware formatting
│       ├── duration.ts      # "1h 30m"
│       ├── config.ts        # YOUR configuration
│       └── index.ts         # Exports
```

**You own this code.** It's checked into your repo. AI can read it. You can modify it.

## Tailwind-Style Configuration

Remember the first time you used Tailwind? Instead of:

```css
.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.75rem;
}
```

You wrote:

```html
<h2 class="text-xl font-semibold">
```

Whenny does the same for dates. Instead of:

```typescript
// Memorizing format tokens
format(date, 'MMM d, yyyy')      // date-fns
moment(date).format('MMM D, YYYY') // moment
dayjs(date).format('MMM D, YYYY')  // dayjs
```

You write:

```typescript
whenny(date).md  // "Feb 6, 2024"
```

### Configure Once, Use Everywhere

In your `lib/whenny/config.ts`:

```typescript
import { configure } from './core'

configure({
  styles: {
    xs: 'M/D',              // "2/6"
    sm: 'MMM D',            // "Feb 6"
    md: 'MMM D, YYYY',      // "Feb 6, 2024"
    lg: 'MMMM Do, YYYY',    // "February 6th, 2024"
    xl: 'dddd, MMMM Do, YYYY', // "Thursday, February 6th, 2024"
    clock: 'h:mm A',        // "3:45 PM"
    sortable: 'YYYY-MM-DD', // "2024-02-06"
  },
  relative: {
    justNow: 'just now',
    minutesAgo: (n) => `${n}m ago`,
    hoursAgo: (n) => `${n}h ago`,
    daysAgo: (n) => `${n}d ago`,
  }
})
```

Now EVERYWHERE in your app:

```typescript
// Component 1
whenny(post.createdAt).sm   // "Feb 6"

// Component 2
whenny(event.startTime).lg  // "February 6th, 2024"

// Component 3
whenny(comment.timestamp).relative()  // "5m ago"
```

**One configuration. Consistent output. No format strings to remember.**

## Why This Matters for AI Collaboration

When you ask Claude to add a date display to a new component, here's what happens:

### With Traditional Libraries

```
You: "Add a timestamp to the comment component"

Claude: *checks if project uses moment, dayjs, date-fns, or Intl*
Claude: *guesses based on package.json*
Claude: *picks a format string that might not match your conventions*
```

Result: Inconsistent formatting across your codebase.

### With Whenny

```
You: "Add a timestamp to the comment component"

Claude: *reads lib/whenny/config.ts*
Claude: *sees your relative time config uses "5m ago" format*
Claude: *matches your existing patterns*
```

```typescript
// Claude generates:
import { whenny } from '@/lib/whenny'

function Comment({ comment }) {
  return (
    <div>
      <span>{whenny(comment.createdAt).relative()}</span>
      {/* Uses YOUR config: "5m ago" not "5 minutes ago" */}
    </div>
  )
}
```

## Real-World Configuration Examples

### Slack-Style

```typescript
configure({
  styles: {
    xs: 'M/D',
    sm: 'MMM D',
    md: 'MMM D, YYYY',
  },
  relative: {
    justNow: 'just now',
    minutesAgo: (n) => `${n} min`,
    hoursAgo: (n) => `${n} hr`,
  },
  smart: {
    todayFormat: 'h:mm A',           // "3:45 PM"
    yesterdayFormat: '[Yesterday at] h:mm A',
    thisWeekFormat: 'dddd [at] h:mm A', // "Monday at 3:45 PM"
  }
})
```

### Twitter-Style (Ultra Compact)

```typescript
configure({
  relative: {
    justNow: 'now',
    secondsAgo: (n) => `${n}s`,
    minutesAgo: (n) => `${n}m`,
    hoursAgo: (n) => `${n}h`,
    daysAgo: (n) => `${n}d`,
  }
})
```

### Formal/Business

```typescript
configure({
  styles: {
    sm: 'D MMMM',           // "6 February"
    md: 'D MMMM YYYY',      // "6 February 2024"
    lg: 'Do of MMMM, YYYY', // "6th of February, 2024"
  },
  relative: {
    justNow: 'a moment ago',
    minutesAgo: (n) => `${n} minutes ago`,
  }
})
```

## The Module System

Don't need everything? Only install what you use:

```bash
# Just core formatting
npx create-whenny add core

# Add relative time later
npx create-whenny add relative

# Need business day calculations?
npx create-whenny add calendar
```

Each module is independent. Your bundle only includes what you actually use.

## Migration from Other Libraries

Already using moment or date-fns? Whenny's format strings are compatible:

```typescript
// These all work:
whenny(date).format('YYYY-MM-DD')      // moment-style
whenny(date).format('MMM Do, YYYY')    // moment-style
whenny(date).md                        // Or just use sizes!
```

## Try It

```bash
npx create-whenny
```

Then open `lib/whenny/config.ts` and make it yours.

---

**Next up:** How to create an AI-friendly markdown file that teaches agents your date conventions.

---

**Tags:** #typescript #javascript #webdev #shadcn
