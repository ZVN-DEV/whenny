/**
 * Whenny Templates
 *
 * Module templates that are copied to user projects.
 */

export interface ModuleInfo {
  name: string
  description: string
  dependencies?: string[]
}

export const MODULES: ModuleInfo[] = [
  {
    name: 'core',
    description: 'Core date primitives and the whenny function',
  },
  {
    name: 'relative',
    description: 'Relative time formatting ("5 minutes ago")',
    dependencies: ['core'],
  },
  {
    name: 'smart',
    description: 'Context-aware smart formatting',
    dependencies: ['core', 'relative'],
  },
  {
    name: 'compare',
    description: 'Date comparison and distance calculations',
    dependencies: ['core'],
  },
  {
    name: 'duration',
    description: 'Duration formatting ("2h 30m")',
    dependencies: ['core'],
  },
  {
    name: 'timezone',
    description: 'Timezone utilities and conversions',
    dependencies: ['core'],
  },
  {
    name: 'calendar',
    description: 'Calendar helpers (isToday, isWeekend, etc.)',
    dependencies: ['core'],
  },
  {
    name: 'transfer',
    description: 'Server/browser transfer protocol',
    dependencies: ['core', 'timezone'],
  },
  {
    name: 'natural',
    description: 'Natural language date parsing',
    dependencies: ['core'],
  },
  {
    name: 'react',
    description: 'React hooks (useRelativeTime, useCountdown)',
    dependencies: ['core', 'relative'],
  },
  {
    name: 'constants',
    description: 'Timezone list, format patterns, and useful constants',
    dependencies: ['core'],
  },
]

export function getModuleTemplate(name: string): string | null {
  switch (name) {
    case 'core':
      return CORE_TEMPLATE
    case 'relative':
      return RELATIVE_TEMPLATE
    case 'smart':
      return SMART_TEMPLATE
    case 'compare':
      return COMPARE_TEMPLATE
    case 'duration':
      return DURATION_TEMPLATE
    case 'timezone':
      return TIMEZONE_TEMPLATE
    case 'calendar':
      return CALENDAR_TEMPLATE
    case 'transfer':
      return TRANSFER_TEMPLATE
    case 'natural':
      return NATURAL_TEMPLATE
    case 'react':
      return REACT_TEMPLATE
    case 'constants':
      return CONSTANTS_TEMPLATE
    default:
      return null
  }
}

export function getConfigTemplate(): string {
  return CONFIG_TEMPLATE
}

// ============================================================================
// CONFIG TEMPLATE
// ============================================================================

const CONFIG_TEMPLATE = `/**
 * Whenny Configuration
 *
 * Customize date formatting for your application.
 * @see https://whenny.dev/docs/config
 */

import type { WhennyConfig } from './src/lib/whenny/core.js'

const config: Partial<WhennyConfig> = {
  // ─────────────────────────────────────────────────────────
  // LOCALE & DEFAULTS
  // ─────────────────────────────────────────────────────────

  locale: 'en-US',
  defaultTimezone: 'UTC',

  // ─────────────────────────────────────────────────────────
  // RELATIVE TIME
  // Customize how relative times are displayed
  // ─────────────────────────────────────────────────────────

  relative: {
    justNow: 'just now',
    // Uncomment to customize:
    // secondsAgo: (n) => \`\${n} seconds ago\`,
    // minutesAgo: (n) => \`\${n}m ago\`,
    // hoursAgo: (n) => \`\${n}h ago\`,
    // yesterday: 'yesterday',
    // tomorrow: 'tomorrow',
  },

  // ─────────────────────────────────────────────────────────
  // SMART FORMATTING
  // Context-aware formatting buckets
  // ─────────────────────────────────────────────────────────

  smart: {
    buckets: [
      { within: 'minute', show: 'just now' },
      { within: 'hour', show: 'relative' },
      { within: 'today', show: '{time}' },
      { within: 'yesterday', show: 'Yesterday at {time}' },
      { within: 'week', show: '{weekday} at {time}' },
      { within: 'year', show: '{monthShort} {day}' },
      { older: true, show: '{monthShort} {day}, {year}' },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // FORMAT PRESETS
  // ─────────────────────────────────────────────────────────

  formats: {
    presets: {
      short: '{monthShort} {day}',
      long: '{monthFull} {day}, {year}',
      time: '{hour}:{minute} {AMPM}',
    },
    hour12: true,
  },

  // ─────────────────────────────────────────────────────────
  // CALENDAR
  // ─────────────────────────────────────────────────────────

  calendar: {
    weekStartsOn: 'sunday',
    businessDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  },
}

export default config
`

// ============================================================================
// CORE TEMPLATE
// ============================================================================

