/**
 * Whenny Documentation Generator
 *
 * Generates Whenny-Dates-Agents.md based on installed modules.
 * Updates automatically when modules are added.
 */

import fs from 'fs-extra'
import path from 'path'

interface ModuleDoc {
  name: string
  title: string
  description: string
  examples: string
  configSection?: string
}

const MODULE_DOCS: Record<string, ModuleDoc> = {
  core: {
    name: 'core',
    title: 'Core',
    description: 'The foundation of Whenny - provides the main `whenny()` function and core utilities.',
    examples: `\`\`\`ts
import { whenny } from '@/lib/whenny'

// Create from various inputs
const d1 = whenny(new Date())        // from Date
const d2 = whenny('2024-01-15')      // from ISO string
const d3 = whenny(1705276800000)     // from timestamp
const d4 = whenny.now()              // current time

// Format dates
d1.short()                           // "Jan 15"
d1.long()                            // "January 15, 2024"
d1.time()                            // "12:00 AM"
d1.iso()                             // ISO 8601 string
d1.format('{weekday}, {monthFull} {day}')  // "Monday, January 15"

// Date math
d1.add(7, 'days')                    // Returns new Whenny instance
d1.subtract(1, 'month')

// Access components
d1.year   // 2024
d1.month  // 1
d1.day    // 15
\`\`\``,
    configSection: `### Core Configuration

\`\`\`ts
// whenny.config.ts
{
  locale: 'en-US',           // Default locale for formatting
  defaultTimezone: 'UTC',    // Default timezone
  formats: {
    presets: {
      short: '{monthShort} {day}',
      long: '{monthFull} {day}, {year}',
      time: '{hour}:{minute} {AMPM}',
    },
    hour12: true,            // Use 12-hour format
  },
}
\`\`\``,
  },

  relative: {
    name: 'relative',
    title: 'Relative Time',
    description: 'Format dates as human-readable relative time strings like "5 minutes ago" or "in 2 hours".',
    examples: `\`\`\`ts
import { relative, fromNow } from '@/lib/whenny'

// Relative to now
relative(Date.now() - 60000)           // "1 minute ago"
relative(Date.now() - 3600000)         // "1 hour ago"
relative(Date.now() - 86400000)        // "yesterday"
relative(Date.now() + 86400000)        // "tomorrow"
relative(Date.now() + 3600000)         // "in 1 hour"

// fromNow() is a convenient alias
fromNow('2024-01-15')                  // "3 months ago"

// Relative to a specific date
relative('2024-01-20', { from: '2024-01-15' })  // "in 5 days"
\`\`\``,
    configSection: `### Relative Time Configuration

\`\`\`ts
// whenny.config.ts
{
  relative: {
    justNow: 'just now',
    // Customize any of these:
    secondsAgo: (n) => \`\${n} seconds ago\`,
    minutesAgo: (n) => \`\${n}m ago\`,      // Compact style
    hoursAgo: (n) => \`\${n}h ago\`,
    yesterday: 'yesterday',
    tomorrow: 'tomorrow',
    thresholds: {
      justNow: 30,    // Seconds before showing "just now"
      seconds: 60,    // Seconds before switching to minutes
      minutes: 3600,  // Seconds before switching to hours
      // ... etc
    },
  },
}
\`\`\``,
  },

  smart: {
    name: 'smart',
    title: 'Smart Formatting',
    description: 'Context-aware formatting that automatically picks the best representation based on how far away the date is.',
    examples: `\`\`\`ts
import { smart } from '@/lib/whenny'

// Within a minute → "just now"
smart(Date.now() - 30000)

// Within an hour → relative time
smart(Date.now() - 300000)             // "5 minutes ago"

// Today → time only
smart(todayAt9am)                       // "9:00 AM"

// Yesterday → labeled
smart(yesterdayAt3pm)                   // "Yesterday at 3:00 PM"

// This week → weekday
smart(lastTuesday)                      // "Tuesday at 2:30 PM"

// This year → month/day
smart('2024-03-15')                     // "Mar 15"

// Older → full date
smart('2023-06-20')                     // "Jun 20, 2023"

// With timezone context
smart(date, { for: 'America/New_York' })
\`\`\``,
    configSection: `### Smart Formatting Configuration

\`\`\`ts
// whenny.config.ts
{
  smart: {
    buckets: [
      { within: 'minute', show: 'just now' },
      { within: 'hour', show: 'relative' },      // Uses relative module
      { within: 'today', show: '{time}' },
      { within: 'yesterday', show: 'Yesterday at {time}' },
      { within: 'week', show: '{weekday} at {time}' },
      { within: 'year', show: '{monthShort} {day}' },
      { older: true, show: '{monthShort} {day}, {year}' },
    ],
  },
}
\`\`\``,
  },

  compare: {
    name: 'compare',
    title: 'Compare & Distance',
    description: 'Compare two dates and get human-readable descriptions or numeric differences.',
    examples: `\`\`\`ts
import { compare, distance } from '@/lib/whenny'

const meeting = '2024-01-20T14:00:00'
const deadline = '2024-01-15T09:00:00'

// Human-readable comparison
compare(meeting, deadline).smart()      // "5 days after"
compare(deadline, meeting).smart()      // "5 days before"

// Numeric differences
compare(meeting, deadline).days()       // 5
compare(meeting, deadline).hours()      // 125
compare(meeting, deadline).minutes()    // 7500

// Boolean checks
compare(meeting, deadline).isAfter()    // true
compare(meeting, deadline).isBefore()   // false
compare(meeting, deadline).isSame('day') // false

// Distance (always positive)
distance(meeting, deadline).human()     // "5 days"
distance(meeting, deadline).exact()     // "5 days, 5 hours"
distance(meeting, deadline).totalSeconds // 450000
\`\`\``,
  },

  duration: {
    name: 'duration',
    title: 'Duration',
    description: 'Format time durations in various styles - perfect for timers, countdowns, and time tracking.',
    examples: `\`\`\`ts
import { duration, durationBetween, until, since } from '@/lib/whenny'

// Format seconds as duration
duration(3661).long()                   // "1 hour, 1 minute, 1 second"
duration(3661).compact()                // "1h 1m 1s"
duration(3661).clock()                  // "1:01:01"
duration(3661).human()                  // "about 1 hour"

// Short durations
duration(125).clock()                   // "2:05"

// Access components
const d = duration(3661)
d.hours          // 1
d.minutes        // 1
d.seconds        // 1
d.totalSeconds   // 3661

// Duration between dates
durationBetween('2024-01-15', '2024-01-16').long()

// Countdown helpers
until('2024-12-31').human()             // "about 11 months"
since('2024-01-01').compact()           // "45d 2h 30m"
\`\`\``,
    configSection: `### Duration Configuration

\`\`\`ts
// whenny.config.ts
{
  duration: {
    long: {
      hours: (n) => \`\${n} hour\${n === 1 ? '' : 's'}\`,
      minutes: (n) => \`\${n} minute\${n === 1 ? '' : 's'}\`,
      seconds: (n) => \`\${n} second\${n === 1 ? '' : 's'}\`,
      separator: ', ',
    },
    compact: {
      hours: (n) => \`\${n}h\`,
      minutes: (n) => \`\${n}m\`,
      seconds: (n) => \`\${n}s\`,
      separator: ' ',
    },
    defaultStyle: 'long',
  },
}
\`\`\``,
  },

  timezone: {
    name: 'timezone',
    title: 'Timezone',
    description: 'Timezone utilities for working with dates across different time zones.',
    examples: `\`\`\`ts
import { local, offset, dayBounds, isTodayIn, tz } from '@/lib/whenny'

// Get user's local timezone
local()                                 // "America/New_York"

// Get UTC offset in minutes
offset('America/New_York')              // -300 (EST) or -240 (EDT)
offset('Europe/London')                 // 0 or 60 (DST)
offset('Asia/Tokyo')                    // 540

// Get day boundaries in a timezone
const bounds = dayBounds({ for: 'America/Los_Angeles' })
bounds.start  // Start of day in LA (as UTC Date)
bounds.end    // End of day in LA (as UTC Date)

// With specific date
dayBounds({ date: '2024-01-15', for: 'Europe/Paris' })

// Check if a UTC date is "today" in a timezone
isTodayIn(new Date(), 'Asia/Tokyo')     // true/false

// Namespace shortcuts
tz.local()
tz.offset('UTC')
tz.dayBounds({ for: 'America/Chicago' })
\`\`\``,
  },

  calendar: {
    name: 'calendar',
    title: 'Calendar',
    description: 'Calendar helpers for checking date properties and performing calendar operations.',
    examples: `\`\`\`ts
import {
  isToday, isYesterday, isTomorrow, isThisWeek, isThisMonth, isThisYear,
  isWeekend, isWeekday, isBusinessDay, isPast, isFuture, isBetween,
  startOf, endOf, add, subtract, daysUntil, daysSince, calendar
} from '@/lib/whenny'

// Date checks
isToday(new Date())                     // true
isYesterday(Date.now() - 86400000)      // true
isTomorrow(Date.now() + 86400000)       // true
isThisWeek('2024-01-15')
isThisMonth('2024-01-15')

// Weekend/weekday checks
isWeekend('2024-01-13')                 // true (Saturday)
isWeekday('2024-01-15')                 // true (Monday)
isBusinessDay('2024-01-15')             // true (configurable)

// Past/future checks
isPast('2020-01-01')                    // true
isFuture('2030-01-01')                  // true
isBetween('2024-06-15', '2024-01-01', '2024-12-31')

// Get boundaries
startOf('2024-01-15', 'day')            // 2024-01-15 00:00:00
startOf('2024-01-15', 'week')           // Start of week
startOf('2024-01-15', 'month')          // 2024-01-01
endOf('2024-01-15', 'day')              // 2024-01-15 23:59:59.999

// Date math
add('2024-01-15', 7, 'days')            // 2024-01-22
subtract('2024-01-15', 1, 'month')      // 2023-12-15

// Countdown helpers
daysUntil('2024-12-31')                 // days until New Year
daysSince('2024-01-01')                 // days since New Year
\`\`\``,
    configSection: `### Calendar Configuration

\`\`\`ts
// whenny.config.ts
{
  calendar: {
    weekStartsOn: 'sunday',  // or 'monday'
    businessDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  },
}
\`\`\``,
  },

  transfer: {
    name: 'transfer',
    title: 'Transfer Protocol',
    description: 'Handle date serialization with timezone context - perfect for server/client synchronization.',
    examples: `\`\`\`ts
import { createTransfer, fromTransfer, localTransfer, utcTransfer } from '@/lib/whenny'

// === SERVER SIDE ===
// Create a transfer payload to send to client
const payload = createTransfer(new Date(), { timezone: 'America/New_York' })
// { iso: "2024-01-15T20:00:00.000Z", originZone: "America/New_York", originOffset: -300 }

// Quick helpers
const local = localTransfer(new Date())   // Uses browser's timezone
const utc = utcTransfer(new Date())       // Uses UTC

// === CLIENT SIDE ===
// Receive and work with transferred date
const received = fromTransfer(payload)

received.date                             // UTC Date object
received.originZone                       // "America/New_York"
received.originOffset                     // -300

received.utc()                            // Date in UTC
received.inOrigin()                       // Date adjusted to origin TZ
received.startOfDayInOrigin()             // Start of day in origin TZ
received.endOfDayInOrigin()               // End of day in origin TZ
received.dayBoundsInOrigin()              // { start, end }
received.toISO()                          // ISO string
received.transfer()                       // Payload for re-sending
\`\`\``,
  },

  natural: {
    name: 'natural',
    title: 'Natural Language',
    description: 'Parse human-friendly date expressions like "tomorrow at 3pm" or "next friday".',
    examples: `\`\`\`ts
import { parse, canParse, natural } from '@/lib/whenny'

// Basic expressions
parse('now')                              // Current date/time
parse('today')                            // Start of today
parse('tomorrow')                         // Start of tomorrow
parse('yesterday')                        // Start of yesterday

// Relative expressions
parse('in 5 minutes')                     // 5 minutes from now
parse('in 2 hours')                       // 2 hours from now
parse('in 3 days')                        // 3 days from now
parse('5 minutes ago')                    // 5 minutes ago
parse('2 days ago')                       // 2 days ago

// Named days
parse('next friday')                      // Next Friday
parse('next monday')                      // Next Monday
parse('next week')                        // Start of next week
parse('next month')                       // Start of next month

// Time of day
parse('tomorrow at 3pm')                  // Tomorrow at 3:00 PM
parse('tomorrow at 3:30pm')               // Tomorrow at 3:30 PM
parse('next friday at 9am')               // Next Friday at 9:00 AM
parse('tomorrow morning')                 // Tomorrow at 9:00 AM
parse('tomorrow afternoon')               // Tomorrow at 2:00 PM
parse('tomorrow evening')                 // Tomorrow at 6:00 PM

// End of period
parse('end of month')                     // Last day of month
parse('end of year')                      // December 31st

// Check if parseable
canParse('tomorrow at 3pm')               // true
canParse('gibberish')                     // false

// With custom reference date
parse('tomorrow', { from: new Date('2024-01-15') })
\`\`\``,
    configSection: `### Natural Language Configuration

\`\`\`ts
// whenny.config.ts
{
  natural: {
    morning: 9,      // "morning" = 9:00 AM
    afternoon: 14,   // "afternoon" = 2:00 PM
    evening: 18,     // "evening" = 6:00 PM
    night: 21,       // "night" = 9:00 PM
  },
}
\`\`\``,
  },

  react: {
    name: 'react',
    title: 'React Hooks',
    description: 'React integration with auto-updating hooks for relative time and countdowns.',
    examples: `\`\`\`tsx
import { useRelativeTime, useCountdown, useDateFormatter } from '@/lib/whenny'

// === Auto-updating Relative Time ===
function Comment({ createdAt }: { createdAt: Date }) {
  // Updates every 60 seconds by default
  const timeAgo = useRelativeTime(createdAt)
  return <span>{timeAgo}</span>  // "5 minutes ago"
}

// With custom interval
const timeAgo = useRelativeTime(date, { updateInterval: 10000 })

// Use smart formatting instead
const smartTime = useRelativeTime(date, { smart: true })

// === Countdown Timer ===
function LaunchCountdown({ launchDate }: { launchDate: Date }) {
  const countdown = useCountdown(launchDate)

  if (countdown.isExpired) {
    return <span>Launched!</span>
  }

  return (
    <div>
      <span>{countdown.formatted}</span>  {/* "2d 5h 30m 15s" */}
      {/* Or individual values */}
      <span>
        {countdown.days}d {countdown.hours}h
        {countdown.minutes}m {countdown.seconds}s
      </span>
    </div>
  )
}

// === Memoized Formatter ===
function DateList({ dates }: { dates: Date[] }) {
  const fmt = useDateFormatter()
  return (
    <ul>
      {dates.map((d, i) => (
        <li key={i}>{fmt(d).smart()}</li>
      ))}
    </ul>
  )
}
\`\`\``,
  },

  constants: {
    name: 'constants',
    title: 'Constants',
    description: 'Useful constants including all IANA timezones, format patterns, and time unit conversions.',
    examples: `\`\`\`ts
import {
  TIMEZONES, TIMEZONE_REGIONS, COMMON_TIMEZONES, TIMEZONE_ABBREVIATIONS,
  FORMAT_PATTERNS, DURATION_MS, DURATION_SEC, TIME_UNITS,
  WEEKDAYS, MONTHS, isLeapYear, getDaysInMonth
} from '@/lib/whenny'

// === All 400+ IANA Timezones ===
TIMEZONES.length                        // 400+
TIMEZONES.includes('America/New_York')  // true

// === Timezones by Region ===
TIMEZONE_REGIONS.America                // ['America/New_York', ...]
TIMEZONE_REGIONS.Europe                 // ['Europe/London', ...]
TIMEZONE_REGIONS.Asia                   // ['Asia/Tokyo', ...]

// === Common Timezones by Country ===
COMMON_TIMEZONES.US    // US timezones (ET, CT, MT, PT, AK, HI)
COMMON_TIMEZONES.EU    // European timezones
COMMON_TIMEZONES.Asia  // Major Asian timezones

// === Timezone Abbreviations ===
TIMEZONE_ABBREVIATIONS.EST   // 'America/New_York'
TIMEZONE_ABBREVIATIONS.PST   // 'America/Los_Angeles'
TIMEZONE_ABBREVIATIONS.JST   // 'Asia/Tokyo'
TIMEZONE_ABBREVIATIONS.GMT   // 'Europe/London'

// === Format Patterns ===
FORMAT_PATTERNS.ISO_8601        // '{year}-{month}-{day}T{hour24}:{minute}:{second}Z'
FORMAT_PATTERNS.US_DATE         // '{month}/{day}/{year}'
FORMAT_PATTERNS.EU_DATE         // '{day}/{month}/{year}'
FORMAT_PATTERNS.FRIENDLY_DATE   // '{weekday}, {monthFull} {day}'
FORMAT_PATTERNS.LOG             // '{year}-{month}-{day} {hour24}:{minute}:{second}'

// === Duration Constants ===
DURATION_MS.SECOND              // 1000
DURATION_MS.MINUTE              // 60000
DURATION_MS.HOUR                // 3600000
DURATION_MS.DAY                 // 86400000

DURATION_SEC.MINUTE             // 60
DURATION_SEC.HOUR               // 3600
DURATION_SEC.DAY                // 86400

// === Weekdays & Months ===
WEEKDAYS.NAMES                  // ['Sunday', 'Monday', ...]
WEEKDAYS.NAMES_SHORT            // ['Sun', 'Mon', ...]
MONTHS.NAMES                    // ['January', 'February', ...]
MONTHS.DAYS                     // [31, 28, 31, ...] (days per month)

// === Leap Year Helpers ===
isLeapYear(2024)                // true
isLeapYear(2023)                // false
getDaysInMonth(2024, 2)         // 29 (February in leap year)
getDaysInMonth(2023, 2)         // 28
\`\`\``,
  },
}

