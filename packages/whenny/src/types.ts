/**
 * Whenny Types
 *
 * Core type definitions for the Whenny date library.
 */

// ============================================================================
// INPUT TYPES
// ============================================================================

/**
 * Any valid input that can be converted to a date
 */
export type DateInput = Date | string | number | Whenny

/**
 * Valid timezone identifiers (IANA timezone names)
 */
export type Timezone = string

/**
 * Time units for arithmetic and comparison
 */
export type TimeUnit =
  | 'millisecond' | 'milliseconds'
  | 'second' | 'seconds'
  | 'minute' | 'minutes'
  | 'hour' | 'hours'
  | 'day' | 'days'
  | 'week' | 'weeks'
  | 'month' | 'months'
  | 'year' | 'years'

/**
 * Day of the week
 */
export type DayOfWeek =
  | 'sunday' | 'monday' | 'tuesday' | 'wednesday'
  | 'thursday' | 'friday' | 'saturday'

// ============================================================================
// FORMAT TOKENS
// ============================================================================

/**
 * Available format tokens for custom format strings
 */
export type FormatToken =
  // Year
  | 'year'        // 2024
  | 'yearShort'   // 24
  // Month
  | 'month'       // 01
  | 'monthShort'  // Jan
  | 'monthFull'   // January
  // Day
  | 'day'         // 15
  | 'dayOrdinal'  // 15th
  | 'weekday'     // Monday
  | 'weekdayShort'// Mon
  // Time
  | 'hour'        // 15 or 3 (based on config)
  | 'hour24'      // 15
  | 'hour12'      // 3
  | 'minute'      // 30
  | 'second'      // 00
  | 'millisecond' // 000
  | 'ampm'        // pm
  | 'AMPM'        // PM
  // Timezone
  | 'timezone'    // EST
  | 'offset'      // -05:00
  | 'offsetShort' // -5

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * Relative time configuration
 */
export interface RelativeConfig {
  // Past
  justNow: string
  secondsAgo: (n: number) => string
  minutesAgo: (n: number) => string
  hoursAgo: (n: number) => string
  yesterday: string
  daysAgo: (n: number) => string
  weeksAgo: (n: number) => string
  monthsAgo: (n: number) => string
  yearsAgo: (n: number) => string

  // Future
  inSeconds: (n: number) => string
  inMinutes: (n: number) => string
  inHours: (n: number) => string
  tomorrow: string
  inDays: (n: number) => string
  inWeeks: (n: number) => string
  inMonths: (n: number) => string
  inYears: (n: number) => string

  // Thresholds (in seconds)
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

/**
 * Smart formatting bucket
 */
export interface SmartBucket {
  within?: 'minute' | 'hour' | 'today' | 'yesterday' | 'week' | 'month' | 'year'
  older?: boolean
  show: string | 'relative'
}

/**
 * Smart formatting configuration
 */
export interface SmartConfig {
  buckets: SmartBucket[]
  futureBuckets?: SmartBucket[]
}

/**
 * Comparison configuration
 */
export interface CompareConfig {
  before: string
  after: string
  apart: string
  simultaneous: string
}

/**
 * Duration style configuration
 */
export interface DurationStyleConfig {
  hours: (n: number) => string
  minutes: (n: number) => string
  seconds: (n: number) => string
  separator: string
}

/**
 * Duration configuration
 */
export interface DurationConfig {
  long: DurationStyleConfig
  compact: DurationStyleConfig
  defaultStyle: 'long' | 'compact'
}

/**
 * Format presets and settings
 */
export interface FormatConfig {
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

/**
 * Style configuration - semantic date format tokens (like Tailwind's design tokens)
 *
 * T-shirt sizes for progressive detail:
 * - xs: minimal (numeric only)
 * - sm: short (abbreviated)
 * - md: medium (default readable)
 * - lg: long (full names)
 * - xl: extra long (includes weekday)
 *
 * Plus semantic styles for specific use cases:
 * - time: time only
 * - sortable: YYYY-MM-DD
 * - log: YYYY-MM-DD HH:mm:ss
 * - iso: ISO 8601
 */
export interface StylesConfig {
  // T-shirt sizes (progressive detail)
  xs: string       // "2/3" - minimal
  sm: string       // "Feb 3" - short
  md: string       // "Feb 3, 2026" - medium (default)
  lg: string       // "February 3rd, 2026" - long
  xl: string       // "Tuesday, February 3rd, 2026" - extra long