const CORE_TEMPLATE = `/**
 * Whenny Core
 *
 * Core date primitives and the main whenny function.
 * This file is the foundation - modify freely to customize behavior.
 *
 * @example Basic Usage
 * \`\`\`ts
 * import { whenny } from './core'
 *
 * // Create from various inputs
 * whenny(new Date())           // from Date object
 * whenny('2024-01-15')         // from ISO string
 * whenny(1705276800000)        // from timestamp
 * whenny.now()                 // current time
 *
 * // Format dates
 * whenny('2024-01-15').short()     // "Jan 15"
 * whenny('2024-01-15').long()      // "January 15, 2024"
 * whenny('2024-01-15').time()      // "12:00 AM"
 * whenny('2024-01-15').iso()       // "2024-01-15T00:00:00.000Z"
 *
 * // Custom formatting
 * whenny('2024-01-15').format('{weekday}, {monthFull} {day}')  // "Monday, January 15"
 *
 * // Date math
 * whenny('2024-01-15').add(7, 'days')       // Jan 22
 * whenny('2024-01-15').subtract(1, 'month') // Dec 15
 *
 * // Access components
 * const d = whenny('2024-01-15')
 * d.year   // 2024
 * d.month  // 1
 * d.day    // 15
 * \`\`\`
 */

// ============================================================================
// TYPES
// ============================================================================

export type DateInput = Date | string | number

export type Timezone = string

export type TimeUnit =
  | 'millisecond' | 'milliseconds'
  | 'second' | 'seconds'
  | 'minute' | 'minutes'
  | 'hour' | 'hours'
  | 'day' | 'days'
  | 'week' | 'weeks'
  | 'month' | 'months'
  | 'year' | 'years'

export interface WhennyConfig {
  locale: string
  defaultTimezone: Timezone
  relative: {
    justNow: string
    secondsAgo: (n: number) => string
    minutesAgo: (n: number) => string
    hoursAgo: (n: number) => string
    yesterday: string
    daysAgo: (n: number) => string
    weeksAgo: (n: number) => string
    monthsAgo: (n: number) => string
    yearsAgo: (n: number) => string
    inSeconds: (n: number) => string
    inMinutes: (n: number) => string
    inHours: (n: number) => string
    tomorrow: string
    inDays: (n: number) => string
    inWeeks: (n: number) => string
    inMonths: (n: number) => string
    inYears: (n: number) => string
    thresholds: {
      justNow: number
      seconds: number
      minutes: number
      hours: number
      days: number
      weeks: number
      months: number
    }
  }
  smart: {
    buckets: Array<{
      within?: 'minute' | 'hour' | 'today' | 'yesterday' | 'week' | 'month' | 'year'
      older?: boolean
      show: string
    }>
    futureBuckets?: Array<{
      within?: 'minute' | 'hour' | 'today' | 'yesterday' | 'week' | 'month' | 'year'
      older?: boolean
      show: string
    }>
  }
  compare: {
    before: string
    after: string
    apart: string
    simultaneous: string
  }
  duration: {
    long: {
      hours: (n: number) => string
      minutes: (n: number) => string
      seconds: (n: number) => string
      separator: string
    }
    compact: {
      hours: (n: number) => string
      minutes: (n: number) => string
      seconds: (n: number) => string
      separator: string
    }
    defaultStyle: 'long' | 'compact'
  }
  formats: {
    presets: {
      short: string
      long: string
      iso: string
      time: string
      datetime: string
      [key: string]: string
    }
    hour12: boolean
  }
  calendar: {
    weekStartsOn: 'sunday' | 'monday'
    businessDays: string[]
  }
  natural: {
    morning: number
    afternoon: number
    evening: number
    night: number
  }
  server: {
    requireTimezone: boolean
    fallbackFormat: 'iso' | 'utc' | 'long'
    warnOnMissingTimezone: boolean
  }
  personality: {
    enabled: boolean
    messages: Record<string, string>
  }
}

// ============================================================================
// DEFAULT CONFIG
// ============================================================================

const defaultConfig: WhennyConfig = {
  locale: 'en-US',
  defaultTimezone: 'UTC',
  relative: {
    justNow: 'just now',
    secondsAgo: (n) => \`\${n} second\${n === 1 ? '' : 's'} ago\`,
    minutesAgo: (n) => \`\${n} minute\${n === 1 ? '' : 's'} ago\`,
    hoursAgo: (n) => \`\${n} hour\${n === 1 ? '' : 's'} ago\`,
    yesterday: 'yesterday',
    daysAgo: (n) => \`\${n} day\${n === 1 ? '' : 's'} ago\`,
    weeksAgo: (n) => \`\${n} week\${n === 1 ? '' : 's'} ago\`,
    monthsAgo: (n) => \`\${n} month\${n === 1 ? '' : 's'} ago\`,
    yearsAgo: (n) => \`\${n} year\${n === 1 ? '' : 's'} ago\`,
    inSeconds: (n) => \`in \${n} second\${n === 1 ? '' : 's'}\`,
    inMinutes: (n) => \`in \${n} minute\${n === 1 ? '' : 's'}\`,
    inHours: (n) => \`in \${n} hour\${n === 1 ? '' : 's'}\`,
    tomorrow: 'tomorrow',
    inDays: (n) => \`in \${n} day\${n === 1 ? '' : 's'}\`,
    inWeeks: (n) => \`in \${n} week\${n === 1 ? '' : 's'}\`,
    inMonths: (n) => \`in \${n} month\${n === 1 ? '' : 's'}\`,
    inYears: (n) => \`in \${n} year\${n === 1 ? '' : 's'}\`,
    thresholds: {
      justNow: 30,
      seconds: 60,
      minutes: 3600,
      hours: 86400,
      days: 604800,
      weeks: 2592000,
      months: 31536000,
    },
  },
  smart: {
    buckets: [
      { within: 'minute', show: 'just now' },
      { within: 'hour', show: 'relative' },
      { within: 'today', show: '{time}' },
      { within: 'yesterday', show: 'Yesterday at {time}' },
      { within: 'week', show: '{weekday} at {time}' },
      { within: 'year', show: '{monthShort} {day}' },
      { older: true, show: '{monthShort} {day}, {year}' },
    ],
  },
  compare: {
    before: '{time} before',
    after: '{time} after',
    apart: '{time} apart',
    simultaneous: 'at the same time',
  },
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
  formats: {
    presets: {
      short: '{monthShort} {day}',
      long: '{monthFull} {day}, {year}',
      iso: '{year}-{month}-{day}T{hour24}:{minute}:{second}Z',
      time: '{hour}:{minute} {AMPM}',
      datetime: '{monthShort} {day}, {hour}:{minute} {AMPM}',
    },
    hour12: true,
  },
  calendar: {
    weekStartsOn: 'sunday',
    businessDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  },
  natural: {
    morning: 9,
    afternoon: 14,
    evening: 18,
    night: 21,
  },
  server: {
    requireTimezone: true,
    fallbackFormat: 'iso',
    warnOnMissingTimezone: true,
  },
  personality: {
    enabled: false,
    messages: {},
  },
}

// Try to load user config
let userConfig: Partial<WhennyConfig> = {}
try {
  // @ts-ignore - Dynamic import of user config
  const imported = await import('../../../whenny.config.js')
  userConfig = imported.default || {}
} catch {
  // No user config, use defaults
}

// Merge configs
function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target }
  for (const key in source) {
    const sourceVal = source[key]
    const targetVal = target[key]
    if (sourceVal && typeof sourceVal === 'object' && !Array.isArray(sourceVal) &&
        targetVal && typeof targetVal === 'object' && !Array.isArray(targetVal)) {
      result[key] = deepMerge(targetVal as Record<string, unknown>, sourceVal as Record<string, unknown>) as T[typeof key]
    } else if (sourceVal !== undefined) {
      result[key] = sourceVal as T[typeof key]
    }
  }
  return result
}

export const config: WhennyConfig = deepMerge(defaultConfig, userConfig)

// ============================================================================
// CONSTANTS
// ============================================================================

export const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const WEEKDAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// ============================================================================
// UTILITIES
// ============================================================================

export function parseDate(input: DateInput): Date {
  if (input instanceof Date) return new Date(input.getTime())
  if (typeof input === 'number') return new Date(input)
  if (typeof input === 'string') {
    const parsed = new Date(input.replace(' ', 'T'))
    if (!isNaN(parsed.getTime())) return parsed
    throw new Error(\`Invalid date string: \${input}\`)
  }
  throw new Error(\`Invalid date input: \${input}\`)
}

export function padZero(n: number, len = 2): string {
  return n.toString().padStart(len, '0')
}

export function getOrdinalSuffix(n: number): string {
  const j = n % 10, k = n % 100
  if (j === 1 && k !== 11) return 'st'
  if (j === 2 && k !== 12) return 'nd'
  if (j === 3 && k !== 13) return 'rd'
  return 'th'
}

export function formatOrdinal(n: number): string {
  return \`\${n}\${getOrdinalSuffix(n)}\`
}

export function addTime(date: Date, amount: number, unit: TimeUnit): Date {
  const result = new Date(date.getTime())
  const u = unit.replace(/s$/, '')
  switch (u) {
    case 'millisecond': result.setTime(result.getTime() + amount); break
    case 'second': result.setTime(result.getTime() + amount * 1000); break
    case 'minute': result.setTime(result.getTime() + amount * 60000); break
    case 'hour': result.setTime(result.getTime() + amount * 3600000); break
    case 'day': result.setDate(result.getDate() + amount); break
    case 'week': result.setDate(result.getDate() + amount * 7); break
    case 'month': result.setMonth(result.getMonth() + amount); break
    case 'year': result.setFullYear(result.getFullYear() + amount); break
  }
  return result
}

export function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

export function endOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

export function differenceInSeconds(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / 1000)
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

export function isYesterday(date: Date): boolean {
  return isSameDay(date, addTime(new Date(), -1, 'day'))
}

export function isTomorrow(date: Date): boolean {
  return isSameDay(date, addTime(new Date(), 1, 'day'))
}

export function getLocalTimezone(): Timezone {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

// ============================================================================
// FORMATTING
// ============================================================================

export function format(date: Date, template: string): string {
  const tokens: Record<string, string> = {
    year: date.getFullYear().toString(),
    yearShort: date.getFullYear().toString().slice(-2),
    month: padZero(date.getMonth() + 1),
    monthShort: MONTHS_SHORT[date.getMonth()],
    monthFull: MONTHS_FULL[date.getMonth()],
    day: padZero(date.getDate()),
    dayOrdinal: formatOrdinal(date.getDate()),
    weekday: WEEKDAYS_FULL[date.getDay()],
    weekdayShort: WEEKDAYS_SHORT[date.getDay()],
    hour: config.formats.hour12 ? (date.getHours() % 12 || 12).toString() : padZero(date.getHours()),
    hour24: padZero(date.getHours()),
    hour12: (date.getHours() % 12 || 12).toString(),
    minute: padZero(date.getMinutes()),
    second: padZero(date.getSeconds()),
    ampm: date.getHours() < 12 ? 'am' : 'pm',
    AMPM: date.getHours() < 12 ? 'AM' : 'PM',
    time: config.formats.hour12
      ? \`\${date.getHours() % 12 || 12}:\${padZero(date.getMinutes())} \${date.getHours() < 12 ? 'AM' : 'PM'}\`
      : \`\${padZero(date.getHours())}:\${padZero(date.getMinutes())}\`,
  }
  return template.replace(/\\{(\\w+)\\}/g, (_, token) => tokens[token] ?? \`{\${token}}\`)
}

// ============================================================================
// MAIN WHENNY FUNCTION
// ============================================================================

export interface Whenny {
  toDate(): Date
  valueOf(): number
  toISO(): string
  format(template: string): string
  short(): string
  long(): string
  iso(): string
  time(): string
  datetime(): string
  relative(): string
  fromNow(): string
  smart(options?: { for?: Timezone }): string
  add(amount: number, unit: TimeUnit): Whenny
  subtract(amount: number, unit: TimeUnit): Whenny
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

class WhennyImpl implements Whenny {
  private _date: Date

  constructor(input: DateInput) {
    this._date = parseDate(input)
  }

  toDate() { return new Date(this._date) }
  valueOf() { return this._date.getTime() }
  toISO() { return this._date.toISOString() }

  format(template: string) { return format(this._date, template) }
  short() { return format(this._date, config.formats.presets.short) }
  long() { return format(this._date, config.formats.presets.long) }
  iso() { return this._date.toISOString() }
  time() { return format(this._date, config.formats.presets.time) }
  datetime() { return format(this._date, config.formats.presets.datetime) }

  relative() {
    const seconds = differenceInSeconds(this._date, new Date())
    const abs = Math.abs(seconds)
    const future = seconds > 0
    const t = config.relative.thresholds

    if (abs < t.justNow) return config.relative.justNow
    if (abs < t.seconds) return future ? config.relative.inSeconds(abs) : config.relative.secondsAgo(abs)
    if (abs < t.minutes) {
      const m = Math.floor(abs / 60)
      return future ? config.relative.inMinutes(m) : config.relative.minutesAgo(m)
    }
    if (abs < t.hours) {
      const h = Math.floor(abs / 3600)
      return future ? config.relative.inHours(h) : config.relative.hoursAgo(h)
    }
    if (abs < t.days) {
      const d = Math.floor(abs / 86400)
      if (d <= 1) return future ? config.relative.tomorrow : config.relative.yesterday
      return future ? config.relative.inDays(d) : config.relative.daysAgo(d)
    }
    if (abs < t.weeks) {
      const w = Math.floor(abs / 604800)
      return future ? config.relative.inWeeks(w || 1) : config.relative.weeksAgo(w || 1)
    }
    if (abs < t.months) {
      const mo = Math.floor(abs / 2592000)
      return future ? config.relative.inMonths(mo || 1) : config.relative.monthsAgo(mo || 1)
    }
    const y = Math.floor(abs / 31536000)
    return future ? config.relative.inYears(y || 1) : config.relative.yearsAgo(y || 1)
  }

  fromNow() { return this.relative() }

  smart(options?: { for?: Timezone }) {
    const buckets = config.smart.buckets
    const seconds = Math.abs(differenceInSeconds(this._date, new Date()))

    for (const bucket of buckets) {
      if (bucket.older) {
        return bucket.show === 'relative' ? this.relative() : format(this._date, bucket.show)
      }

      const matches =
        (bucket.within === 'minute' && seconds < 60) ||
        (bucket.within === 'hour' && seconds < 3600) ||
        (bucket.within === 'today' && isToday(this._date)) ||
        (bucket.within === 'yesterday' && (isYesterday(this._date) || isTomorrow(this._date))) ||
        (bucket.within === 'week' && seconds < 604800) ||
        (bucket.within === 'year' && this._date.getFullYear() === new Date().getFullYear())

      if (matches) {
        return bucket.show === 'relative' ? this.relative() : format(this._date, bucket.show)
      }
    }

    return this._date.toISOString()
  }

  add(amount: number, unit: TimeUnit) { return new WhennyImpl(addTime(this._date, amount, unit)) }
  subtract(amount: number, unit: TimeUnit) { return new WhennyImpl(addTime(this._date, -amount, unit)) }

  get year() { return this._date.getFullYear() }
  get month() { return this._date.getMonth() + 1 }
  get day() { return this._date.getDate() }
  get hour() { return this._date.getHours() }
  get minute() { return this._date.getMinutes() }
  get second() { return this._date.getSeconds() }
}

export function whenny(input: DateInput): Whenny {
  return new WhennyImpl(input)
}

whenny.now = () => new WhennyImpl(new Date())
whenny.utc = (s?: string) => new WhennyImpl(s ? new Date(s) : new Date())
whenny.local = (s?: string) => new WhennyImpl(s ? new Date(s) : new Date())
`