/**
 * Generate the Whenny-Dates-Agents.md documentation file
 */
export function generateDocsContent(modules: string[]): string {
  const now = new Date()
  const timestamp = now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC'

  let content = `# Whenny Date Modules Reference

> Auto-generated documentation for your installed Whenny modules.
> Last updated: ${timestamp}

## Quick Start

\`\`\`ts
import { whenny } from '@/lib/whenny'

// The main whenny function
whenny('2024-01-15').smart()     // Context-aware formatting
whenny('2024-01-15').relative()  // "3 months ago"
whenny.now().short()             // "Jan 15"
\`\`\`

## Installed Modules

`

  // Add list of installed modules
  const installedModules = modules.filter(m => MODULE_DOCS[m])
  content += installedModules.map(m => `- **${MODULE_DOCS[m].title}** - ${MODULE_DOCS[m].description}`).join('\n')
  content += '\n\n---\n\n'

  // Add detailed documentation for each module
  for (const moduleName of installedModules) {
    const doc = MODULE_DOCS[moduleName]
    if (!doc) continue

    content += `## ${doc.title}\n\n`
    content += `${doc.description}\n\n`
    content += `### Examples\n\n`
    content += `${doc.examples}\n\n`

    if (doc.configSection) {
      content += `${doc.configSection}\n\n`
    }

    content += `---\n\n`
  }

  // Add MCP section if any modules are installed
  content += `## AI Assistant Integration (MCP)

Whenny exposes tools to AI assistants via the Model Context Protocol.

### Setup for Claude Desktop

Add to your Claude Desktop config (\`claude_desktop_config.json\`):

\`\`\`json
{
  "mcpServers": {
    "whenny": {
      "command": "npx",
      "args": ["create-whenny", "mcp"]
    }
  }
}
\`\`\`

### Available MCP Tools

| Tool | Description |
|------|-------------|
| \`whenny\` | Create a date instance |
| \`format_datewind\` | Format with size-based styles (xs, sm, md, lg, xl) |
| \`format_smart\` | Context-aware smart formatting |
| \`format_relative\` | Relative time formatting |
| \`format_duration\` | Duration formatting |
| \`compare_dates\` | Compare two dates |
| \`calendar_check\` | Check calendar properties |
| \`add_business_days\` | Add/subtract business days |
| \`parse_natural\` | Parse natural language dates |
| \`create_transfer\` | Create transfer payload |

---

## Configuration

All modules can be customized via \`whenny.config.ts\` in your project root.

See module-specific configuration sections above for details.

---

*Generated by [Whenny](https://whenny.dev) - Date utilities for the AI era*
`

  return content
}

/**
 * Write the documentation file
 */
export async function writeDocsFile(targetPath: string, modules: string[]): Promise<void> {
  const content = generateDocsContent(modules)
  const docsPath = path.join(path.dirname(targetPath), 'Whenny-Dates-Agents.md')
  await fs.writeFile(docsPath, content)
}

/**
 * Get currently installed modules from index.ts
 */
export async function getInstalledModules(whennyPath: string): Promise<string[]> {
  const indexPath = path.join(whennyPath, 'index.ts')

  if (!await fs.pathExists(indexPath)) {
    return ['core']
  }

  const content = await fs.readFile(indexPath, 'utf-8')
  const exportMatches = content.match(/export \* from '\.\/(\w+)\.js'/g)

  if (!exportMatches) {
    return ['core']
  }

  return exportMatches.map(e => {
    const match = e.match(/from '\.\/(\w+)\.js'/)
    return match ? match[1] : ''
  }).filter(Boolean)
}