  // Semantic styles
  time: string     // "3:30 PM" - time only
  sortable: string // "2026-02-03" - machine-sortable
  log: string      // "2026-02-03 15:30:45" - for logs
  iso: string      // ISO 8601 format

  // Allow custom styles
  [key: string]: string
}

/**
 * Calendar configuration
 */
export interface CalendarConfig {
  weekStartsOn: DayOfWeek
  businessDays: DayOfWeek[]
}

/**
 * Natural language configuration
 */
export interface NaturalConfig {
  morning: number
  afternoon: number
  evening: number
  night: number
}

/**
 * Server behavior configuration
 */
export interface ServerConfig {
  requireTimezone: boolean
  fallbackFormat: 'iso' | 'utc' | 'long'
  warnOnMissingTimezone: boolean
}

/**
 * Personality configuration
 */
export interface PersonalityConfig {
  enabled: boolean
  messages: {
    [key: string]: string
  }
}

/**
 * Complete Whenny configuration
 */
export interface WhennyConfig {
  locale: string
  defaultTimezone: Timezone
  relative: RelativeConfig
  smart: SmartConfig
  compare: CompareConfig
  duration: DurationConfig
  formats: FormatConfig
  styles: StylesConfig
  calendar: CalendarConfig
  natural: NaturalConfig
  server: ServerConfig
  personality: PersonalityConfig
}

/**
 * Partial configuration for user overrides
 */
export type WhennyUserConfig = DeepPartial<WhennyConfig>

/**
 * Deep partial utility type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// ============================================================================
// TRANSFER PROTOCOL
// ============================================================================

/**
 * Transfer payload for server/browser communication
 */
export interface TransferPayload {
  /** ISO 8601 timestamp in UTC */
  iso: string
  /** IANA timezone name of the origin */
  originZone: Timezone
  /** Offset from UTC in minutes */
  originOffset: number
}

// ============================================================================
// CORE WHENNY INTERFACE
// ============================================================================

/**
 * Smart formatting options
 */
export interface SmartOptions {
  /** Timezone to format for */
  for?: Timezone
  /** Reference date (instead of now) */
  from?: DateInput
}

/**
 * Relative time options
 */
export interface RelativeOptions {
  /** Reference date (instead of now) */
  from?: DateInput
}

/**
 * The main Whenny instance interface
 */
export interface Whenny {
  /** Get the underlying Date object */
  toDate(): Date

  /** Get Unix timestamp in milliseconds */
  valueOf(): number

  /** Get Unix timestamp in seconds */
  unix(): number

  /** Get ISO 8601 string */
  toISO(): string

  /** Check if the date is valid */
  isValid(): boolean

  // ─────────────────────────────────────────────────────────
  // STYLE PROPERTIES (primary API - like Tailwind tokens)
  // ─────────────────────────────────────────────────────────

  /** Extra small: "2/3" - minimal numeric */
  readonly xs: string

  /** Small: "Feb 3" - abbreviated */
  readonly sm: string

  /** Medium: "Feb 3, 2026" - default readable */
  readonly md: string

  /** Large: "February 3rd, 2026" - full names */
  readonly lg: string

  /** Extra large: "Tuesday, February 3rd, 2026" - includes weekday */
  readonly xl: string

  /** Time only: "3:30 PM" */
  readonly clock: string

  /** Sortable: "2026-02-03" - machine-sortable */
  readonly sortable: string

  /** Log format: "2026-02-03 15:30:45" - for logs */
  readonly log: string

  // ─────────────────────────────────────────────────────────
  // FORMATTING (methods - kept for backward compat & custom)
  // ─────────────────────────────────────────────────────────

  /** Format with custom template */
  format(template: string): string

  /** Short format: "Jan 15" */
  short(): string

  /** Long format: "January 15, 2024" */
  long(): string

  /** ISO format: "2024-01-15T15:30:00Z" */
  iso(): string

  /** Time only: "3:30 PM" */
  time(): string

  /** Date and time: "Jan 15, 3:30 PM" */
  datetime(): string

  // ─────────────────────────────────────────────────────────
  // RELATIVE TIME
  // ─────────────────────────────────────────────────────────

  /** Relative time from now: "5 minutes ago" */
  relative(options?: RelativeOptions): string