// Note: I'll continue with other templates in the next part due to length
const RELATIVE_TEMPLATE = `/**
 * Whenny Relative Time
 *
 * Format dates as relative time strings.
 * Customize text in whenny.config.ts
 *
 * @example Basic Usage
 * \`\`\`ts
 * import { relative, fromNow } from './relative'
 *
 * // Relative to now
 * relative(new Date())                         // "just now"
 * relative(Date.now() - 60000)                 // "1 minute ago"
 * relative(Date.now() - 3600000)               // "1 hour ago"
 * relative(Date.now() - 86400000)              // "yesterday"
 * relative(Date.now() + 86400000)              // "tomorrow"
 * relative(Date.now() + 3600000)               // "in 1 hour"
 *
 * // fromNow() is an alias
 * fromNow('2024-01-15')                        // "3 months ago"
 *
 * // Relative to a specific date
 * relative('2024-01-20', { from: '2024-01-15' })  // "in 5 days"
 * \`\`\`
 */

import { config, parseDate, differenceInSeconds, type DateInput } from './core.js'

export function relative(date: DateInput, options?: { from?: DateInput }): string {
  const target = parseDate(date)
  const reference = options?.from ? parseDate(options.from) : new Date()
  const seconds = differenceInSeconds(target, reference)
  const abs = Math.abs(seconds)
  const future = seconds > 0
  const t = config.relative.thresholds

  if (abs < t.justNow) return config.relative.justNow
  if (abs < t.seconds) return future ? config.relative.inSeconds(abs) : config.relative.secondsAgo(abs)
  if (abs < t.minutes) {
    const m = Math.floor(abs / 60)
    return future ? config.relative.inMinutes(m) : config.relative.minutesAgo(m)
  }
  if (abs < t.hours) {
    const h = Math.floor(abs / 3600)
    return future ? config.relative.inHours(h) : config.relative.hoursAgo(h)
  }
  if (abs < t.days) {
    const d = Math.floor(abs / 86400)
    if (d <= 1) return future ? config.relative.tomorrow : config.relative.yesterday
    return future ? config.relative.inDays(d) : config.relative.daysAgo(d)
  }
  if (abs < t.weeks) {
    const w = Math.floor(abs / 604800)
    return future ? config.relative.inWeeks(w || 1) : config.relative.weeksAgo(w || 1)
  }
  if (abs < t.months) {
    const mo = Math.floor(abs / 2592000)
    return future ? config.relative.inMonths(mo || 1) : config.relative.monthsAgo(mo || 1)
  }
  const y = Math.floor(abs / 31536000)
  return future ? config.relative.inYears(y || 1) : config.relative.yearsAgo(y || 1)
}

export function fromNow(date: DateInput): string {
  return relative(date)
}
`

const SMART_TEMPLATE = `/**
 * Whenny Smart Formatting
 *
 * Context-aware formatting that picks the best representation.
 * Shows relative time for recent, absolute for older dates.
 *
 * @example Basic Usage
 * \`\`\`ts
 * import { smart } from './smart'
 *
 * // Recent dates show relative time
 * smart(Date.now() - 30000)        // "just now" (within a minute)
 * smart(Date.now() - 300000)       // "5 minutes ago" (within an hour)
 *
 * // Today shows time only
 * smart(todayAt9am)                // "9:00 AM"
 *
 * // Yesterday shows "Yesterday at..."
 * smart(yesterdayAt3pm)            // "Yesterday at 3:00 PM"
 *
 * // This week shows weekday
 * smart(lastTuesday)               // "Tuesday at 2:30 PM"
 *
 * // This year shows month/day
 * smart('2024-03-15')              // "Mar 15"
 *
 * // Older shows full date
 * smart('2023-06-20')              // "Jun 20, 2023"
 *
 * // With timezone context
 * smart(date, { for: 'America/New_York' })
 * \`\`\`
 */

import { config, parseDate, format, isToday, isYesterday, isTomorrow, differenceInSeconds, type DateInput, type Timezone } from './core.js'
import { relative } from './relative.js'

export function smart(date: DateInput, options?: { for?: Timezone; from?: DateInput }): string {
  const target = parseDate(date)
  const reference = options?.from ? parseDate(options.from) : new Date()
  const seconds = Math.abs(differenceInSeconds(target, reference))
  const buckets = config.smart.buckets

  for (const bucket of buckets) {
    if (bucket.older) {
      return bucket.show === 'relative' ? relative(target) : format(target, bucket.show)
    }

    const matches =
      (bucket.within === 'minute' && seconds < 60) ||
      (bucket.within === 'hour' && seconds < 3600) ||
      (bucket.within === 'today' && isToday(target)) ||
      (bucket.within === 'yesterday' && (isYesterday(target) || isTomorrow(target))) ||
      (bucket.within === 'week' && seconds < 604800) ||
      (bucket.within === 'year' && target.getFullYear() === new Date().getFullYear())

    if (matches) {
      return bucket.show === 'relative' ? relative(target, { from: reference }) : format(target, bucket.show)
    }
  }

  return target.toISOString()
}
`

const COMPARE_TEMPLATE = `/**
 * Whenny Compare
 *
 * Compare two dates and get formatted descriptions.
 *
 * @example Basic Usage
 * \`\`\`ts
 * import { compare, distance } from './compare'
 *
 * const meeting = '2024-01-20T14:00:00'
 * const deadline = '2024-01-15T09:00:00'
 *
 * // Compare two dates
 * compare(meeting, deadline).smart()     // "5 days after"
 * compare(deadline, meeting).smart()     // "5 days before"
 * compare(deadline, deadline).smart()    // "at the same time"
 *
 * // Get numeric differences
 * compare(meeting, deadline).days()      // 5
 * compare(meeting, deadline).hours()     // 125
 * compare(meeting, deadline).minutes()   // 7500
 *
 * // Boolean checks
 * compare(meeting, deadline).isAfter()   // true
 * compare(meeting, deadline).isBefore()  // false
 * compare(meeting, deadline).isSame()    // false
 * compare(meeting, deadline).isSame('day')  // false
 *
 * // Distance between dates
 * distance(meeting, deadline).human()    // "5 days"
 * distance(meeting, deadline).exact()    // "5 days, 5 hours"
 * distance(meeting, deadline).totalSeconds  // 450000
 * \`\`\`
 */

import { config, parseDate, differenceInSeconds, type DateInput } from './core.js'

export function compare(dateA: DateInput, dateB: DateInput) {
  const a = parseDate(dateA)
  const b = parseDate(dateB)
  const diffSeconds = differenceInSeconds(a, b)

  function getDescription(seconds: number): string {
    const abs = Math.abs(seconds)
    if (abs < 60) return \`\${abs} second\${abs === 1 ? '' : 's'}\`
    if (abs < 3600) {
      const m = Math.floor(abs / 60)
      return \`\${m} minute\${m === 1 ? '' : 's'}\`
    }
    if (abs < 86400) {
      const h = Math.floor(abs / 3600)
      return \`\${h} hour\${h === 1 ? '' : 's'}\`
    }
    const d = Math.floor(abs / 86400)
    return \`\${d} day\${d === 1 ? '' : 's'}\`
  }

  return {
    smart(): string {
      if (Math.abs(diffSeconds) < 1) return config.compare.simultaneous
      const desc = getDescription(diffSeconds)
      return diffSeconds < 0
        ? config.compare.before.replace('{time}', desc)
        : config.compare.after.replace('{time}', desc)
    },
    days: () => Math.floor((a.getTime() - b.getTime()) / 86400000),
    hours: () => Math.floor((a.getTime() - b.getTime()) / 3600000),
    minutes: () => Math.floor((a.getTime() - b.getTime()) / 60000),
    seconds: () => diffSeconds,
    isBefore: () => diffSeconds < 0,
    isAfter: () => diffSeconds > 0,
    isSame: (unit?: 'day') => unit === 'day'
      ? a.toDateString() === b.toDateString()
      : a.getTime() === b.getTime(),
  }
}

export function distance(dateA: DateInput, dateB: DateInput) {
  const a = parseDate(dateA)
  const b = parseDate(dateB)
  const ms = Math.abs(a.getTime() - b.getTime())
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    human: () => days > 0 ? \`\${days} day\${days === 1 ? '' : 's'}\` :
                 hours > 0 ? \`\${hours} hour\${hours === 1 ? '' : 's'}\` :
                 minutes > 0 ? \`\${minutes} minute\${minutes === 1 ? '' : 's'}\` :
                 \`\${seconds} second\${seconds === 1 ? '' : 's'}\`,
    exact: () => {
      const parts = []
      if (days > 0) parts.push(\`\${days} day\${days === 1 ? '' : 's'}\`)
      if (hours > 0) parts.push(\`\${hours} hour\${hours === 1 ? '' : 's'}\`)
      if (minutes > 0) parts.push(\`\${minutes} minute\${minutes === 1 ? '' : 's'}\`)
      return parts.length > 0 ? parts.join(', ') : '0 seconds'
    },
    days, hours, minutes, seconds, totalSeconds,
  }
}
`

