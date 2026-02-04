# whenny-react

React hooks and utilities for the Whenny date library.

## Installation

```bash
npm install whenny whenny-react
```

## Hooks

### useRelativeTime

Auto-updating relative time display.

```tsx
import { useRelativeTime } from 'whenny-react'

function Comment({ createdAt }) {
  // Updates automatically every minute by default
  const timeAgo = useRelativeTime(createdAt)

  return <span>{timeAgo}</span>
}

// With custom update interval (ms)
const timeAgo = useRelativeTime(date, { updateInterval: 30000 })
```

### useCountdown

Live countdown timer to a target date.

```tsx
import { useCountdown } from 'whenny-react'

function EventCountdown({ eventDate }) {
  const { days, hours, minutes, seconds, formatted, isComplete } = useCountdown(eventDate)

  if (isComplete) return <span>Event started!</span>

  return (
    <div>
      <span>{days}d {hours}h {minutes}m {seconds}s</span>
      <span>{formatted}</span>
    </div>
  )
}
```

### useDateFormatter

Memoized date formatting hook.

```tsx
import { useDateFormatter } from 'whenny-react'

function EventCard({ date }) {
  const formatter = useDateFormatter()

  return (
    <div>
      <p>{formatter.smart(date)}</p>
      <p>{formatter.format(date, '{weekday}, {monthFull} {day}')}</p>
    </div>
  )
}
```

### useTimezone

Timezone context provider and hook.

```tsx
import { TimezoneProvider, useTimezone } from 'whenny-react'

// Wrap your app
function App() {
  return (
    <TimezoneProvider defaultTimezone="America/New_York">
      <MyApp />
    </TimezoneProvider>
  )
}

// Use in components
function EventTime({ date }) {
  const { timezone, setTimezone, format } = useTimezone()

  return (
    <div>
      <p>Current timezone: {timezone}</p>
      <p>{format(date)}</p>
      <button onClick={() => setTimezone('Europe/London')}>
        Switch to London
      </button>
    </div>
  )
}
```

### useShadcnCalendar

Integration helpers for shadcn/ui Calendar component (react-day-picker).

```tsx
import { useShadcnCalendar } from 'whenny-react'
import { Calendar } from '@/components/ui/calendar'

function DatePicker() {
  const {
    selected,
    setSelected,
    formatSelected,
    modifiers,
    modifiersStyles,
    isDateDisabled,
  } = useShadcnCalendar({
    disableWeekends: true,
    disablePast: true,
    minDate: new Date(),
    maxDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  })

  return (
    <div>
      <p>Selected: {formatSelected()}</p>
      <Calendar
        mode="single"
        selected={selected}
        onSelect={setSelected}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        disabled={isDateDisabled}
      />
    </div>
  )
}
```

## Features

- **Auto-updating** - Times update automatically without manual refresh
- **SSR Safe** - All hooks handle server-side rendering properly
- **Configurable** - Works with your Whenny configuration
- **TypeScript** - Full type definitions included
- **Lightweight** - Minimal bundle size, tree-shakeable

## Requirements

- React 18+
- whenny (peer dependency)

## License

MIT
