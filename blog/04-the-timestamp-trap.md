# The Timestamp Trap: Why Your Calendar Component Shows the Wrong Date

*And why AI assistants keep generating code that makes it worse*

---

You've seen this bug. Maybe you've shipped it.

A user in New York selects **December 5th** on a date picker. They submit the form. The confirmation page shows **December 4th**.

What happened?

## The Silent Timezone Disaster

Here's the flow that breaks everything:

### Step 1: User Picks a Date

User is in New York (EST, UTC-5). They click December 5th on a calendar component.

The calendar doesn't care about time - it's a DATE picker. But JavaScript `Date` objects always have a time. So the component creates:

```javascript
// Calendar component output
new Date('2024-12-05')  // December 5th, 2024
```

But wait - what time? When you create a date from a date-only string, JavaScript interprets it as **midnight UTC**:

```javascript
new Date('2024-12-05').toISOString()
// "2024-12-05T00:00:00.000Z"  <- UTC midnight
```

### Step 2: Display Looks Fine (Locally)

On the user's machine in New York:

```javascript
new Date('2024-12-05').toLocaleDateString()
// "12/4/2024"  <- WAIT WHAT?!
```

**December 5th UTC midnight is December 4th at 7pm in New York.**

But most calendar components compensate for this by using `toDateString()` or extracting just the date parts. So the user sees "December 5th" and thinks everything is fine.

### Step 3: Send to Server

The frontend sends the date to the API:

```javascript
// Frontend code
fetch('/api/events', {
  method: 'POST',
  body: JSON.stringify({
    date: selectedDate.toISOString()
    // "2024-12-05T00:00:00.000Z"
  })
})
```

### Step 4: Server Stores It

The server receives the ISO string and stores it in the database. No conversion, just storage. Seems safe.

```javascript
// Server code
await db.events.create({
  date: new Date(body.date)  // Stored as UTC
})
```

### Step 5: Send Back to User

Later, the server sends this event back:

```javascript
// API Response
{
  "date": "2024-12-05T00:00:00.000Z"
}
```

### Step 6: User Sees Wrong Date

The frontend displays it:

```javascript
// Frontend
const eventDate = new Date(event.date)
eventDate.toLocaleDateString('en-US')
// "12/4/2024"  <- December 4th, NOT December 5th
```

**The user selected December 5th. They now see December 4th.**

## Why AI Assistants Make This Worse

Ask Claude or GPT to help with a date picker form, and you'll get code like:

```typescript
// AI-generated code (broken)
const handleSubmit = async (selectedDate: Date) => {
  await fetch('/api/events', {
    method: 'POST',
    body: JSON.stringify({
      date: selectedDate.toISOString()
    })
  })
}
```

The AI doesn't know about your timezone issues. It generates "correct" code that follows best practices (use ISO strings, store in UTC) but produces wrong results.

Ask for a fix, and you might get:

```typescript
// AI "fix" attempt #1 (still broken)
const handleSubmit = async (selectedDate: Date) => {
  const dateOnly = selectedDate.toISOString().split('T')[0]
  await fetch('/api/events', {
    method: 'POST',
    body: JSON.stringify({ date: dateOnly })
  })
}
```

Now you're sending `"2024-12-05"` as a string. But when the server parses it back to a Date, you're back to the same problem.

```typescript
// AI "fix" attempt #2 (hacky, fragile)
const adjustedDate = new Date(
  selectedDate.getTime() +
  selectedDate.getTimezoneOffset() * 60 * 1000
)
```

This works sometimes but fails for DST transitions and doesn't communicate intent.

## The Real Problem

The issue is a **mismatch of concepts**:

1. **Calendar dates** are time-agnostic: "December 5th" means that day, everywhere
2. **JavaScript Dates** are instants in time: a specific millisecond, with timezone context
3. **UTC storage** loses the user's timezone context

When a user picks "December 5th" on a calendar, they mean **December 5th in their local context**. Not "midnight UTC" or "midnight server time."

## The Solution: Whenny's Transfer Protocol

Whenny solves this by preserving timezone context across the wire:

```typescript
import { createTransfer, fromTransfer } from '@/lib/whenny'

// FRONTEND: User picks December 5th
const handleSubmit = async (selectedDate: Date) => {
  const payload = createTransfer(selectedDate, {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })

  // payload = {
  //   iso: "2024-12-05T05:00:00.000Z",  // Actual UTC instant
  //   originZone: "America/New_York",    // Where user is
  //   originOffset: -300                 // UTC-5 in minutes
  // }

  await fetch('/api/events', {
    method: 'POST',
    body: JSON.stringify({ date: payload })
  })
}
```

### On the Server

```typescript
// SERVER: Receive and store
import { fromTransfer } from 'whenny'

const received = fromTransfer(body.date)

await db.events.create({
  datetime: received.date,        // Store UTC instant
  timezone: received.originZone,  // Remember where it came from
})
```

### When Displaying

```typescript
// FRONTEND: Display correctly
import { whenny } from '@/lib/whenny'

// Option 1: Show in user's local time
whenny(event.datetime).md
// "Dec 5, 2024" <- Correct!

// Option 2: Show in the ORIGINAL timezone (where event was created)
whenny(event.datetime).inZone(event.timezone).md
// "Dec 5, 2024" <- Also correct!
```

## The Key Insight

There's only ONE instant in time - the moment December 5th begins in New York.

- In UTC, that's `2024-12-05T05:00:00Z`
- In New York, that's `2024-12-05T00:00:00-05:00`
- In London, that's `2024-12-05T05:00:00+00:00`

**Same instant, different representations.**

Whenny's Transfer Protocol keeps all this information together:

```typescript
{
  iso: "2024-12-05T05:00:00.000Z",  // The actual instant
  originZone: "America/New_York",   // Context for interpretation
  originOffset: -300                // Offset at that moment
}
```

## Handling Date-Only Selections

For calendar pickers where time doesn't matter, Whenny provides a cleaner approach:

```typescript
import { createTransfer } from '@/lib/whenny'

// When user picks December 5th (no time):
const dateOnlyPayload = createTransfer(selectedDate, {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateOnly: true  // Treats as start-of-day in user's timezone
})
```

The `dateOnly` flag tells the receiving end: "This represents a calendar date, not a specific instant."

## Quick Fix for Existing Code

If you're already using a calendar component that gives you broken dates, here's how to retrofit Whenny:

```typescript
// BEFORE (broken)
const handleDateSelect = (date: Date) => {
  onSubmit({ eventDate: date.toISOString() })
}

// AFTER (fixed)
import { createTransfer } from '@/lib/whenny'

const handleDateSelect = (date: Date) => {
  const transfer = createTransfer(date, {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })
  onSubmit({ eventDate: transfer })
}
```

On the receiving end:

```typescript
// BEFORE (broken)
const displayDate = new Date(event.eventDate).toLocaleDateString()

// AFTER (fixed)
import { whenny, fromTransfer } from '@/lib/whenny'

const { date } = fromTransfer(event.eventDate)
const displayDate = whenny(date).md
```

## Why This Matters for AI

When you have Whenny's `Whenny-Dates-Agents.md` in your project, AI assistants learn:

1. **Always use createTransfer when sending dates to the server**
2. **Always use fromTransfer when receiving dates**
3. **Always use whenny() for display**

No more AI-generated code that silently breaks timezone handling.

## Try It

```bash
npx create-whenny
npx create-whenny add transfer timezone
```

Then use the Transfer Protocol for all client-server date communication.

---

## Summary

| Problem | Traditional Approach | Whenny Solution |
|---------|---------------------|-----------------|
| Date-only picks | Midnight UTC (wrong day) | Transfer with timezone |
| Lost timezone | Store UTC only | Store UTC + origin zone |
| Display errors | Manual offset math | `whenny(date).md` |
| AI assistance | Generates broken code | Reads your conventions |

Stop fighting timezones. Stop shipping the December 4th bug.

```bash
npx create-whenny
```

---

**Tags:** #typescript #javascript #webdev #timezone