const DURATION_TEMPLATE = `/**
 * Whenny Duration
 *
 * Format durations in various styles.
 *
 * @example Basic Usage
 * \`\`\`ts
 * import { duration, durationBetween, until, since } from './duration'
 *
 * // Format seconds as duration
 * duration(3661).long()      // "1 hour, 1 minute, 1 second"
 * duration(3661).compact()   // "1h 1m 1s"
 * duration(3661).clock()     // "1:01:01"
 * duration(3661).human()     // "about 1 hour"
 *
 * // Without hours
 * duration(125).clock()      // "2:05"
 *
 * // Access components
 * const d = duration(3661)
 * d.hours          // 1
 * d.minutes        // 1
 * d.seconds        // 1
 * d.totalSeconds   // 3661
 * d.totalMinutes   // 61
 *
 * // Duration between two dates
 * durationBetween('2024-01-15', '2024-01-16').long()  // "24 hours"
 *
 * // Countdown helpers
 * until('2024-12-31').human()    // "about 11 months"
 * since('2024-01-01').compact()  // "2h 30m 15s"
 * \`\`\`
 */

import { config, parseDate, type DateInput } from './core.js'

export function duration(seconds: number) {
  const total = Math.abs(Math.floor(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60

  return {
    long(): string {
      const parts = []
      if (h > 0) parts.push(config.duration.long.hours(h))
      if (m > 0) parts.push(config.duration.long.minutes(m))
      if (s > 0 || parts.length === 0) parts.push(config.duration.long.seconds(s))
      return parts.join(config.duration.long.separator)
    },
    compact(): string {
      const parts = []
      if (h > 0) parts.push(config.duration.compact.hours(h))
      if (m > 0 || h > 0) parts.push(config.duration.compact.minutes(m))
      if (s > 0 || parts.length === 0) parts.push(config.duration.compact.seconds(s))
      return parts.join(config.duration.compact.separator)
    },
    clock(): string {
      if (h > 0) return \`\${h}:\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`
      return \`\${m}:\${s.toString().padStart(2, '0')}\`
    },
    human(): string {
      if (h > 0) return \`about \${m >= 30 ? h + 1 : h} hour\${(m >= 30 ? h + 1 : h) === 1 ? '' : 's'}\`
      if (m > 0) return \`\${m} minute\${m === 1 ? '' : 's'}\`
      return \`\${s} second\${s === 1 ? '' : 's'}\`
    },
    hours: h, minutes: m, seconds: s, totalSeconds: total,
    totalMinutes: Math.floor(total / 60),
    totalHours: Math.floor(total / 3600),
  }
}

export function durationBetween(dateA: DateInput, dateB: DateInput) {
  const a = parseDate(dateA)
  const b = parseDate(dateB)
  return duration(Math.abs(a.getTime() - b.getTime()) / 1000)
}

export function until(date: DateInput) {
  return durationBetween(new Date(), date)
}

export function since(date: DateInput) {
  return durationBetween(date, new Date())
}
`

const TIMEZONE_TEMPLATE = `/**
 * Whenny Timezone
 *
 * Timezone utilities and conversions.
 *
 * @example Basic Usage
 * \`\`\`ts
 * import { local, offset, dayBounds, isTodayIn, tz } from './timezone'
 *
 * // Get user's local timezone
 * local()                            // "America/New_York"
 *
 * // Get UTC offset in minutes
 * offset('America/New_York')         // -300 (EST) or -240 (EDT)
 * offset('Europe/London')            // 0 or 60 (DST)
 * offset('Asia/Tokyo')               // 540
 *
 * // Get day boundaries in a timezone
 * const bounds = dayBounds({ for: 'America/Los_Angeles' })
 * bounds.start  // Start of day in LA (as UTC Date)
 * bounds.end    // End of day in LA (as UTC Date)
 *
 * // With specific date
 * dayBounds({ date: '2024-01-15', for: 'Europe/Paris' })
 *
 * // Check if a UTC date is "today" in a timezone
 * isTodayIn(new Date(), 'Asia/Tokyo')  // true/false
 *
 * // Namespace shortcuts
 * tz.local()
 * tz.offset('UTC')
 * tz.dayBounds({ for: 'America/Chicago' })
 * \`\`\`
 */

import { parseDate, getLocalTimezone, startOfDay, endOfDay, type DateInput, type Timezone } from './core.js'

export function local(): Timezone {
  return getLocalTimezone()
}

export function offset(timezone: Timezone, date: DateInput = new Date()): number {
  const d = parseDate(date)
  const utc = new Date(d.toLocaleString('en-US', { timeZone: 'UTC' }))
  const tz = new Date(d.toLocaleString('en-US', { timeZone: timezone }))
  return Math.round((tz.getTime() - utc.getTime()) / 60000)
}

export function dayBounds(options: { date?: DateInput; for: Timezone }) {
  const date = options.date ? parseDate(options.date) : new Date()
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: options.for }))
  const offsetMs = offset(options.for, date) * 60000
  return {
    start: new Date(startOfDay(tzDate).getTime() - offsetMs),
    end: new Date(endOfDay(tzDate).getTime() - offsetMs),
  }
}

export function isTodayIn(date: DateInput, timezone: Timezone): boolean {
  const d = parseDate(date)
  const bounds = dayBounds({ for: timezone })
  return d >= bounds.start && d <= bounds.end
}

export const tz = { local, offset, dayBounds, isTodayIn }
`

