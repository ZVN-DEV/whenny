---
title: "Why Your App Shows the Wrong Time (and a Protocol That Fixes It)"
published: true
description: "Server renders UTC, browser shows local time, user sees garbage. Here's a protocol that carries timezone context across the wire."
tags: typescript, javascript, nextjs, react
cover_image:
canonical_url:
---

Your server says the event starts at 3:00 PM. Your user sees 3:00 AM. Nobody changed anything. The data is "correct." The bug is invisible until someone in a different timezone files a report.

I have shipped this bug. You probably have too.

## Why This Keeps Happening

The root cause is simple: `Date` objects lose their timezone context the moment you serialize them.

```typescript
// Server Component (Next.js)
const event = await db.events.findFirst()
// event.startTime = Date object, internally UTC

return <EventCard time={event.startTime.toISOString()} />
// Sends "2026-03-15T20:00:00.000Z" to the client
```

The client receives a UTC string. It parses it into a local `Date`. If the server meant 3:00 PM Eastern, the user in Tokyo sees 5:00 AM the next day. There is no timezone metadata in an ISO string -- just a `Z` that means UTC.

This gets worse with SSR. The server renders the date in UTC (or whatever the server's locale is). The browser hydrates and re-renders in the user's local timezone. React throws a hydration mismatch warning. The timestamp visibly flickers on screen.

```
Warning: Text content did not match.
Server: "8:00 PM" Client: "3:00 PM"
```

## The Typical Workaround

Most teams end up here:

```tsx
function EventTime({ iso }: { iso: string }) {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    // Only format on the client, after hydration
    setDisplay(new Date(iso).toLocaleTimeString())
  }, [iso])

  return <time suppressHydrationWarning>{display}</time>
}
```

This "works" but it is genuinely bad:

- **Layout shift.** The time renders empty or wrong, then pops in with the correct value.
- **`suppressHydrationWarning`** is a band-aid that hides real bugs.
- **Every date component** in your app needs this same boilerplate.
- **You still lost the original timezone.** If the event was created in New York, and you want to show "3:00 PM ET" to a user in London, you cannot -- that context is gone.

## The Transfer Protocol

The fix is to stop sending bare ISO strings. Send the date WITH its timezone context.

```typescript
import { createTransfer } from 'whenny'

// On the server
const payload = createTransfer(event.startTime, {
  timezone: 'America/New_York'
})

// payload:
// {
//   iso: "2026-03-15T20:00:00.000Z",
//   originZone: "America/New_York",
//   originOffset: -240
// }
```

Three fields. The UTC instant, the timezone it came from, and the offset at that moment (which accounts for DST). This is a plain object -- it serializes to JSON without any tricks.

On the receiving end:

```typescript
import { fromTransfer, whenny } from 'whenny'

const received = fromTransfer(payload)

received.date          // Date object in UTC
received.originZone    // "America/New_York"

whenny(received.date).inZone(received.originZone).clock
// "3:00 PM"  -- correct, always
```

The key insight: you are not converting timezones. You are preserving context that already existed but was being thrown away during serialization.

## Next.js: Server Components to Client Components

This pattern maps directly onto the Next.js App Router.

**Server Component** -- fetches data, creates the transfer:

```tsx
// app/events/[id]/page.tsx (Server Component)
import { createTransfer } from 'whenny'

export default async function EventPage({ params }) {
  const event = await db.events.findUnique({ where: { id: params.id } })

  const timePayload = createTransfer(event.startTime, {
    timezone: event.timezone  // stored when event was created
  })

  return <EventDetails time={timePayload} title={event.title} />
}
```

**Client Component** -- receives the transfer, renders without hydration issues:

```tsx
'use client'
import { fromTransfer, whenny } from 'whenny'
import type { TransferPayload } from 'whenny'

function EventDetails({ time, title }: { time: TransferPayload; title: string }) {
  const { date, originZone } = fromTransfer(time)

  return (
    <div>
      <h1>{title}</h1>
      <p>{whenny(date).inZone(originZone).clock}</p>
      <p>{whenny(date).inZone(originZone).md}</p>
    </div>
  )
}
```

No `useEffect`. No `suppressHydrationWarning`. No layout shift. The transfer payload is a plain object that passes through the Server Component boundary cleanly.

## SSR-Safe React Hooks

For cases where you do need live-updating dates -- relative timestamps, countdowns -- the React package ships hooks that handle the `isMounted` pattern internally:

```tsx
'use client'
import { useRelativeTime, useCountdown } from 'whenny-react'

function CommentTimestamp({ createdAt }: { createdAt: string }) {
  const timeAgo = useRelativeTime(createdAt, {
    updateInterval: 30000,
    placeholder: ''  // renders empty during SSR, no mismatch
  })

  return <span>{timeAgo}</span>
}

function SalesBanner({ endsAt }: { endsAt: string }) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(endsAt)

  if (isExpired) return null

  return <p>{days}d {hours}h {minutes}m {seconds}s remaining</p>
}
```

Both hooks return stable empty/zero values during SSR, then hydrate with real data on the client. No flicker, no warnings.

## When You Need It

The transfer protocol is not for every date in your app. Use it when:

- A date crosses a server/client boundary and the original timezone matters
- You are storing events that happened in a specific location
- You need to display "3:00 PM ET" instead of converting to the viewer's local time
- You are building scheduling UI where "3pm in New York" and "3pm in London" are different things

For purely local dates (user's own calendar, relative timestamps), the standard `whenny()` API and the React hooks handle everything without the transfer layer.

## The Shape of the Fix

The transfer payload is intentionally minimal:

```typescript
interface TransferPayload {
  iso: string       // UTC instant -- the source of truth
  originZone: string  // IANA timezone name
  originOffset: number  // UTC offset in minutes at that instant
}
```

Three fields. No custom serialization. No binary format. Drop it into any JSON API, any database JSONB column, any message queue. The `originOffset` is there so you can do offset math without a timezone database lookup -- useful on edge runtimes where `Intl` support varies.

---

This is part of [Whenny](https://github.com/ZVN-DEV/whenny), a zero-dependency TypeScript date library with shadcn-style installation (`npx create-whenny`). You install only the modules you use -- `core`, `transfer`, `timezone`, `relative` -- and they copy into your project as source code you own.

Docs: [whenny.dev](https://whenny.dev) | GitHub: [github.com/ZVN-DEV/whenny](https://github.com/ZVN-DEV/whenny)