  /** Alias for relative() */
  fromNow(): string

  /** Relative time from another date */
  from(date: DateInput): string

  /** Alias for from() */
  since(date: DateInput): string

  // ─────────────────────────────────────────────────────────
  // SMART FORMATTING
  // ─────────────────────────────────────────────────────────

  /** Context-aware smart formatting */
  smart(options?: SmartOptions): string

  // ─────────────────────────────────────────────────────────
  // COMPARISON
  // ─────────────────────────────────────────────────────────

  /** Compare to another date */
  to(date: DateInput): WhennyComparison

  /** Get distance to another date */
  distance(date: DateInput): WhennyDistance

  // ─────────────────────────────────────────────────────────
  // TIMEZONE
  // ─────────────────────────────────────────────────────────

  /** Convert to a specific timezone */
  inZone(timezone: Timezone): Whenny

  /** Convert to local timezone */
  local(): Whenny

  /** Convert to UTC */
  utc(): Whenny

  /** Get the timezone */
  zone: Timezone

  /** Get offset from UTC in minutes */
  offset: number

  /** Get offset as string: "-05:00" */
  offsetString: string

  // ─────────────────────────────────────────────────────────
  // TRANSFER PROTOCOL
  // ─────────────────────────────────────────────────────────

  /** Create transfer payload for API calls */
  transfer(): TransferPayload

  /** Get start of day in origin timezone (as UTC) */
  startOfDayInOrigin(): Date

  /** Get end of day in origin timezone (as UTC) */
  endOfDayInOrigin(): Date

  /** Get day bounds in origin timezone */
  dayBoundsInOrigin(): { start: Date; end: Date }

  // ─────────────────────────────────────────────────────────
  // PARTS
  // ─────────────────────────────────────────────────────────

  year: number
  month: number       // 1-12
  day: number         // 1-31
  weekday: number     // 0-6 (Sunday = 0)
  hour: number        // 0-23
  minute: number      // 0-59
  second: number      // 0-59
  millisecond: number // 0-999

  // ─────────────────────────────────────────────────────────
  // CALENDAR OPERATIONS
  // ─────────────────────────────────────────────────────────

  /** Get start of unit */
  startOf(unit: 'day' | 'week' | 'month' | 'year', options?: { in?: Timezone }): Whenny

  /** Get end of unit */
  endOf(unit: 'day' | 'week' | 'month' | 'year', options?: { in?: Timezone }): Whenny

  /** Add time */
  add(amount: number, unit: TimeUnit): Whenny

  /** Subtract time */
  subtract(amount: number, unit: TimeUnit): Whenny
}

/**
 * Comparison result interface
 */
export interface WhennyComparison {
  /** Smart formatted comparison: "3 days before" */
  smart(): string

  /** Difference in specific units */
  days(): number
  hours(): number
  minutes(): number
  seconds(): number
  milliseconds(): number

  /** Is the original date before the compared date? */
  isBefore(): boolean

  /** Is the original date after the compared date? */
  isAfter(): boolean

  /** Are the dates the same? */
  isSame(unit?: 'day' | 'hour' | 'minute' | 'second'): boolean
}

/**
 * Distance result interface
 */
export interface WhennyDistance {
  /** Human readable distance: "3 days" */
  human(): string

  /** Exact distance: "3 days, 4 hours, 30 minutes" */
  exact(): string

  /** Get raw values */
  days: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
}

// ============================================================================
// DURATION INTERFACE
// ============================================================================

/**
 * Duration instance interface
 */
export interface WhennyDuration {
  /** Long format: "2 hours, 30 minutes" */
  long(): string

  /** Compact format: "2h 30m 15s" */
  compact(): string

  /** Brief format - no seconds unless < 1 min: "2h 30m" */
  brief(): string

  /** Clock format: "2:30:00" */
  clock(): string

  /** Timer format - always padded: "02:30:00" */
  timer(): string

  /** Minimal format - largest unit only: "2h" */
  minimal(): string

  /** Human approximation: "about 2 hours" */
  human(): string

  /** Parts */
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
  totalMinutes: number
  totalHours: number
}

// ============================================================================
// CALENDAR HELPERS INTERFACE
// ============================================================================

/**
 * Day bounds result
 */
export interface DayBounds {
  start: Date
  end: Date
}

/**
 * Calendar helper options
 */
export interface CalendarOptions {
  for?: Timezone
}