const CALENDAR_TEMPLATE = `/**
 * Whenny Calendar
 *
 * Calendar helpers for common operations.
 *
 * @example Basic Usage
 * \`\`\`ts
 * import {
 *   isToday, isYesterday, isTomorrow, isThisWeek, isThisMonth, isThisYear,
 *   isWeekend, isWeekday, isBusinessDay, isPast, isFuture, isBetween,
 *   startOf, endOf, add, subtract, daysUntil, daysSince, calendar
 * } from './calendar'
 *
 * // Date checks
 * isToday(new Date())                    // true
 * isYesterday(Date.now() - 86400000)     // true
 * isTomorrow(Date.now() + 86400000)      // true
 * isThisWeek('2024-01-15')               // depends on current date
 * isThisMonth('2024-01-15')              // depends on current date
 *
 * // Weekend/weekday checks
 * isWeekend('2024-01-13')                // true (Saturday)
 * isWeekday('2024-01-15')                // true (Monday)
 * isBusinessDay('2024-01-15')            // true (configurable in whenny.config.ts)
 *
 * // Past/future checks
 * isPast('2020-01-01')                   // true
 * isFuture('2030-01-01')                 // true
 * isBetween('2024-06-15', '2024-01-01', '2024-12-31')  // true
 *
 * // Get boundaries
 * startOf('2024-01-15', 'day')           // 2024-01-15 00:00:00
 * startOf('2024-01-15', 'week')          // Start of week containing Jan 15
 * startOf('2024-01-15', 'month')         // 2024-01-01 00:00:00
 * endOf('2024-01-15', 'day')             // 2024-01-15 23:59:59.999
 *
 * // Date math
 * add('2024-01-15', 7, 'days')           // 2024-01-22
 * subtract('2024-01-15', 1, 'month')     // 2023-12-15
 *
 * // Countdown helpers
 * daysUntil('2024-12-31')                // days until New Year
 * daysSince('2024-01-01')                // days since New Year
 *
 * // Namespace shortcut
 * calendar.isToday(date)
 * calendar.add(date, 5, 'days')
 * \`\`\`
 */

import { config, parseDate, addTime, startOfDay, endOfDay, isSameDay, isToday, isYesterday, isTomorrow, type DateInput, type TimeUnit } from './core.js'

export { isToday, isYesterday, isTomorrow }

export function isThisWeek(date: DateInput): boolean {
  const d = parseDate(date)
  const now = new Date()
  const weekStart = startOfDay(addTime(now, -now.getDay(), 'days'))
  const weekEnd = addTime(weekStart, 7, 'days')
  return d >= weekStart && d < weekEnd
}

export function isThisMonth(date: DateInput): boolean {
  const d = parseDate(date)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

export function isThisYear(date: DateInput): boolean {
  return parseDate(date).getFullYear() === new Date().getFullYear()
}

export function isWeekend(date: DateInput): boolean {
  const day = parseDate(date).getDay()
  return day === 0 || day === 6
}

export function isWeekday(date: DateInput): boolean {
  return !isWeekend(date)
}

export function isBusinessDay(date: DateInput): boolean {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const day = days[parseDate(date).getDay()]
  return config.calendar.businessDays.includes(day)
}

export function isPast(date: DateInput): boolean {
  return parseDate(date).getTime() < Date.now()
}

export function isFuture(date: DateInput): boolean {
  return parseDate(date).getTime() > Date.now()
}

export function isSameDayAs(dateA: DateInput, dateB: DateInput): boolean {
  return isSameDay(parseDate(dateA), parseDate(dateB))
}

export function isBefore(dateA: DateInput, dateB: DateInput): boolean {
  return parseDate(dateA).getTime() < parseDate(dateB).getTime()
}

export function isAfter(dateA: DateInput, dateB: DateInput): boolean {
  return parseDate(dateA).getTime() > parseDate(dateB).getTime()
}

export function isBetween(date: DateInput, start: DateInput, end: DateInput): boolean {
  const d = parseDate(date).getTime()
  return d >= parseDate(start).getTime() && d <= parseDate(end).getTime()
}

export function startOf(date: DateInput, unit: 'day' | 'week' | 'month' | 'year'): Date {
  const d = parseDate(date)
  if (unit === 'day') return startOfDay(d)
  if (unit === 'week') return startOfDay(addTime(d, -d.getDay(), 'days'))
  if (unit === 'month') { d.setDate(1); return startOfDay(d) }
  if (unit === 'year') { d.setMonth(0, 1); return startOfDay(d) }
  return d
}

export function endOf(date: DateInput, unit: 'day' | 'week' | 'month' | 'year'): Date {
  const d = parseDate(date)
  if (unit === 'day') return endOfDay(d)
  if (unit === 'week') return endOfDay(addTime(startOf(d, 'week'), 6, 'days'))
  if (unit === 'month') { d.setMonth(d.getMonth() + 1, 0); return endOfDay(d) }
  if (unit === 'year') { d.setMonth(11, 31); return endOfDay(d) }
  return d
}

export function add(date: DateInput, amount: number, unit: TimeUnit): Date {
  return addTime(parseDate(date), amount, unit)
}

export function subtract(date: DateInput, amount: number, unit: TimeUnit): Date {
  return addTime(parseDate(date), -amount, unit)
}

export function daysUntil(date: DateInput): number {
  const diff = Math.floor((parseDate(date).getTime() - Date.now()) / 86400000)
  return diff > 0 ? diff : 0
}

export function daysSince(date: DateInput): number {
  const diff = Math.floor((Date.now() - parseDate(date).getTime()) / 86400000)
  return diff > 0 ? diff : 0
}

export const calendar = {
  isToday, isYesterday, isTomorrow, isThisWeek, isThisMonth, isThisYear,
  isWeekend, isWeekday, isBusinessDay, isPast, isFuture,
  isSameDay: isSameDayAs, isBefore, isAfter, isBetween,
  startOf, endOf, add, subtract, daysUntil, daysSince,
}
`

const TRANSFER_TEMPLATE = `/**
 * Whenny Transfer
 *
 * Handle date serialization with timezone context.
 * Perfect for server/client date synchronization.
 *
 * @example Basic Usage
 * \`\`\`ts
 * import { createTransfer, fromTransfer, localTransfer, utcTransfer, transfer } from './transfer'
 *
 * // === SERVER SIDE ===
 * // Create a transfer payload to send to client
 * const payload = createTransfer(new Date(), { timezone: 'America/New_York' })
 * // { iso: "2024-01-15T20:00:00.000Z", originZone: "America/New_York", originOffset: -300 }
 *
 * // Quick helpers
 * const local = localTransfer(new Date())  // Uses browser's timezone
 * const utc = utcTransfer(new Date())      // Uses UTC
 *
 * // === CLIENT SIDE ===
 * // Receive and work with transferred date
 * const received = fromTransfer(payload)
 *
 * received.date                  // UTC Date object
 * received.originZone            // "America/New_York"
 * received.originOffset          // -300
 *
 * received.utc()                 // Date in UTC
 * received.inOrigin()            // Date adjusted to origin timezone
 * received.startOfDayInOrigin()  // Start of day in origin timezone
 * received.endOfDayInOrigin()    // End of day in origin timezone
 * received.dayBoundsInOrigin()   // { start, end } in origin timezone
 * received.toISO()               // ISO string
 * received.transfer()            // Get payload back for re-sending
 *
 * // Namespace shortcuts
 * transfer.create(date, { timezone: 'UTC' })
 * transfer.from(payload)
 * transfer.local(date)
 * transfer.utc(date)
 * \`\`\`
 */

import { parseDate, getLocalTimezone, startOfDay, endOfDay, type DateInput, type Timezone } from './core.js'
import { offset } from './timezone.js'

export interface TransferPayload {
  iso: string
  originZone: Timezone
  originOffset: number
}

export function createTransfer(date: DateInput, options?: { timezone?: Timezone }): TransferPayload {
  const d = parseDate(date)
  const tz = options?.timezone ?? getLocalTimezone()
  return {
    iso: d.toISOString(),
    originZone: tz,
    originOffset: offset(tz, d),
  }
}

export function fromTransfer(payload: TransferPayload) {
  const date = new Date(payload.iso)

  return {
    date,
    originZone: payload.originZone,
    originOffset: payload.originOffset,
    utc: () => new Date(date),
    inOrigin: () => new Date(date.getTime() + payload.originOffset * 60000),
    startOfDayInOrigin: () => {
      const inOrigin = new Date(date.getTime() + payload.originOffset * 60000)
      return new Date(startOfDay(inOrigin).getTime() - payload.originOffset * 60000)
    },
    endOfDayInOrigin: () => {
      const inOrigin = new Date(date.getTime() + payload.originOffset * 60000)
      return new Date(endOfDay(inOrigin).getTime() - payload.originOffset * 60000)
    },
    dayBoundsInOrigin: function() {
      return { start: this.startOfDayInOrigin(), end: this.endOfDayInOrigin() }
    },
    toISO: () => date.toISOString(),
    transfer: () => ({ ...payload }),
  }
}

export function localTransfer(date: DateInput = new Date()): TransferPayload {
  return createTransfer(date)
}

export function utcTransfer(date: DateInput = new Date()): TransferPayload {
  return createTransfer(date, { timezone: 'UTC' })
}

export const transfer = { create: createTransfer, from: fromTransfer, local: localTransfer, utc: utcTransfer }
`

const NATURAL_TEMPLATE = `/**
 * Whenny Natural Language
 *
 * Parse human-friendly date expressions.
 *
 * @example Basic Usage
 * \`\`\`ts
 * import { parse, canParse, natural } from './natural'
 *
 * // Basic expressions
 * parse('now')                      // Current date/time
 * parse('today')                    // Start of today
 * parse('tomorrow')                 // Start of tomorrow
 * parse('yesterday')                // Start of yesterday
 *
 * // Relative expressions
 * parse('in 5 minutes')             // 5 minutes from now
 * parse('in 2 hours')               // 2 hours from now
 * parse('in 3 days')                // 3 days from now
 * parse('in 1 week')                // 1 week from now
 * parse('5 minutes ago')            // 5 minutes ago
 * parse('2 days ago')               // 2 days ago
 *
 * // Named days
 * parse('next friday')              // Next Friday
 * parse('next monday')              // Next Monday
 * parse('next week')                // Start of next week
 * parse('last week')                // Start of last week
 * parse('next month')               // Start of next month
 *
 * // Time of day
 * parse('tomorrow at 3pm')          // Tomorrow at 3:00 PM
 * parse('tomorrow at 3:30pm')       // Tomorrow at 3:30 PM
 * parse('next friday at 9am')       // Next Friday at 9:00 AM
 * parse('tomorrow morning')         // Tomorrow at 9:00 AM (configurable)
 * parse('tomorrow afternoon')       // Tomorrow at 2:00 PM (configurable)
 * parse('tomorrow evening')         // Tomorrow at 6:00 PM (configurable)
 *
 * // End of period
 * parse('end of month')             // Last day of current month
 * parse('end of year')              // December 31st
 *
 * // Check if expression is parseable
 * canParse('tomorrow at 3pm')       // true
 * canParse('gibberish')             // false
 *
 * // Parse with custom reference date
 * parse('tomorrow', { from: new Date('2024-01-15') })  // 2024-01-16
 *
 * // Namespace shortcuts
 * natural.parse('in 5 days')
 * natural.canParse('next week')
 * \`\`\`
 */

import { config, parseDate, addTime, startOfDay, startOfWeek, type DateInput } from './core.js'

export function parse(input: string, options?: { from?: Date }): Date | null {
  const reference = options?.from ?? new Date()
  const s = input.toLowerCase().trim()

  // now, today, tomorrow, yesterday
  if (s === 'now') return new Date(reference)
  if (s === 'today') return startOfDay(reference)
  if (s === 'tomorrow') return startOfDay(addTime(reference, 1, 'day'))
  if (s === 'yesterday') return startOfDay(addTime(reference, -1, 'day'))

  // in X units
  const inMatch = s.match(/^in\\s+(\\d+)\\s+(second|minute|hour|day|week|month|year)s?$/)
  if (inMatch) return addTime(reference, parseInt(inMatch[1]), inMatch[2] as any)

  // X units ago
  const agoMatch = s.match(/^(\\d+)\\s+(second|minute|hour|day|week|month|year)s?\\s+ago$/)
  if (agoMatch) return addTime(reference, -parseInt(agoMatch[1]), agoMatch[2] as any)

  // next/last week/month/year
  if (s === 'next week') return startOfWeek(addTime(reference, 7, 'days'))
  if (s === 'last week') return startOfWeek(addTime(reference, -7, 'days'))
  if (s === 'next month') { const d = addTime(reference, 1, 'month'); d.setDate(1); return startOfDay(d) }
  if (s === 'last month') { const d = addTime(reference, -1, 'month'); d.setDate(1); return startOfDay(d) }

  // next <day>
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const nextDayMatch = s.match(/^next\\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/)
  if (nextDayMatch) {
    const target = days.indexOf(nextDayMatch[1])
    let diff = target - reference.getDay()
    if (diff <= 0) diff += 7
    return startOfDay(addTime(reference, diff, 'days'))
  }

  // end of month/year
  if (s === 'end of month') { const d = new Date(reference); d.setMonth(d.getMonth() + 1, 0); return d }
  if (s === 'end of year') { const d = new Date(reference); d.setMonth(11, 31); return d }

  // X at Y
  const atMatch = s.match(/^(.+?)\\s+at\\s+(\\d{1,2})(?::(\\d{2}))?\\s*(am|pm)?$/)
  if (atMatch) {
    const dateResult = parse(atMatch[1], { from: reference })
    if (!dateResult) return null
    let hour = parseInt(atMatch[2])
    const minute = atMatch[3] ? parseInt(atMatch[3]) : 0
    const ampm = atMatch[4]?.toLowerCase()
    if (ampm === 'pm' && hour !== 12) hour += 12
    if (ampm === 'am' && hour === 12) hour = 0
    if (!ampm && hour >= 1 && hour <= 7) hour += 12
    dateResult.setHours(hour, minute, 0, 0)
    return dateResult
  }

  // X morning/afternoon/evening
  const timeOfDayMatch = s.match(/^(.+?)\\s+(morning|afternoon|evening|night)$/)
  if (timeOfDayMatch) {
    const dateResult = parse(timeOfDayMatch[1], { from: reference })
    if (!dateResult) return null
    const tod = timeOfDayMatch[2] as keyof typeof config.natural
    dateResult.setHours(config.natural[tod], 0, 0, 0)
    return dateResult
  }

  return null
}

export function canParse(input: string): boolean {
  return parse(input) !== null
}

export const natural = { parse, canParse }
`

const REACT_TEMPLATE = `/**
 * Whenny React Hooks
 *
 * React integration for Whenny.
 *
 * @example Basic Usage
 * \`\`\`tsx
 * import { useRelativeTime, useCountdown, useDateFormatter } from './react'
 *
 * // === Auto-updating Relative Time ===
 * function Comment({ createdAt }: { createdAt: Date }) {
 *   // Updates every 60 seconds by default
 *   const timeAgo = useRelativeTime(createdAt)
 *   return <span>{timeAgo}</span>  // "5 minutes ago"
 * }
 *
 * // With custom interval
 * const timeAgo = useRelativeTime(date, { updateInterval: 10000 })  // every 10s
 *
 * // Use smart formatting instead of relative
 * const smartTime = useRelativeTime(date, { smart: true })
 *
 * // === Countdown Timer ===
 * function LaunchCountdown({ launchDate }: { launchDate: Date }) {
 *   const countdown = useCountdown(launchDate)
 *
 *   if (countdown.isExpired) {
 *     return <span>Launched!</span>
 *   }
 *
 *   return (
 *     <div>
 *       <span>{countdown.formatted}</span>  // "2d 5h 30m 15s"
 *       {/* Or access individual values *}
 *       <span>{countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s</span>
 *     </div>
 *   )
 * }
 *
 * // === Memoized Date Formatter ===
 * function DateList({ dates }: { dates: Date[] }) {
 *   const fmt = useDateFormatter()
 *   return (
 *     <ul>
 *       {dates.map((d, i) => (
 *         <li key={i}>{fmt(d).smart()}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * \`\`\`
 */

import { useState, useEffect, useCallback } from 'react'
import { whenny, type DateInput } from './core.js'
import { relative } from './relative.js'

/**
 * Auto-updating relative time hook
 */
export function useRelativeTime(
  date: DateInput,
  options?: { updateInterval?: number; smart?: boolean }
): string {
  const interval = options?.updateInterval ?? 60000

  const formatDate = useCallback(() => {
    const w = whenny(date)
    return options?.smart ? w.smart() : w.relative()
  }, [date, options?.smart])

  const [text, setText] = useState(formatDate)

  useEffect(() => {
    setText(formatDate())
    const timer = setInterval(() => setText(formatDate()), interval)
    return () => clearInterval(timer)
  }, [formatDate, interval])

  return text
}

/**
 * Countdown hook
 */
export function useCountdown(targetDate: DateInput) {
  const getRemaining = useCallback(() => {
    const target = whenny(targetDate).toDate()
    const now = Date.now()
    const diff = Math.max(0, target.getTime() - now)

    const totalSeconds = Math.floor(diff / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return {
      days, hours, minutes, seconds, totalSeconds,
      isExpired: diff <= 0,
      formatted: days > 0
        ? \`\${days}d \${hours}h \${minutes}m \${seconds}s\`
        : hours > 0
        ? \`\${hours}h \${minutes}m \${seconds}s\`
        : \`\${minutes}m \${seconds}s\`,
    }
  }, [targetDate])

  const [remaining, setRemaining] = useState(getRemaining)

  useEffect(() => {
    setRemaining(getRemaining())
    const timer = setInterval(() => setRemaining(getRemaining()), 1000)
    return () => clearInterval(timer)
  }, [getRemaining])

  return remaining
}

/**
 * Memoized date formatter hook
 */
export function useDateFormatter() {
  return useCallback((date: DateInput) => whenny(date), [])
}
`

const CONSTANTS_TEMPLATE = `/**
 * Whenny Constants
 *
 * Useful constants for date formatting: timezone lists, format patterns, and more.
 * Never have to look up timezones on Wikipedia again!
 *
 * @example Basic Usage
 * \\\`\\\`\\\`ts
 * import {
 *   TIMEZONES, TIMEZONE_REGIONS, COMMON_TIMEZONES,
 *   FORMAT_PATTERNS, TIME_UNITS, DURATION_MS
 * } from './constants'
 *
 * // Get all timezones
 * TIMEZONES.length  // 400+
 *
 * // Common US timezones
 * COMMON_TIMEZONES.US  // ['America/New_York', 'America/Chicago', ...]
 *
 * // Timezone regions
 * TIMEZONE_REGIONS.America  // ['America/New_York', 'America/Los_Angeles', ...]
 *
 * // Format patterns
 * FORMAT_PATTERNS.ISO_8601       // 'YYYY-MM-DDTHH:mm:ss.sssZ'
 * FORMAT_PATTERNS.RFC_2822       // 'ddd, DD MMM YYYY HH:mm:ss ZZ'
 *
 * // Time unit conversions
 * DURATION_MS.HOUR               // 3600000
 * DURATION_MS.DAY                // 86400000
 * \\\`\\\`\\\`
 */

// ============================================================================
// TIMEZONES
// ============================================================================

/**
 * All IANA timezone names
 */
export const TIMEZONES = [
  // Africa
  'Africa/Abidjan', 'Africa/Accra', 'Africa/Addis_Ababa', 'Africa/Algiers', 'Africa/Asmara',
  'Africa/Bamako', 'Africa/Bangui', 'Africa/Banjul', 'Africa/Bissau', 'Africa/Blantyre',
  'Africa/Brazzaville', 'Africa/Bujumbura', 'Africa/Cairo', 'Africa/Casablanca', 'Africa/Ceuta',
  'Africa/Conakry', 'Africa/Dakar', 'Africa/Dar_es_Salaam', 'Africa/Djibouti', 'Africa/Douala',
  'Africa/El_Aaiun', 'Africa/Freetown', 'Africa/Gaborone', 'Africa/Harare', 'Africa/Johannesburg',
  'Africa/Juba', 'Africa/Kampala', 'Africa/Khartoum', 'Africa/Kigali', 'Africa/Kinshasa',
  'Africa/Lagos', 'Africa/Libreville', 'Africa/Lome', 'Africa/Luanda', 'Africa/Lubumbashi',
  'Africa/Lusaka', 'Africa/Malabo', 'Africa/Maputo', 'Africa/Maseru', 'Africa/Mbabane',
  'Africa/Mogadishu', 'Africa/Monrovia', 'Africa/Nairobi', 'Africa/Ndjamena', 'Africa/Niamey',
  'Africa/Nouakchott', 'Africa/Ouagadougou', 'Africa/Porto-Novo', 'Africa/Sao_Tome',
  'Africa/Tripoli', 'Africa/Tunis', 'Africa/Windhoek',

  // America
  'America/Adak', 'America/Anchorage', 'America/Anguilla', 'America/Antigua', 'America/Araguaina',
  'America/Argentina/Buenos_Aires', 'America/Argentina/Catamarca', 'America/Argentina/Cordoba',
  'America/Argentina/Jujuy', 'America/Argentina/La_Rioja', 'America/Argentina/Mendoza',
  'America/Argentina/Rio_Gallegos', 'America/Argentina/Salta', 'America/Argentina/San_Juan',
  'America/Argentina/San_Luis', 'America/Argentina/Tucuman', 'America/Argentina/Ushuaia',
  'America/Aruba', 'America/Asuncion', 'America/Atikokan', 'America/Bahia', 'America/Bahia_Banderas',
  'America/Barbados', 'America/Belem', 'America/Belize', 'America/Blanc-Sablon', 'America/Boa_Vista',
  'America/Bogota', 'America/Boise', 'America/Cambridge_Bay', 'America/Campo_Grande', 'America/Cancun',
  'America/Caracas', 'America/Cayenne', 'America/Cayman', 'America/Chicago', 'America/Chihuahua',
  'America/Costa_Rica', 'America/Creston', 'America/Cuiaba', 'America/Curacao', 'America/Danmarkshavn',
  'America/Dawson', 'America/Dawson_Creek', 'America/Denver', 'America/Detroit', 'America/Dominica',
  'America/Edmonton', 'America/Eirunepe', 'America/El_Salvador', 'America/Fort_Nelson',
  'America/Fortaleza', 'America/Glace_Bay', 'America/Godthab', 'America/Goose_Bay',
  'America/Grand_Turk', 'America/Grenada', 'America/Guadeloupe', 'America/Guatemala', 'America/Guayaquil',
  'America/Guyana', 'America/Halifax', 'America/Havana', 'America/Hermosillo', 'America/Indiana/Indianapolis',
  'America/Indiana/Knox', 'America/Indiana/Marengo', 'America/Indiana/Petersburg', 'America/Indiana/Tell_City',
  'America/Indiana/Vevay', 'America/Indiana/Vincennes', 'America/Indiana/Winamac', 'America/Inuvik',
  'America/Iqaluit', 'America/Jamaica', 'America/Juneau', 'America/Kentucky/Louisville',
  'America/Kentucky/Monticello', 'America/Kralendijk', 'America/La_Paz', 'America/Lima',
  'America/Los_Angeles', 'America/Lower_Princes', 'America/Maceio', 'America/Managua', 'America/Manaus',
  'America/Marigot', 'America/Martinique', 'America/Matamoros', 'America/Mazatlan', 'America/Menominee',
  'America/Merida', 'America/Metlakatla', 'America/Mexico_City', 'America/Miquelon', 'America/Moncton',
  'America/Monterrey', 'America/Montevideo', 'America/Montserrat', 'America/Nassau', 'America/New_York',
  'America/Nipigon', 'America/Nome', 'America/Noronha', 'America/North_Dakota/Beulah',
  'America/North_Dakota/Center', 'America/North_Dakota/New_Salem', 'America/Ojinaga', 'America/Panama',
  'America/Pangnirtung', 'America/Paramaribo', 'America/Phoenix', 'America/Port-au-Prince',
  'America/Port_of_Spain', 'America/Porto_Velho', 'America/Puerto_Rico', 'America/Punta_Arenas',
  'America/Rainy_River', 'America/Rankin_Inlet', 'America/Recife', 'America/Regina', 'America/Resolute',
  'America/Rio_Branco', 'America/Santarem', 'America/Santiago', 'America/Santo_Domingo', 'America/Sao_Paulo',
  'America/Scoresbysund', 'America/Sitka', 'America/St_Barthelemy', 'America/St_Johns', 'America/St_Kitts',
  'America/St_Lucia', 'America/St_Thomas', 'America/St_Vincent', 'America/Swift_Current', 'America/Tegucigalpa',
  'America/Thule', 'America/Thunder_Bay', 'America/Tijuana', 'America/Toronto', 'America/Tortola',
  'America/Vancouver', 'America/Whitehorse', 'America/Winnipeg', 'America/Yakutat', 'America/Yellowknife',

  // Antarctica
  'Antarctica/Casey', 'Antarctica/Davis', 'Antarctica/DumontDUrville', 'Antarctica/Macquarie',
  'Antarctica/Mawson', 'Antarctica/McMurdo', 'Antarctica/Palmer', 'Antarctica/Rothera',
  'Antarctica/Syowa', 'Antarctica/Troll', 'Antarctica/Vostok',

  // Asia
  'Asia/Aden', 'Asia/Almaty', 'Asia/Amman', 'Asia/Anadyr', 'Asia/Aqtau', 'Asia/Aqtobe', 'Asia/Ashgabat',
  'Asia/Atyrau', 'Asia/Baghdad', 'Asia/Bahrain', 'Asia/Baku', 'Asia/Bangkok', 'Asia/Barnaul', 'Asia/Beirut',
  'Asia/Bishkek', 'Asia/Brunei', 'Asia/Chita', 'Asia/Choibalsan', 'Asia/Colombo', 'Asia/Damascus',
  'Asia/Dhaka', 'Asia/Dili', 'Asia/Dubai', 'Asia/Dushanbe', 'Asia/Famagusta', 'Asia/Gaza', 'Asia/Hebron',
  'Asia/Ho_Chi_Minh', 'Asia/Hong_Kong', 'Asia/Hovd', 'Asia/Irkutsk', 'Asia/Jakarta', 'Asia/Jayapura',
  'Asia/Jerusalem', 'Asia/Kabul', 'Asia/Kamchatka', 'Asia/Karachi', 'Asia/Kathmandu', 'Asia/Khandyga',
  'Asia/Kolkata', 'Asia/Krasnoyarsk', 'Asia/Kuala_Lumpur', 'Asia/Kuching', 'Asia/Kuwait', 'Asia/Macau',
  'Asia/Magadan', 'Asia/Makassar', 'Asia/Manila', 'Asia/Muscat', 'Asia/Nicosia', 'Asia/Novokuznetsk',
  'Asia/Novosibirsk', 'Asia/Omsk', 'Asia/Oral', 'Asia/Phnom_Penh', 'Asia/Pontianak', 'Asia/Pyongyang',
  'Asia/Qatar', 'Asia/Qostanay', 'Asia/Qyzylorda', 'Asia/Riyadh', 'Asia/Sakhalin', 'Asia/Samarkand',
  'Asia/Seoul', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Srednekolymsk', 'Asia/Taipei', 'Asia/Tashkent',
  'Asia/Tbilisi', 'Asia/Tehran', 'Asia/Thimphu', 'Asia/Tokyo', 'Asia/Tomsk', 'Asia/Ulaanbaatar',
  'Asia/Urumqi', 'Asia/Ust-Nera', 'Asia/Vientiane', 'Asia/Vladivostok', 'Asia/Yakutsk', 'Asia/Yangon',
  'Asia/Yekaterinburg', 'Asia/Yerevan',

  // Atlantic
  'Atlantic/Azores', 'Atlantic/Bermuda', 'Atlantic/Canary', 'Atlantic/Cape_Verde', 'Atlantic/Faroe',
  'Atlantic/Madeira', 'Atlantic/Reykjavik', 'Atlantic/South_Georgia', 'Atlantic/St_Helena', 'Atlantic/Stanley',

  // Australia
  'Australia/Adelaide', 'Australia/Brisbane', 'Australia/Broken_Hill', 'Australia/Darwin',
  'Australia/Eucla', 'Australia/Hobart', 'Australia/Lindeman', 'Australia/Lord_Howe',
  'Australia/Melbourne', 'Australia/Perth', 'Australia/Sydney',

  // Europe
  'Europe/Amsterdam', 'Europe/Andorra', 'Europe/Astrakhan', 'Europe/Athens', 'Europe/Belgrade',
  'Europe/Berlin', 'Europe/Bratislava', 'Europe/Brussels', 'Europe/Bucharest', 'Europe/Budapest',
  'Europe/Busingen', 'Europe/Chisinau', 'Europe/Copenhagen', 'Europe/Dublin', 'Europe/Gibraltar',
  'Europe/Guernsey', 'Europe/Helsinki', 'Europe/Isle_of_Man', 'Europe/Istanbul', 'Europe/Jersey',
  'Europe/Kaliningrad', 'Europe/Kiev', 'Europe/Kirov', 'Europe/Lisbon', 'Europe/Ljubljana',
  'Europe/London', 'Europe/Luxembourg', 'Europe/Madrid', 'Europe/Malta', 'Europe/Mariehamn',
  'Europe/Minsk', 'Europe/Monaco', 'Europe/Moscow', 'Europe/Oslo', 'Europe/Paris', 'Europe/Podgorica',
  'Europe/Prague', 'Europe/Riga', 'Europe/Rome', 'Europe/Samara', 'Europe/San_Marino', 'Europe/Sarajevo',
  'Europe/Saratov', 'Europe/Simferopol', 'Europe/Skopje', 'Europe/Sofia', 'Europe/Stockholm',
  'Europe/Tallinn', 'Europe/Tirane', 'Europe/Ulyanovsk', 'Europe/Uzhgorod', 'Europe/Vaduz',
  'Europe/Vatican', 'Europe/Vienna', 'Europe/Vilnius', 'Europe/Volgograd', 'Europe/Warsaw',
  'Europe/Zagreb', 'Europe/Zaporozhye', 'Europe/Zurich',

  // Indian Ocean
  'Indian/Antananarivo', 'Indian/Chagos', 'Indian/Christmas', 'Indian/Cocos', 'Indian/Comoro',
  'Indian/Kerguelen', 'Indian/Mahe', 'Indian/Maldives', 'Indian/Mauritius', 'Indian/Mayotte', 'Indian/Reunion',

  // Pacific
  'Pacific/Apia', 'Pacific/Auckland', 'Pacific/Bougainville', 'Pacific/Chatham', 'Pacific/Chuuk',
  'Pacific/Easter', 'Pacific/Efate', 'Pacific/Enderbury', 'Pacific/Fakaofo', 'Pacific/Fiji',
  'Pacific/Funafuti', 'Pacific/Galapagos', 'Pacific/Gambier', 'Pacific/Guadalcanal', 'Pacific/Guam',
  'Pacific/Honolulu', 'Pacific/Kiritimati', 'Pacific/Kosrae', 'Pacific/Kwajalein', 'Pacific/Majuro',
  'Pacific/Marquesas', 'Pacific/Midway', 'Pacific/Nauru', 'Pacific/Niue', 'Pacific/Norfolk',
  'Pacific/Noumea', 'Pacific/Pago_Pago', 'Pacific/Palau', 'Pacific/Pitcairn', 'Pacific/Pohnpei',
  'Pacific/Port_Moresby', 'Pacific/Rarotonga', 'Pacific/Saipan', 'Pacific/Tahiti', 'Pacific/Tarawa',
  'Pacific/Tongatapu', 'Pacific/Wake', 'Pacific/Wallis',

  // UTC
  'UTC',
] as const

export type TimezoneId = typeof TIMEZONES[number]

/**
 * Timezones grouped by region
 */
export const TIMEZONE_REGIONS = {
  Africa: TIMEZONES.filter(tz => tz.startsWith('Africa/')),
  America: TIMEZONES.filter(tz => tz.startsWith('America/')),
  Antarctica: TIMEZONES.filter(tz => tz.startsWith('Antarctica/')),
  Asia: TIMEZONES.filter(tz => tz.startsWith('Asia/')),
  Atlantic: TIMEZONES.filter(tz => tz.startsWith('Atlantic/')),
  Australia: TIMEZONES.filter(tz => tz.startsWith('Australia/')),
  Europe: TIMEZONES.filter(tz => tz.startsWith('Europe/')),
  Indian: TIMEZONES.filter(tz => tz.startsWith('Indian/')),
  Pacific: TIMEZONES.filter(tz => tz.startsWith('Pacific/')),
}

/**
 * Common timezones by country/region
 */
export const COMMON_TIMEZONES = {
  US: [
    'America/New_York',      // Eastern
    'America/Chicago',       // Central
    'America/Denver',        // Mountain
    'America/Los_Angeles',   // Pacific
    'America/Anchorage',     // Alaska
    'Pacific/Honolulu',      // Hawaii
    'America/Phoenix',       // Arizona (no DST)
  ],
  UK: ['Europe/London'],
  EU: [
    'Europe/London',         // GMT/BST
    'Europe/Paris',          // CET/CEST
    'Europe/Berlin',
    'Europe/Amsterdam',
    'Europe/Rome',
    'Europe/Madrid',
    'Europe/Athens',         // EET/EEST
  ],
  Asia: [
    'Asia/Tokyo',            // JST
    'Asia/Shanghai',         // CST China
    'Asia/Hong_Kong',
    'Asia/Singapore',
    'Asia/Seoul',
    'Asia/Dubai',
    'Asia/Kolkata',          // IST India
    'Asia/Bangkok',
  ],
  Oceania: [
    'Australia/Sydney',
    'Australia/Melbourne',
    'Australia/Brisbane',
    'Australia/Perth',
    'Pacific/Auckland',
  ],
}

/**
 * Timezone abbreviations to IANA names
 */
export const TIMEZONE_ABBREVIATIONS: Record<string, string> = {
  // US
  EST: 'America/New_York',
  EDT: 'America/New_York',
  CST: 'America/Chicago',
  CDT: 'America/Chicago',
  MST: 'America/Denver',
  MDT: 'America/Denver',
  PST: 'America/Los_Angeles',
  PDT: 'America/Los_Angeles',
  AKST: 'America/Anchorage',
  AKDT: 'America/Anchorage',
  HST: 'Pacific/Honolulu',

  // Europe
  GMT: 'Europe/London',
  BST: 'Europe/London',
  CET: 'Europe/Paris',
  CEST: 'Europe/Paris',
  EET: 'Europe/Athens',
  EEST: 'Europe/Athens',
  WET: 'Europe/Lisbon',
  WEST: 'Europe/Lisbon',

  // Asia
  JST: 'Asia/Tokyo',
  KST: 'Asia/Seoul',
  CST_CHINA: 'Asia/Shanghai',
  HKT: 'Asia/Hong_Kong',
  SGT: 'Asia/Singapore',
  IST: 'Asia/Kolkata',
  PKT: 'Asia/Karachi',

  // Australia
  AEST: 'Australia/Sydney',
  AEDT: 'Australia/Sydney',
  ACST: 'Australia/Adelaide',
  ACDT: 'Australia/Adelaide',
  AWST: 'Australia/Perth',

  // New Zealand
  NZST: 'Pacific/Auckland',
  NZDT: 'Pacific/Auckland',

  // Universal
  UTC: 'UTC',
  Z: 'UTC',
}

// ============================================================================
// FORMAT PATTERNS
// ============================================================================

/**
 * Common date format patterns
 */
export const FORMAT_PATTERNS = {
  // ISO Standards
  ISO_8601: '{year}-{month}-{day}T{hour24}:{minute}:{second}Z',
  ISO_DATE: '{year}-{month}-{day}',
  ISO_TIME: '{hour24}:{minute}:{second}',

  // RFC Standards
  RFC_2822: '{weekdayShort}, {day} {monthShort} {year} {hour24}:{minute}:{second}',

  // US formats
  US_DATE: '{month}/{day}/{year}',
  US_DATE_LONG: '{monthFull} {day}, {year}',
  US_TIME_12: '{hour}:{minute} {AMPM}',
  US_TIME_24: '{hour24}:{minute}',
  US_DATETIME: '{month}/{day}/{year} {hour}:{minute} {AMPM}',

  // EU formats
  EU_DATE: '{day}/{month}/{year}',
  EU_DATE_LONG: '{day} {monthFull} {year}',
  EU_DATETIME: '{day}/{month}/{year} {hour24}:{minute}',

  // Sortable
  SORTABLE: '{year}{month}{day}',
  SORTABLE_DATETIME: '{year}{month}{day}{hour24}{minute}{second}',

  // Logging
  LOG: '{year}-{month}-{day} {hour24}:{minute}:{second}',
  LOG_MS: '{year}-{month}-{day} {hour24}:{minute}:{second}.{ms}',

  // Human readable
  FRIENDLY_DATE: '{weekday}, {monthFull} {day}',
  FRIENDLY_DATETIME: '{weekday}, {monthFull} {day} at {hour}:{minute} {AMPM}',
  SHORT: '{monthShort} {day}',
  LONG: '{monthFull} {day}, {year}',

  // Relative-friendly
  TIME_ONLY: '{hour}:{minute} {AMPM}',
  DATE_ONLY: '{monthShort} {day}, {year}',
}

// ============================================================================
// TIME CONSTANTS
// ============================================================================

/**
 * Duration in milliseconds
 */
export const DURATION_MS = {
  MILLISECOND: 1,
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH_AVG: 30.44 * 24 * 60 * 60 * 1000,  // Average month
  YEAR_AVG: 365.25 * 24 * 60 * 60 * 1000,  // Average year (accounting for leap)
} as const

/**
 * Duration in seconds
 */
export const DURATION_SEC = {
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  WEEK: 604800,
  MONTH_AVG: 2629746,  // 30.44 days
  YEAR_AVG: 31556952,  // 365.25 days
} as const

/**
 * Time units for iteration
 */
export const TIME_UNITS = [
  'millisecond', 'milliseconds',
  'second', 'seconds',
  'minute', 'minutes',
  'hour', 'hours',
  'day', 'days',
  'week', 'weeks',
  'month', 'months',
  'year', 'years',
] as const

/**
 * Days of the week
 */
export const WEEKDAYS = {
  NAMES: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const,
  NAMES_SHORT: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const,
  INDICES: { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 } as const,
}

/**
 * Months of the year
 */
export const MONTHS = {
  NAMES: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const,
  NAMES_SHORT: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const,
  DAYS: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const,
  DAYS_LEAP: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const,
}

/**
 * Check if a year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

/**
 * Get days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28
  }
  return MONTHS.DAYS[month - 1]
}
`
